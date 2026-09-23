import { test, expect } from '@playwright/test';
import {
  sendWhatsAppMessage,
  sendOrderNotifications,
  formatCustomerOrderMessage,
  formatAdminOrderMessage,
  mockWhatsAppLogs,
  memorySentNotifications,
} from '../backend/whatsappService';

test.describe('WhatsApp Production Readiness & E2E Delivery Verification', () => {

  test.beforeEach(() => {
    mockWhatsAppLogs.length = 0;
    memorySentNotifications.clear();
  });

  test('Check Environment Variables & Meta Configuration', async () => {
    const provider = process.env.WHATSAPP_PROVIDER || 'mock';
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;

    console.log('=== ENVIRONMENT CONFIGURATION CHECK ===');
    console.log(`WHATSAPP_PROVIDER: ${provider}`);
    console.log(`WHATSAPP_TOKEN: ${token ? 'CONFIGURED (******)' : 'NOT SET'}`);
    console.log(`WHATSAPP_PHONE_NUMBER_ID: ${phoneId ? phoneId : 'NOT SET'}`);
    console.log(`ADMIN_WHATSAPP_NUMBER: ${adminPhone ? adminPhone : 'NOT SET (Will use fallback: +91 77038 70170)'}`);
    console.log('=======================================');
  });

  test('Verify Meta Cloud API Endpoint & Payload Generation when WHATSAPP_PROVIDER=meta', async () => {
    // Temporarily set env vars to test Meta Cloud API handler
    process.env.WHATSAPP_PROVIDER = 'meta';
    process.env.WHATSAPP_TOKEN = 'test_meta_access_token_123';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '100200300400';
    process.env.ADMIN_WHATSAPP_NUMBER = '+91 99999 11111';

    // Mock global fetch to inspect request headers, endpoint, and payload
    let capturedUrl = '';
    let capturedOptions: any = null;

    const originalFetch = global.fetch;
    global.fetch = (async (url: string, options: any) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        json: async () => ({
          messaging_product: 'whatsapp',
          contacts: [{ input: '919876543210', wa_id: '919876543210' }],
          messages: [{ id: 'wamid.HBgLOTE5ODc2NTQzMjEwFQIAERgSQTU1' }],
        }),
      } as any;
    }) as typeof fetch;

    try {
      const order = {
        orderId: 'order_meta_test_001',
        customerName: 'Priya Sharma',
        customerEmail: 'priya@example.com',
        customerPhone: '9876543210',
        items: [
          { name: 'Pineapple Delight Cake', price: 650, quantity: 2 },
        ],
        totalAmount: 1300,
        deliveryDate: '2025-05-25',
        deliveryTimeSlot: '04:00 PM – 06:00 PM',
        shippingAddress: 'Plot 12, Golf Course Road, Sector 42, Gurugram',
        specialRequests: 'Eggless please',
      };

      const result = await sendOrderNotifications(order, null, null);

      expect(capturedUrl).toBe('https://graph.facebook.com/v18.0/100200300400/messages');
      expect(capturedOptions.headers.Authorization).toBe('Bearer test_meta_access_token_123');
      expect(capturedOptions.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(capturedOptions.body);
      expect(body.messaging_product).toBe('whatsapp');
      expect(body.recipient_type).toBe('individual');
      expect(body.type).toBe('text');
      expect(body.text.body).toContain('🚨 *THE CAKE LOUNGE — NEW ORDER*');

      console.log('=== META API VERIFICATION SUCCESSFUL ===');
      console.log('Captured URL:', capturedUrl);
      console.log('Meta Auth Header:', capturedOptions.headers.Authorization);
      console.log('Recipient in body:', body.to);
    } finally {
      global.fetch = originalFetch;
      delete process.env.WHATSAPP_PROVIDER;
      delete process.env.WHATSAPP_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      delete process.env.ADMIN_WHATSAPP_NUMBER;
    }
  });

  test('Verify Idempotency & Duplicate Protection', async () => {
    const order = {
      orderId: 'order_e2e_dup_test',
      customerName: 'Anil Kumar',
      customerPhone: '9876543210',
      items: [{ name: 'Chocolate Fudge', price: 700, quantity: 1 }],
      totalAmount: 750,
      deliveryDate: '2025-06-10',
    };

    // First attempt -> Sent
    const res1 = await sendOrderNotifications(order, null, null);
    expect(res1.customerResult?.success).toBe(true);
    expect(res1.adminResult?.success).toBe(true);

    // Second attempt -> Skipped
    const res2 = await sendOrderNotifications(order, null, null);
    expect((res2.customerResult as any)?.alreadySent).toBe(true);
    expect((res2.adminResult as any)?.alreadySent).toBe(true);

    // Third attempt -> Skipped
    const res3 = await sendOrderNotifications(order, null, null);
    expect((res3.customerResult as any)?.alreadySent).toBe(true);
    expect((res3.adminResult as any)?.alreadySent).toBe(true);

    console.log('=== IDEMPOTENCY PROTECTION VERIFIED ===');
    console.log('Mock log count:', mockWhatsAppLogs.length, '(Expected: 2)');
    expect(mockWhatsAppLogs.length).toBe(2);
  });

  test('Verify Simulated Failure Isolation', async () => {
    process.env.WHATSAPP_PROVIDER = 'meta';
    process.env.WHATSAPP_TOKEN = 'invalid_token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = 'invalid_id';

    const originalFetch = global.fetch;
    global.fetch = (async () => {
      return {
        ok: false,
        status: 401,
        json: async () => ({
          error: {
            message: 'Invalid OAuth access token',
            type: 'OAuthException',
            code: 190,
          },
        }),
      } as any;
    }) as typeof fetch;

    try {
      const order = {
        orderId: 'order_fail_sim_001',
        customerName: 'Test Failure User',
        customerPhone: '9876543210',
        items: [{ name: 'Vanilla Cake', price: 500, quantity: 1 }],
        totalAmount: 550,
        deliveryDate: '2025-06-15',
      };

      // Notification call should fail gracefully without throwing an unhandled exception
      const result = await sendOrderNotifications(order, null, null);

      expect(result.customerResult?.success).toBe(false);
      expect(result.customerResult?.error).toContain('Invalid OAuth access token');

      console.log('=== SIMULATED FAILURE HANDLING VERIFIED ===');
      console.log('Failure logged gracefully, return status is false without crashing application');
    } finally {
      global.fetch = originalFetch;
      delete process.env.WHATSAPP_PROVIDER;
      delete process.env.WHATSAPP_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    }
  });

});
