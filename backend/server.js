const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const admin = require('firebase-admin');

dotenv.config();

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized via service account');
  } else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
    console.log('Firebase Admin initialized via application default credentials');
  } else {
    console.warn('Firebase Admin not initialized: Missing credentials');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
}

const db = admin.apps && admin.apps.length > 0 ? admin.firestore() : null;

const app = express();

const corsOptions = {
  origin: [
    'https://the-cake-loungue.vercel.app',
    'https://thecakelounge.in',
    'https://www.thecakelounge.in',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  } else {
    console.warn('CRITICAL: Razorpay keys missing. Razorpay features will not work.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

app.get('/', (req, res) => {
  res.json({
    message: 'Cake Lounge backend is running',
    environment: process.env.NODE_ENV || 'development',
    razorpayConfigured: !!razorpay
  });
});

// Create Order for Razorpay
app.post('/api/orders', async (req, res) => {
  try {
    const { totalAmount, items, customerName, customerEmail, customerPhone } = req.body;

    if (!totalAmount || !items || !items.length) {
      return res.status(400).json({ error: 'Missing order details: amount and items are required' });
    }

    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server' });
    }

    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const options = {
      amount: Math.round(Number(totalAmount) * 100), // amount in the smallest currency unit (paise for INR)
      currency: 'INR',
      receipt,
    };

    console.log('Creating Razorpay order:', options);
    const order = await razorpay.orders.create(options);

    res.json({
      order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      error: error.description || error.message || 'Failed to create Razorpay order'
    });
  }
});

// Verify Payment Signature and Store Order
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification fields'
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Razorpay secret key is not configured'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      console.log('Payment verified successfully:', razorpay_payment_id);

      // Backend Validation for Delivery Date
      if (orderDetails && orderDetails.deliveryDate) {
        const deliveryDate = new Date(orderDetails.deliveryDate);
        const deliveryType = orderDetails.deliveryType || 'Standard';
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        deliveryDate.setHours(0, 0, 0, 0);

        // Standard lead time: 1 day (tomorrow).
        // If ordered after 6 PM, some might argue for 2 days,
        // but let's stick to simple day difference for now.
        const diffDays = Math.round((deliveryDate - today) / (1000 * 60 * 60 * 24));
        const minDays = deliveryType === 'Custom' ? 2 : 1;

        if (diffDays < minDays) {
          console.error(`Invalid delivery date for ${deliveryType} order: ${orderDetails.deliveryDate}`);
          return res.status(400).json({
            success: false,
            error: `Invalid delivery date. ${deliveryType} cakes require at least ${minDays} day(s) lead time.`
          });
        }
      }

      // Store order in Firestore if db is initialized
      if (db && orderDetails) {
        try {
          const orderRef = db.collection('orders').doc(razorpay_order_id);
          const doc = await orderRef.get();

          if (!doc.exists) {
            const orderDoc = {
              ...orderDetails,
              paymentId: razorpay_payment_id,
              razorpayOrderId: razorpay_order_id,
              paymentSignature: razorpay_signature,
              paymentStatus: 'Paid',
              status: orderDetails.status || 'Confirmed',
              createdAt: orderDetails.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await orderRef.set(orderDoc);
            console.log('Order stored successfully in Firestore:', razorpay_order_id);

            // SIMULATED OWNER NOTIFICATION
            console.log('-------------------------------------------');
            console.log('NEW ORDER RECEIVED - OWNER NOTIFICATION');
            console.log('Order ID:', razorpay_order_id);
            console.log('Customer:', orderDetails.customer?.name);
            console.log('Phone:', orderDetails.customer?.phone);
            console.log('Total Amount: ₹', orderDetails.totalAmount);
            console.log('Items:', orderDetails.items?.map(i => `${i.name} (x${i.quantity})`).join(', '));
            console.log('Address:', orderDetails.shippingAddress);
            console.log('-------------------------------------------');
          }
        } catch (dbError) {
          console.error('Error storing order in Firestore:', dbError);
          return res.status(500).json({
            success: false,
            error: 'Payment verified but failed to save order. Please contact support.'
          });
        }
      } else if (!db) {
        console.error('Firestore not initialized, cannot store order');
        return res.status(500).json({
          success: false,
          error: 'Backend configuration error: Database not reachable'
        });
      }

      return res.json({
        success: true,
        message: 'Payment verified and order stored successfully'
      });
    }

    console.warn('Payment verification failed for order:', razorpay_order_id);
    res.status(400).json({
      success: false,
      error: 'Signature verification failed'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Verification failed'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
