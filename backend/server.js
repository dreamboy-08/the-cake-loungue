const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const { initializeApp, cert, getApps, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

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

const VALID_SLOTS = [
  "10:00 AM – 12:00 PM",
  "12:00 PM – 02:00 PM",
  "02:00 PM – 04:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
  "08:00 PM – 10:00 PM",
  "10:00 PM – 12:00 AM (Midnight Delivery)"
];

function validateDeliveryDate(dateStr, items = []) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, error: 'Invalid date format. Expected YYYY-MM-DD.' };
  }

  const deliveryDateObj = new Date(dateStr + 'T00:00:00');
  if (isNaN(deliveryDateObj.getTime())) {
    return { valid: false, error: 'Invalid date.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deliveryDateObj.getTime() <= today.getTime()) {
    return { valid: false, error: 'Same-day and past deliveries are not allowed.' };
  }

  const hasCustomCake = items.some(item => {
    const category = item.category || '';
    return category === 'Custom Cakes' || item.name.toLowerCase().includes('custom');
  });

  const minDays = hasCustomCake ? 2 : 1;
  const minRequiredDateObj = new Date(today);
  minRequiredDateObj.setDate(today.getDate() + minDays);

  if (deliveryDateObj.getTime() < minRequiredDateObj.getTime()) {
    return {
      valid: false,
      error: `Custom cakes require at least 2 days preparation. Minimum selectable date is ${minRequiredDateObj.toISOString().split('T')[0]}`
    };
  }

  return { valid: true };
}

const DEFAULT_GENERAL_SETTINGS = {
  deliveryCharges: 50,
  deliveryChargesEnabled: true,
  freeDeliveryThreshold: 499,
  freeDeliveryThresholdEnabled: true,
};

async function fetchGeneralSettings(db, reqSettings = null) {
  if (db) {
    try {
      const docSnap = await db.collection('settings').doc('general_cms_config').get();
      if (docSnap.exists) {
        return {
          ...DEFAULT_GENERAL_SETTINGS,
          ...docSnap.data()
        };
      }
    } catch (err) {
      console.warn('[Server] Could not fetch general_cms_config from Firestore:', err.message);
    }
  }
  if (reqSettings && typeof reqSettings === 'object') {
    return {
      ...DEFAULT_GENERAL_SETTINGS,
      ...reqSettings
    };
  }
  return DEFAULT_GENERAL_SETTINGS;
}

function calculateExpectedAmount(items, deliveryTimeSlot, generalSettings = DEFAULT_GENERAL_SETTINGS) {
  let subtotal = 0;
  for (const item of (items || [])) {
    const price = Number(item.price);
    const qty = Number(item.quantity) || 1;
    subtotal += price * qty;
  }

  const rawFee = generalSettings?.deliveryCharges ?? DEFAULT_GENERAL_SETTINGS.deliveryCharges;
  const deliveryChargesEnabled = generalSettings?.deliveryChargesEnabled ?? DEFAULT_GENERAL_SETTINGS.deliveryChargesEnabled ?? true;
  const rawThreshold = generalSettings?.freeDeliveryThreshold ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThreshold;
  const freeDeliveryThresholdEnabled = generalSettings?.freeDeliveryThresholdEnabled ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThresholdEnabled ?? true;

  const deliveryCharges = isNaN(Number(rawFee)) || Number(rawFee) < 0 ? 0 : Math.round(Number(rawFee));
  const freeDeliveryThreshold = isNaN(Number(rawThreshold)) || Number(rawThreshold) < 0 ? 0 : Math.round(Number(rawThreshold));

  let shippingFee = deliveryCharges;

  if (!deliveryChargesEnabled || deliveryCharges === 0) {
    shippingFee = 0;
  } else if (freeDeliveryThresholdEnabled && subtotal >= freeDeliveryThreshold) {
    shippingFee = 0;
  }

  const midnightCharge = (deliveryTimeSlot === "10:00 PM – 12:00 AM (Midnight Delivery)") ? 150 : 0;

  return subtotal + shippingFee + midnightCharge;
}

// Helper to authenticate admin for admin-only API requests
async function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization || '';
  let callerUid = null;
  let callerEmail = null;

  if (authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    if (getApps().length > 0) {
      try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        callerUid = decodedToken.uid;
        callerEmail = decodedToken.email;
      } catch (err) {
        console.warn('[Server] Token verification failed:', err.message);
      }
    } else {
      // In dev mode when Firebase Admin service account is not initialized, safely parse JWT payload
      try {
        const payloadBase64 = idToken.split('.')[1];
        if (payloadBase64) {
          const payloadJson = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          callerUid = payloadJson.user_id || payloadJson.sub || payloadJson.uid;
          callerEmail = payloadJson.email;
        }
      } catch (err) {
        console.warn('[Server] Could not parse token payload in dev mode:', err.message);
      }
    }
  }

  // Fallback strictly for automated testing environment when test admin header is sent
  if (!callerUid && process.env.NODE_ENV === 'test' && req.headers['x-admin-caller-uid']) {
    callerUid = req.headers['x-admin-caller-uid'];
    callerEmail = req.headers['x-admin-caller-email'] || 'admin@cakelounge.com';
  }

  if (!callerUid) {
    return { authenticated: false, isAuthorizedAdmin: false, error: 'Unauthorized: Missing or invalid authentication token' };
  }

  // If database is available, verify role in Firestore
  if (db) {
    try {
      const userDoc = await db.collection('users').doc(callerUid).get();
      if (!userDoc.exists) {
        return { authenticated: true, isAuthorizedAdmin: false, callerUid, error: 'Forbidden: Caller profile not found' };
      }
      const userData = userDoc.data();
      const role = userData?.role;
      if (role !== 'admin' && role !== 'super_admin') {
        return { authenticated: true, isAuthorizedAdmin: false, callerUid, error: 'Forbidden: Admin privileges required' };
      }
      return { authenticated: true, isAuthorizedAdmin: true, callerUid, callerEmail: userData.email || callerEmail };
    } catch (err) {
      console.error('[Server] Error verifying admin role in Firestore:', err);
      return { authenticated: true, isAuthorizedAdmin: false, callerUid, error: 'Internal server error during authorization check' };
    }
  }

  // Fallback in mock/test mode without Firestore connection
  const isMockAdmin = (callerEmail && callerEmail.toLowerCase().includes('admin')) || callerUid.toLowerCase().includes('admin');
  if (isMockAdmin) {
    return { authenticated: true, isAuthorizedAdmin: true, callerUid, callerEmail };
  }

  return { authenticated: true, isAuthorizedAdmin: false, callerUid, error: 'Forbidden: Admin privileges required' };
}

// Helper to authenticate customer requests and ensure email verification
async function verifyCustomerAuth(req) {
  const authHeader = req.headers.authorization || '';
  let uid = null;
  let email = null;
  let emailVerified = false;

  if (authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    if (getApps().length > 0) {
      try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        email = decodedToken.email || null;
        emailVerified = decodedToken.email_verified === true;
      } catch (err) {
        console.warn('[Server] Customer token verification failed:', err.message);
        return { authenticated: false, emailVerified: false, error: 'Unauthorized: Invalid authentication token' };
      }
    } else {
      // Dev/mock fallback when Firebase Admin service account is unconfigured
      try {
        const payloadBase64 = idToken.split('.')[1];
        if (payloadBase64) {
          const payloadJson = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          uid = payloadJson.user_id || payloadJson.sub || payloadJson.uid;
          email = payloadJson.email || null;
          emailVerified = payloadJson.email_verified === true || payloadJson.emailVerified === true;
        }
      } catch (err) {
        console.warn('[Server] Could not parse customer token payload in dev mode:', err.message);
      }
    }
  }

  // Fallback for automated testing environment with mock caller headers
  if (!uid && (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')) {
    if (req.headers['x-test-customer-uid']) {
      uid = req.headers['x-test-customer-uid'];
      email = req.headers['x-test-customer-email'] || 'testcustomer@cakelounge.com';
      emailVerified = req.headers['x-test-email-verified'] === 'true';
    }
  }

  if (!uid) {
    return { authenticated: false, emailVerified: false, error: 'Unauthorized: Authentication required to place orders' };
  }

  // In production/Firebase Admin mode, strictly check emailVerified
  if (!emailVerified && process.env.NODE_ENV === 'production') {
    return { authenticated: true, emailVerified: false, uid, email, error: 'Forbidden: Email verification required before placing orders' };
  }

  return { authenticated: true, emailVerified: true, uid, email };
}

// In-memory set to prevent duplicate confirmation emails when requests are retried
const sentOrderConfirmationEmails = new Set();

async function sendOrderNotifications(orderDetails, verifiedRecipientEmail, orderId) {
  if (!orderId) {
    orderId = orderDetails?.orderId || orderDetails?.razorpayOrderId || `order_${Date.now()}`;
  }

  // Deduplication check
  if (sentOrderConfirmationEmails.has(orderId)) {
    console.log(`[Order Email] Confirmation email already sent for order ID ${orderId}. Skipping duplicate.`);
    return { sent: true, duplicateSkipped: true };
  }

  const recipientEmail = verifiedRecipientEmail || orderDetails?.customerEmail || orderDetails?.customer?.email;

  if (!recipientEmail || recipientEmail === 'guest@example.com' || recipientEmail === 'deleted@anonymized.local') {
    console.warn(`[Order Email] No valid recipient email address available for order ${orderId}`);
    return { sent: false, reason: 'No valid recipient email address' };
  }

  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!smtpConfigured) {
    console.warn(`[Order Email] SMTP service not configured on server. Order confirmation email for ${orderId} could not be sent.`);
    console.log(`--- ORDER CONFIRMATION EMAIL (UNCONFIGURED SMTP) ---`);
    console.log(`To: ${recipientEmail}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Total Amount: ₹${orderDetails?.totalAmount}`);
    console.log(`-----------------------------------------------------`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const itemsSummary = (orderDetails?.items || []).map((item, i) =>
      `${i + 1}. ${item.name} (${item.weight || '0.5 Kg'}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');

    const mailOptions = {
      from: `"The Cake Lounge" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Order Confirmation – #${orderId.toUpperCase()} – The Cake Lounge`,
      text: `
Dear ${orderDetails?.customerName || orderDetails?.customer?.name || 'Valued Customer'},

Thank you for your order with The Cake Lounge! We have received your order and payment.

ORDER DETAILS
Order ID: #${orderId.toUpperCase()}
Date & Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Payment Status: Paid
Total Amount: ₹${orderDetails?.totalAmount}

ITEMS ORDERED
${itemsSummary}

DELIVERY SCHEDULE
Delivery Date: ${orderDetails?.deliveryDate || 'Not specified'}
Delivery Time Slot: ${orderDetails?.deliveryTimeSlot || 'Standard Delivery'}

SHIPPING ADDRESS
${orderDetails?.shippingAddress || 'Address on file'}

If you have any questions regarding your order, please contact us on WhatsApp at +91 77038 70170 or reply to this email.

Warm regards,
The Cake Lounge Patisserie
https://www.thecakelounge.in
      `,
    };

    await transporter.sendMail(mailOptions);
    sentOrderConfirmationEmails.add(orderId);
    console.log(`[Order Email] Confirmation email sent successfully to verified address: ${recipientEmail} for order: ${orderId}`);
    return { sent: true };
  } catch (err) {
    console.error(`[Order Email] Failed to send confirmation email to ${recipientEmail}:`, err.message);
    return { sent: false, error: err.message };
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'The Cake Lounge backend is running',
    environment: process.env.NODE_ENV || 'development',
    razorpayConfigured: !!razorpay,
    firebaseConfigured: !!db
  });
});

// Create Order for Razorpay
app.post('/api/orders', async (req, res) => {
  try {
    // Verify customer authentication and email verification
    const authResult = await verifyCustomerAuth(req);
    if ((!authResult.authenticated || !authResult.emailVerified) && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: authResult.error || 'Email verification required before placing orders' });
    }

    const { totalAmount, items, customerName, customerEmail, customerPhone, deliveryDate, deliveryTimeSlot, generalSettings: reqGeneralSettings } = req.body;

    if (!totalAmount || !items || !items.length) {
      return res.status(400).json({ error: 'Missing order details: amount and items are required' });
    }

    // 1. Validate date
    const dateCheck = validateDeliveryDate(deliveryDate, items);
    if (!dateCheck.valid) {
      return res.status(400).json({ error: dateCheck.error });
    }

    // 2. Validate time slot
    if (!deliveryTimeSlot || !VALID_SLOTS.includes(deliveryTimeSlot)) {
      return res.status(400).json({ error: 'Invalid or missing delivery time slot.' });
    }

    // 3. Verify totalAmount matches recalculation with CMS generalSettings
    const generalSettings = await fetchGeneralSettings(db, reqGeneralSettings);
    const expectedAmount = calculateExpectedAmount(items, deliveryTimeSlot, generalSettings);
    if (Math.round(totalAmount) !== Math.round(expectedAmount)) {
      return res.status(400).json({ error: `Mismatched order total amount. Expected ₹${expectedAmount}, got ₹${totalAmount}. Request may be manipulated.` });
    }

    if (!razorpay) {
      const currentEnv = process.env.NODE_ENV || 'development';
      if (currentEnv === 'test' || currentEnv === 'development') {
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

      // Validate order details to prevent any parameter tampering
      if (orderDetails) {
        const dateCheck = validateDeliveryDate(orderDetails.deliveryDate, orderDetails.items);
        if (!dateCheck.valid) {
          return res.status(400).json({ success: false, error: dateCheck.error });
        }

        if (!orderDetails.deliveryTimeSlot || !VALID_SLOTS.includes(orderDetails.deliveryTimeSlot)) {
          return res.status(400).json({ success: false, error: 'Invalid or missing delivery time slot.' });
        }

        const generalSettings = await fetchGeneralSettings(db, orderDetails.generalSettings);
        const expectedAmount = calculateExpectedAmount(orderDetails.items, orderDetails.deliveryTimeSlot, generalSettings);
        if (Math.round(orderDetails.totalAmount) !== Math.round(expectedAmount)) {
          return res.status(400).json({ success: false, error: `Mismatched order details total amount. Expected ₹${expectedAmount}, got ₹${orderDetails.totalAmount}.` });
        }
      }

      // Customer authentication and email verification check
      const authResult = await verifyCustomerAuth(req);
      let verifiedEmail = authResult.email || null;

      // In production mode, require authenticated & verified email
      if ((!authResult.authenticated || !authResult.emailVerified) && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, error: authResult.error || 'Email verification required before completing payment' });
      }

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

            // Ensure customer email in orderDoc reflects trusted verified auth email if available
            if (verifiedEmail) {
              orderDoc.customer = {
                ...orderDoc.customer,
                email: verifiedEmail
              };
              orderDoc.customerEmail = verifiedEmail;
            }

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

            // Send confirmation email to trusted verified customer address
            await sendOrderNotifications(orderDoc, verifiedEmail, razorpay_order_id);
          } else {
            console.log('Master doc already exists in Firestore for order:', razorpay_order_id);
            // Retry case: attempt sending confirmation email if deduplicated
            await sendOrderNotifications(orderDetails, verifiedEmail, razorpay_order_id);
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
          console.log('Firestore not initialized, but in test/dev mode. Triggering notifications in mock mode.');
          const notificationOrderPayload = {
            ...orderDetails,
            orderId: razorpay_order_id,
            razorpayOrderId: razorpay_order_id,
            customerName: orderDetails?.customer?.name,
            customerEmail: verifiedEmail || orderDetails?.customer?.email,
            customerPhone: orderDetails?.customer?.phone,
          };
          await sendOrderNotifications(notificationOrderPayload, verifiedEmail, razorpay_order_id);
          return res.json({
            success: true,
            message: 'Simulated: Payment verified, order processed, and notifications dispatched'
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
      from: `"The Cake Lounge Website" <${process.env.SMTP_USER}>`,
      to: 'thecakeloungegurgaon@gmail.com',
      replyTo: email,
      subject: 'New Contact Form Inquiry – The Cake Lounge',
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

// Fallback for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = {
  app,
  calculateExpectedAmount,
  fetchGeneralSettings,
  DEFAULT_GENERAL_SETTINGS
};
