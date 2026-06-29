const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const { initializeApp, cert, getApps, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

dotenv.config();

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Attempting to initialize Firebase Admin via FIREBASE_SERVICE_ACCOUNT...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin initialized via service account');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    console.log('Attempting to initialize Firebase Admin via individual credentials...');
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized via individual credentials');
  } else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.log('Attempting to initialize Firebase Admin via application default credentials...');
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
    console.log('Firebase Admin initialized via application default credentials');
  } else {
    console.warn('Firebase Admin not initialized: Missing credentials (FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY)');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
}

const db = getApps().length > 0 ? getFirestore() : null;

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
    razorpayConfigured: !!razorpay,
    firebaseConfigured: !!db
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
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        console.log('Razorpay missing, but in test/dev mode. Simulating order creation.');
        return res.json({
          order: {
            id: `order_test_${Date.now()}`,
            amount: Math.round(Number(totalAmount) * 100),
            currency: 'INR',
          },
          keyId: 'rzp_test_mock_key'
        });
      }
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

    console.log('--- VERIFICATION ATTEMPT ---');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Signature:', razorpay_signature);

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

      // Store order in Firestore if db is initialized
      if (db && orderDetails) {
        try {
          const masterOrderRef = db.collection('orders').doc(razorpay_order_id);
          const masterDoc = await masterOrderRef.get();

          if (!masterDoc.exists) {
            const orderDoc = {
              ...orderDetails,
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              razorpayOrderId: razorpay_order_id,
              paymentSignature: razorpay_signature,
              paymentStatus: 'Paid',
              status: orderDetails.status || 'Confirmed',
              createdAt: orderDetails.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Save to master orders collection
            await masterOrderRef.set(orderDoc);
            console.log('Order stored in master collection:', razorpay_order_id);

            // Save to user-specific orders collection if userId is present and not 'guest'
            if (orderDetails.userId && orderDetails.userId !== 'guest') {
              const userOrderRef = db
                .collection('users')
                .doc(orderDetails.userId)
                .collection('orders')
                .doc(razorpay_order_id);

              await userOrderRef.set(orderDoc);
              console.log(`Order stored in user collection for UID: ${orderDetails.userId}`);
            }

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
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
          console.log('Firestore not initialized, but in test/dev mode. Simulating success.');
          return res.json({
            success: true,
            message: 'Simulated: Payment verified but order not stored due to missing Firestore'
          });
        }
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

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, honeypot } = req.body;

    // Spam protection: check honeypot
    if (honeypot) {
      console.warn('Spam detected via honeypot field');
      return res.status(400).json({ success: false, error: 'Spam detected' });
    }

    // Server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    // Configure Nodemailer transporter
    // If SMTP credentials are not provided, we log the inquiry for admin visibility
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!smtpConfigured) {
      console.warn('SMTP not configured. Email cannot be sent.');
      console.log('--- CONTACT INQUIRY (NOT SENT) ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone || 'N/A'}`);
      console.log(`Message: ${message}`);
      console.log('----------------------------------');

      return res.status(503).json({
        success: false,
        error: 'Email service is currently unavailable. Please try again later.'
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
      from: `"Cake Lounge Website" <${process.env.SMTP_USER}>`,
      to: 'thecakeloungegurgaon@gmail.com',
      replyTo: email,
      subject: 'New Contact Form Inquiry – Cake Lounge',
      text: `
Customer Name:
${name}

Email:
${email}

Phone:
${phone || 'Not provided'}

Message:
${message}

Submitted At:
${dateTime}

Website:
https://www.thecakelounge.in
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact inquiry sent successfully from ${email}`);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later or contact us directly.'
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
