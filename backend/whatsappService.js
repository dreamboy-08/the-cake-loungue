// In-memory set for test/mock deduplication when Firestore is not initialized
const memorySentNotifications = new Set();

// In-memory log for mock provider inspection during testing/debugging
const mockWhatsAppLogs = [];

function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('910') && cleaned.length === 13) {
    cleaned = '91' + cleaned.substring(3);
  }
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

function resolveOrderVariables(order) {
  const customerName = order.customerName || order.customer?.name || 'Valued Customer';
  const customerEmail = order.customerEmail || order.customer?.email || 'N/A';
  const customerPhone = order.customerPhone || order.customer?.phone || 'N/A';
  const orderId = order.orderId || order.razorpayOrderId || 'N/A';
  const totalAmount = order.totalAmount ?? 0;
  const deliveryDate = order.deliveryDate || 'N/A';
  const deliveryTime = order.deliveryTimeSlot || order.deliveryTime || 'N/A';

  let deliveryAddress = order.shippingAddress;
  if (!deliveryAddress && order.address) {
    const parts = [
      order.address.houseNumber,
      order.address.street,
      order.address.landmark && order.address.landmark !== 'None' ? `Near ${order.address.landmark}` : null,
      order.address.area,
      order.address.city,
      order.address.state,
      order.address.pincode || order.address.zipCode,
    ].filter(Boolean);
    deliveryAddress = parts.join(', ');
  }
  if (!deliveryAddress) deliveryAddress = 'N/A';

  const rawInstructions = order.deliveryInstructions || order.specialRequests;
  const specialRequests =
    rawInstructions && String(rawInstructions).trim() && String(rawInstructions).trim() !== 'None'
      ? String(rawInstructions).trim()
      : 'None';

  const items = order.items || [];
  const itemsList = items
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price || item.unitPrice) || 0;
      const lineTotal = price * qty;
      const qtyText = qty > 1 ? ` (x${qty})` : '';
      return `• ${item.name}${qtyText} — ₹${lineTotal}`;
    })
    .join('\n');

  return {
    '{customerName}': customerName,
    '{customerPhone}': customerPhone,
    '{customerEmail}': customerEmail,
    '{orderId}': orderId,
    '{items}': itemsList,
    '{totalAmount}': totalAmount,
    '{deliveryDate}': deliveryDate,
    '{deliveryTime}': deliveryTime,
    '{deliveryAddress}': deliveryAddress,
    '{specialRequests}': specialRequests,
  };
}

function renderTemplateMessage(templateStr, variablesMap) {
  let result = templateStr || '';
  Object.keys(variablesMap).forEach((key) => {
    result = result.split(key).join(variablesMap[key]);
  });
  return result;
}

function formatCustomerOrderMessage(order, customTemplate = null) {
  const vars = resolveOrderVariables(order);
  if (customTemplate) {
    return renderTemplateMessage(customTemplate, vars);
  }

  return `🎂 *THE CAKE LOUNGE*

✨ *ORDER CONFIRMED*

Hi *${vars['{customerName}']}*,

Thank you for ordering from *The Cake Lounge*! 💛

Your payment has been successfully received and your order is now confirmed.

*ORDER DETAILS*
━━━━━━━━━━━━━━
🧾 Order ID: \`${vars['{orderId}']}\`

🍰 *Items:*
${vars['{items}']}

💰 *Total Paid: ₹${vars['{totalAmount}']}*

📅 *Delivery Date:* ${vars['{deliveryDate}']}
🕓 *Delivery Time:* ${vars['{deliveryTime}']}

📍 *Delivery Address:*
${vars['{deliveryAddress}']}

📝 *Special Requests:* ${vars['{specialRequests}']}

━━━━━━━━━━━━━━
💳 Payment: *Successful*

Thank you for choosing *The Cake Lounge*. We look forward to making your celebration extra special! 🎉

For any assistance regarding your order, simply reply to this message.

— *The Cake Lounge* 🎂`;
}

function formatAdminOrderMessage(order, customTemplate = null) {
  const vars = resolveOrderVariables(order);
  if (customTemplate) {
    return renderTemplateMessage(customTemplate, vars);
  }

  return `🚨 *THE CAKE LOUNGE — NEW ORDER*

A new order has been successfully placed.

*ORDER INFORMATION*
━━━━━━━━━━━━━━
🧾 Order ID: \`${vars['{orderId}']}\`

👤 *Customer:* ${vars['{customerName}']}
📧 *Email:* ${vars['{customerEmail}']}
📱 *Phone:* ${vars['{customerPhone}']}

🍰 *Items:*
${vars['{items}']}

💰 *Order Total:* ₹${vars['{totalAmount}']}

📅 *Delivery Date:* ${vars['{deliveryDate}']}
🕓 *Delivery Time:* ${vars['{deliveryTime}']}

📍 *Delivery Address:*
${vars['{deliveryAddress}']}

📝 *Special Requests:* ${vars['{specialRequests}']}

━━━━━━━━━━━━━━
📦 *Order Status:* New Order

Please check the admin panel for complete order details.

— *The Cake Lounge*`;
}

async function sendWhatsAppMessage(recipientPhone, messageText, type) {
  const sanitizedTo = sanitizePhoneNumber(recipientPhone);

  if (!sanitizedTo) {
    console.error(`[WhatsApp Service] Error: Recipient phone number is invalid or empty for type '${type}'.`);
    return {
      success: false,
      type,
      to: recipientPhone,
      error: 'Invalid recipient phone number',
    };
  }

  const provider = (process.env.WHATSAPP_PROVIDER || 'mock').toLowerCase();
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (provider === 'meta' && token && phoneNumberId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: sanitizedTo,
            type: 'text',
            text: {
              preview_url: false,
              body: messageText,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.messages?.[0]?.id) {
        const msgId = data.messages[0].id;
        console.log(`[WhatsApp Service - Meta] Sent ${type} to ${sanitizedTo}. Message ID: ${msgId}`);
        return {
          success: true,
          type,
          to: sanitizedTo,
          messageId: msgId,
        };
      } else {
        const errMsg = data.error?.message || JSON.stringify(data);
        console.error(`[WhatsApp Service - Meta] Response missing message ID:`, data);
        return {
          success: false,
          type,
          to: sanitizedTo,
          error: errMsg,
        };
      }
    } catch (error) {
      console.error(`[WhatsApp Service - Meta] Error sending ${type} to ${sanitizedTo}:`, error.message);
      return {
        success: false,
        type,
        to: sanitizedTo,
        error: error.message,
      };
    }
  } else {
    // Mock Provider fallback
    const mockLog = {
      to: sanitizedTo,
      type,
      message: messageText,
      timestamp: new Date().toISOString(),
    };
    mockWhatsAppLogs.push(mockLog);
    console.log(`[MOCK WHATSAPP] Message sent successfully to ${sanitizedTo} (${type}):\n${messageText}\n-------------------------------------------`);
    return {
      success: true,
      type,
      to: sanitizedTo,
      messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }
}

/**
 * Idempotently dispatches Customer and Admin WhatsApp notifications for an order.
 * Ensures non-blocking execution: errors are logged, but never throw or reject.
 */
async function sendOrderNotifications(orderDetails, db, websiteSettings = null) {
  const orderId = orderDetails.orderId || orderDetails.razorpayOrderId;
  if (!orderId) {
    console.error('[WhatsApp Service] Missing orderId, skipping notifications.');
    return { customerResult: null, adminResult: null };
  }

  // 1. Resolve customer phone and admin phone
  const customerPhone = orderDetails.customerPhone || orderDetails.customer?.phone;
  let adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!adminPhone && websiteSettings?.whatsapp) {
    adminPhone = websiteSettings.whatsapp;
  }
  if (!adminPhone) {
    adminPhone = '+91 77038 70170'; // fallback production default
  }

  // 1b. Attempt to fetch active WhatsApp CMS config from Firestore
  let whatsappCmsConfig = null;
  if (db) {
    try {
      const waConfigDoc = await db.collection('settings').doc('whatsapp_cms_config').get();
      if (waConfigDoc.exists) {
        whatsappCmsConfig = waConfigDoc.data();
      }
    } catch (cfgErr) {
      console.warn('[WhatsApp Service] Could not fetch whatsapp_cms_config from Firestore:', cfgErr.message);
    }
  }

  let customerResult = null;
  let adminResult = null;

  // 2. Helper for atomic idempotency check/claim via Firestore or in-memory
  async function checkAndLockNotification(type) {
    const key = `${orderId}_${type}`;
    if (db) {
      try {
        const orderRef = db.collection('orders').doc(orderId);
        return await db.runTransaction(async (transaction) => {
          const doc = await transaction.get(orderRef);
          if (!doc.exists) {
            return { canSend: false, reason: 'Order doc not found' };
          }
          const data = doc.data();
          const sentMap = data.whatsappNotifications || {};
          if (sentMap[type]?.sent === true || sentMap[type]?.status === 'SENDING') {
            return { canSend: false, reason: 'Already sent or sending in-progress' };
          }
          // Lock state temporarily
          sentMap[type] = {
            sent: false,
            status: 'SENDING',
            updatedAt: new Date().toISOString(),
          };
          transaction.update(orderRef, { whatsappNotifications: sentMap });
          return { canSend: true };
        });
      } catch (err) {
        console.error(`[WhatsApp Service] Firestore transaction lock error for ${type}:`, err.message);
        // Fallback to memory check
        if (memorySentNotifications.has(key)) {
          return { canSend: false, reason: 'Already sent (memory)' };
        }
        memorySentNotifications.add(key);
        return { canSend: true };
      }
    } else {
      if (memorySentNotifications.has(key)) {
        return { canSend: false, reason: 'Already sent (memory)' };
      }
      memorySentNotifications.add(key);
      return { canSend: true };
    }
  }

  // Helper to mark final result in Firestore
  async function recordNotificationResult(type, result) {
    if (db && result) {
      try {
        const orderRef = db.collection('orders').doc(orderId);
        await db.runTransaction(async (transaction) => {
          const doc = await transaction.get(orderRef);
          if (doc.exists) {
            const sentMap = doc.data().whatsappNotifications || {};
            sentMap[type] = {
              sent: result.success,
              to: result.to,
              sentAt: new Date().toISOString(),
              messageId: result.messageId || null,
              error: result.error || null,
            };
            transaction.update(orderRef, { whatsappNotifications: sentMap });
          }
        });
      } catch (err) {
        console.error(`[WhatsApp Service] Failed to record result in Firestore for ${type}:`, err.message);
      }
    }
  }

  // --- CUSTOMER NOTIFICATION ---
  try {
    const custConfig = whatsappCmsConfig?.customerConfirmation;
    const isCustEnabled = custConfig?.enabled ?? true;

    if (!isCustEnabled) {
      console.log(`[WhatsApp Service] Customer notification disabled via Admin CMS for order ${orderId}.`);
      customerResult = { success: false, disabled: true, type: 'customer_order_confirmation' };
    } else {
      const customerLock = await checkAndLockNotification('customer_order_confirmation');
      if (customerLock.canSend) {
        if (customerPhone) {
          const customerMsg = formatCustomerOrderMessage(orderDetails, custConfig?.messageTemplate);
          customerResult = await sendWhatsAppMessage(customerPhone, customerMsg, 'customer_order_confirmation');
          await recordNotificationResult('customer_order_confirmation', customerResult);
        } else {
          console.warn(`[WhatsApp Service] Customer phone number missing for order ${orderId}. Skipping customer notification.`);
        }
      } else {
        console.log(`[WhatsApp Service] Skipping customer notification for order ${orderId}: ${customerLock.reason}`);
        customerResult = { success: true, alreadySent: true, type: 'customer_order_confirmation' };
      }
    }
  } catch (err) {
    console.error(`[WhatsApp Service] Error processing customer notification for order ${orderId}:`, err.message);
  }

  // --- ADMIN NOTIFICATION ---
  try {
    const adminConfig = whatsappCmsConfig?.adminNewOrderAlert;
    const isAdminEnabled = adminConfig?.enabled ?? true;

    if (!isAdminEnabled) {
      console.log(`[WhatsApp Service] Admin notification disabled via Admin CMS for order ${orderId}.`);
      adminResult = { success: false, disabled: true, type: 'admin_new_order' };
    } else {
      const adminLock = await checkAndLockNotification('admin_new_order');
      if (adminLock.canSend) {
        const adminMsg = formatAdminOrderMessage(orderDetails, adminConfig?.messageTemplate);
        adminResult = await sendWhatsAppMessage(adminPhone, adminMsg, 'admin_new_order');
        await recordNotificationResult('admin_new_order', adminResult);
      } else {
        console.log(`[WhatsApp Service] Skipping admin notification for order ${orderId}: ${adminLock.reason}`);
        adminResult = { success: true, alreadySent: true, type: 'admin_new_order' };
      }
    }
  } catch (err) {
    console.error(`[WhatsApp Service] Error processing admin notification for order ${orderId}:`, err.message);
  }

  return { customerResult, adminResult };
}

module.exports = {
  sanitizePhoneNumber,
  formatCustomerOrderMessage,
  formatAdminOrderMessage,
  sendWhatsAppMessage,
  sendOrderNotifications,
  mockWhatsAppLogs,
  memorySentNotifications,
};
