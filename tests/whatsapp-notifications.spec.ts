import { test, expect } from '@playwright/test';
import {
  sanitizePhoneNumber,
  formatCustomerOrderMessage,
  formatAdminOrderMessage,
  sendOrderNotifications,
  mockWhatsAppLogs,
  memorySentNotifications,
} from '../backend/whatsappService';

test.describe('WhatsApp Order Notification System Unit & Integration Tests', () => {

  test.beforeEach(() => {
    // Clear mock logs and memory cache before each test
    mockWhatsAppLogs.length = 0;
    memorySentNotifications.clear();
  });

  test('Sanitize phone numbers correctly', () => {
    expect(sanitizePhoneNumber('+91 77038 70170')).toBe('917703870170');
    expect(sanitizePhoneNumber('9876543210')).toBe('919876543210');
    expect(sanitizePhoneNumber('919876543210')).toBe('919876543210');
    expect(sanitizePhoneNumber('  +91 (888) 123-4567 ')).toBe('918881234567');
    expect(sanitizePhoneNumber('')).toBe('');
  });

  test('Format Customer Order Confirmation Message correctly', () => {
    const order = {
      orderId: 'order_test_101',
      customerName: 'Ananya Sharma',
      customerEmail: 'ananya@example.com',
      customerPhone: '9876543210',
      items: [
        { name: 'Belgian Chocolate Truffle Cake', price: 850, quantity: 1 },
        { name: 'Red Velvet Cupcakes', price: 150, quantity: 2 },
      ],
      totalAmount: 1150,
      deliveryDate: '2025-05-20',
      deliveryTimeSlot: '04:00 PM – 06:00 PM',
      shippingAddress: 'Flat 402, Rosewood Apartments, Sector 54, Gurugram - 122002',
      specialRequests: '',
    };

    const message = formatCustomerOrderMessage(order);

    expect(message).toContain('🎂 *THE CAKE LOUNGE*');
    expect(message).toContain('✨ *ORDER CONFIRMED*');
    expect(message).toContain('Hi *Ananya Sharma*,');
    expect(message).toContain('🧾 Order ID: `order_test_101`');
    expect(message).toContain('• Belgian Chocolate Truffle Cake — ₹850');
    expect(message).toContain('• Red Velvet Cupcakes (x2) — ₹300');
    expect(message).toContain('💰 *Total Paid: ₹1150*');
    expect(message).toContain('📅 *Delivery Date:* 2025-05-20');
    expect(message).toContain('🕓 *Delivery Time:* 04:00 PM – 06:00 PM');
    expect(message).toContain('📍 *Delivery Address:*\nFlat 402, Rosewood Apartments, Sector 54, Gurugram - 122002');
    expect(message).toContain('📝 *Special Requests:* None');
    expect(message).toContain('💳 Payment: *Successful*');
    expect(message).toContain('— *The Cake Lounge* 🎂');
  });

  test('Format Admin New Order Alert Message correctly', () => {
    const order = {
      orderId: 'order_test_101',
      customerName: 'Ananya Sharma',
      customerEmail: 'ananya@example.com',
      customerPhone: '9876543210',
      items: [
        { name: 'Belgian Chocolate Truffle Cake', price: 850, quantity: 1 },
      ],
      totalAmount: 900,
      deliveryDate: '2025-05-20',
      deliveryTimeSlot: '02:00 PM – 04:00 PM',
      shippingAddress: 'Sector 14, Gurugram',
      specialRequests: 'Please write "Happy Birthday Rohan"',
    };

    const message = formatAdminOrderMessage(order);

    expect(message).toContain('🚨 *THE CAKE LOUNGE — NEW ORDER*');
    expect(message).toContain('A new order has been successfully placed.');
    expect(message).toContain('🧾 Order ID: `order_test_101`');
    expect(message).toContain('👤 *Customer:* Ananya Sharma');
    expect(message).toContain('📧 *Email:* ananya@example.com');
    expect(message).toContain('📱 *Phone:* 9876543210');
    expect(message).toContain('• Belgian Chocolate Truffle Cake — ₹850');
    expect(message).toContain('💰 *Order Total:* ₹900');
    expect(message).toContain('📝 *Special Requests:* Please write "Happy Birthday Rohan"');
    expect(message).toContain('📦 *Order Status:* New Order');
    expect(message).not.toContain('Thank you for ordering');
  });

  test('Send notifications automatically and idempotently without duplicate messages', async () => {
    const order = {
      orderId: 'order_idempotent_999',
      customerName: 'Rahul Verma',
      customerPhone: '9999988888',
      items: [{ name: 'Black Forest Cake', price: 600, quantity: 1 }],
      totalAmount: 650,
      deliveryDate: '2025-06-01',
      deliveryTimeSlot: '12:00 PM – 02:00 PM',
      shippingAddress: 'DLF Phase 3, Gurugram',
    };

    // First trigger
    const result1 = await sendOrderNotifications(order, null, null);
    expect(result1.customerResult?.success).toBe(true);
    expect(result1.adminResult?.success).toBe(true);

    // Verify mock log has 2 entries (1 customer, 1 admin)
    expect(mockWhatsAppLogs.length).toBe(2);

    // Second trigger for the same order (simulating page refresh / callback retry)
    const result2 = await sendOrderNotifications(order, null, null);
    expect((result2.customerResult as any)?.alreadySent).toBe(true);
    expect((result2.adminResult as any)?.alreadySent).toBe(true);

    // Verify mock log count has NOT increased
    expect(mockWhatsAppLogs.length).toBe(2);
  });

  test('Non-blocking execution when phone number is missing or invalid', async () => {
    const invalidOrder = {
      orderId: 'order_invalid_phone',
      customerName: 'Guest',
      customerPhone: '', // Empty customer phone
      items: [{ name: 'Pineapple Cake', price: 500, quantity: 1 }],
      totalAmount: 550,
      deliveryDate: '2025-06-05',
    };

    // Notification attempt should complete gracefully without throwing errors
    await expect(sendOrderNotifications(invalidOrder, null, null)).resolves.not.toThrow();
  });

  test('Support custom templates and variable substitution', () => {
    const order = {
      orderId: 'order_custom_123',
      customerName: 'Siddharth Rao',
      customerEmail: 'sid@example.com',
      customerPhone: '9811122233',
      items: [{ name: 'Mango Mousse Cake', price: 750, quantity: 1 }],
      totalAmount: 800,
      deliveryDate: '2025-07-10',
      deliveryTimeSlot: '10:00 AM – 12:00 PM',
      shippingAddress: 'Sector 56, Gurugram',
      specialRequests: 'Eggless please',
    };

    const customTemplate = 'Hello {customerName}! Order {orderId} confirmed. Total: ₹{totalAmount}. Items:\n{items}';
    const message = formatCustomerOrderMessage(order, customTemplate);

    expect(message).toBe('Hello Siddharth Rao! Order order_custom_123 confirmed. Total: ₹800. Items:\n• Mango Mousse Cake — ₹750');
  });

});
