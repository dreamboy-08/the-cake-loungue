import {
  WhatsAppOrderDetails,
  WhatsAppNotificationType,
  WhatsAppSendResult,
} from '@/types/whatsapp';

// Global in-memory log for mock provider inspection during testing/debugging
export const mockWhatsAppLogs: Array<{
  to: string;
  type: WhatsAppNotificationType;
  message: string;
  timestamp: string;
}> = [];

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
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

export function resolveOrderVariables(order: WhatsAppOrderDetails): Record<string, string | number> {
  const customerName = order.customerName || 'Valued Customer';
  const customerEmail = order.customerEmail || 'N/A';
  const customerPhone = order.customerPhone || 'N/A';
  const orderId = order.orderId || 'N/A';
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
    rawInstructions && rawInstructions.trim() && rawInstructions.trim() !== 'None'
      ? rawInstructions.trim()
      : 'None';

  const itemsList = (order.items || [])
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
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

export function renderTemplateMessage(templateStr: string, variablesMap: Record<string, string | number>): string {
  let result = templateStr || '';
  Object.keys(variablesMap).forEach((key) => {
    result = result.split(key).join(String(variablesMap[key]));
  });
  return result;
}

export function formatCustomerOrderMessage(order: WhatsAppOrderDetails, customTemplate?: string | null): string {
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

export function formatAdminOrderMessage(order: WhatsAppOrderDetails, customTemplate?: string | null): string {
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

export async function sendWhatsAppMessage(
  recipientPhone: string,
  messageText: string,
  type: WhatsAppNotificationType
): Promise<WhatsAppSendResult> {
  const sanitizedTo = sanitizePhoneNumber(recipientPhone);

  if (!sanitizedTo) {
    console.error('[WhatsApp Service] Error: Recipient phone number is invalid or empty.');
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
        console.log(`[WhatsApp Service - Meta] Sent ${type} to ${sanitizedTo}. Message ID: ${data.messages[0].id}`);
        return {
          success: true,
          type,
          to: sanitizedTo,
          messageId: data.messages[0].id,
        };
      } else {
        const errMsg = data.error?.message || JSON.stringify(data);
        console.error(`[WhatsApp Service - Meta] Failed to send ${type} to ${sanitizedTo}:`, errMsg);
        return {
          success: false,
          type,
          to: sanitizedTo,
          error: errMsg,
        };
      }
    } catch (error: any) {
      console.error(`[WhatsApp Service - Meta] Network/API Exception for ${type}:`, error.message || error);
      return {
        success: false,
        type,
        to: sanitizedTo,
        error: error.message || 'Meta API call failed',
      };
    }
  } else {
    // Mock provider fallback
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
