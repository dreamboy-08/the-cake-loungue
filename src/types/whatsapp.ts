export type WhatsAppNotificationType = 'customer_order_confirmation' | 'admin_new_order' | 'quick_broadcast';

export interface WhatsAppOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface WhatsAppOrderDetails {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: WhatsAppOrderItem[];
  totalAmount: number;
  deliveryDate: string;
  deliveryTimeSlot?: string;
  deliveryTime?: string;
  shippingAddress?: string;
  address?: {
    houseNumber?: string;
    street?: string;
    landmark?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    zipCode?: string;
  };
  specialRequests?: string;
  deliveryInstructions?: string;
}

export interface WhatsAppMessagePayload {
  to: string;
  type: WhatsAppNotificationType;
  message: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  type: WhatsAppNotificationType;
  to: string;
  messageId?: string;
  error?: string;
  alreadySent?: boolean;
}

export interface WhatsAppBroadcastRecipient {
  phone: string;
  maskedPhone: string;
  status: 'sent' | 'failed';
  error?: string;
  messageId?: string;
}

export interface WhatsAppBroadcastRecord {
  id: string;
  message: string;
  createdAt: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  status: 'in_progress' | 'completed' | 'failed';
  useMetaTemplate?: boolean;
  templateName?: string;
  languageCode?: string;
  recipients?: WhatsAppBroadcastRecipient[];
}
