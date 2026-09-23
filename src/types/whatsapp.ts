export type WhatsAppNotificationType = 'customer_order_confirmation' | 'admin_new_order';

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
