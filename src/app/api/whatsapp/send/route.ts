import { NextRequest, NextResponse } from 'next/server';
import {
  sendWhatsAppMessage,
  formatCustomerOrderMessage,
  formatAdminOrderMessage,
} from '@/services/whatsappService';
import { WhatsAppOrderDetails, WhatsAppNotificationType } from '@/types/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orderDetails, recipientPhone, messageText, type } = body;

    const secret = req.headers.get('x-whatsapp-secret');
    const expectedSecret = process.env.WHATSAPP_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized secret' }, { status: 401 });
    }

    if (action === 'send_order_notifications' && orderDetails) {
      const order = orderDetails as WhatsAppOrderDetails;
      const customerPhone = order.customerPhone || order.customerName;
      let adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '+91 77038 70170';

      let customerResult = null;
      let adminResult = null;

      if (customerPhone) {
        const custMsg = formatCustomerOrderMessage(order);
        customerResult = await sendWhatsAppMessage(customerPhone, custMsg, 'customer_order_confirmation');
      }

      const adminMsg = formatAdminOrderMessage(order);
      adminResult = await sendWhatsAppMessage(adminPhone, adminMsg, 'admin_new_order');

      return NextResponse.json({
        success: true,
        customerResult,
        adminResult,
      });
    }

    if (recipientPhone && messageText && type) {
      const result = await sendWhatsAppMessage(
        recipientPhone,
        messageText,
        type as WhatsAppNotificationType
      );
      return NextResponse.json({ success: result.success, result });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payload or missing action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API WhatsApp Send] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
