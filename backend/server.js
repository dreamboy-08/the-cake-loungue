const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Razorpay = require('razorpay');

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'https://the-cake-loungue.vercel.app',
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

// Verify Payment Signature
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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
      return res.json({
        success: true,
        message: 'Payment verified successfully'
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
