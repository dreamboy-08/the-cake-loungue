const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Razorpay = require('razorpay');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function hasRazorpayKeys() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

app.get('/', (req, res) => {
  res.json({
    message: 'Cake Lounge backend is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ error: 'amount and receipt are required' });
    }

    const options = {
      amount: Number(amount) * 100,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { totalAmount, items, customerName, customerEmail, customerPhone } = req.body;

    if (!totalAmount || !items || !items.length || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'Missing order details' });
    }

    if (!hasRazorpayKeys()) {
      return res.status(500).json({ error: 'Razorpay keys are missing in backend/.env' });
    }

    const receipt = `receipt_${Date.now()}`;
    const options = {
      amount: Number(totalAmount) * 100,
      currency: 'INR',
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id' });
  } catch (error) {
    res.status(500).json({ error: error.description || error.message || 'Failed to create order' });
  }
});

app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_your_key_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.json({ success: true });
    }

    res.status(400).json({ success: false, error: 'Signature verification failed' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Verification failed' });
  }
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
