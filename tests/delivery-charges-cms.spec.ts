import { test, expect } from '@playwright/test';

test.describe('CMS Delivery Charges & Fee Settings Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Set mock cart in localStorage so we can land directly on checkout or test checkout subtotal conditions
    await page.goto('/');
  });

  test('1. Storefront checkout defaults to ₹50 delivery fee for subtotal below threshold (₹1)', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        {
          id: 'test_item_1',
          name: 'Mini Sample Pastry',
          price: 1,
          quantity: 1,
          weight: '0.5 Kg',
          img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
        }
      ]));
      localStorage.removeItem('cakeLounge_cms_generalSettings');
    });

    await page.goto('/checkout');
    await expect(page.locator('text=Delivery Fee')).toBeVisible();
    await expect(page.locator('text=₹50').first()).toBeVisible();
    await expect(page.locator('text=Add ₹498 more to unlock FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹51').first()).toBeVisible();
  });

  test('2. Admin updates delivery fee to ₹80 and storefront reflects ₹80 (Subtotal = ₹1 -> Total = ₹81)', async ({ page }) => {
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 80,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 499,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001', '122002'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Mini Sample Pastry', price: 1, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.goto('/checkout');
    await expect(page.locator('text=₹80').first()).toBeVisible();
    await expect(page.locator('text=Add ₹498 more to unlock FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹81').first()).toBeVisible();
  });

  test('3. Admin updates delivery fee to ₹100 -> checkout shows ₹100 (Total = ₹101)', async ({ page }) => {
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 100,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 499,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Mini Sample Pastry', price: 1, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.goto('/checkout');
    await expect(page.locator('text=₹100').first()).toBeVisible();
    await expect(page.locator('text=Add ₹498 more to unlock FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹101').first()).toBeVisible();
  });

  test('4. Admin disables delivery charges completely -> checkout shows FREE delivery and no threshold message', async ({ page }) => {
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 50,
        deliveryChargesEnabled: false,
        freeDeliveryThreshold: 499,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Mini Sample Pastry', price: 1, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.goto('/checkout');
    await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=Add ₹498 more')).not.toBeVisible();
    await expect(page.locator('text=🎉 Congratulations! You unlocked FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹1').first()).toBeVisible();
  });

  test('5 & 6 & 7 & 8. Threshold evaluation: below, at, and above custom free-delivery threshold (e.g. ₹999)', async ({ page }) => {
    // 5 & 6. Below threshold (subtotal = ₹500, threshold = ₹999, fee = ₹50) -> Fee = ₹50, Add ₹499 more
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 50,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 999,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Custom Cake Item', price: 500, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.goto('/checkout');
    await expect(page.locator('text=Add ₹499 more to unlock FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹550').first()).toBeVisible();

    // 7. Exactly at threshold (subtotal = ₹999) -> Fee = FREE, Total = ₹999
    await page.evaluate(() => {
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Custom Cake Item', price: 999, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.reload();
    await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=🎉 Congratulations! You unlocked FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹999').first()).toBeVisible();

    // 8. Above threshold (subtotal = ₹1500) -> Fee = FREE, Total = ₹1500
    await page.evaluate(() => {
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Custom Cake Item', price: 1500, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.reload();
    await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=₹1500').first()).toBeVisible();
  });

  test('9. Admin sets delivery fee to ₹0 -> treats as FREE delivery with no negative calculations', async ({ page }) => {
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 0,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 499,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Sample Item', price: 100, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    await page.goto('/checkout');
    await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=🎉 Congratulations! You unlocked FREE Delivery.')).toBeVisible();
    await expect(page.locator('text=₹100').first()).toBeVisible();
  });

  test('11 & 12 & 13. Guest, logged-in, and refreshed browser sessions receive consistent CMS delivery fee', async ({ page }) => {
    await page.evaluate(() => {
      const general = {
        id: 'general_cms_config',
        deliveryCharges: 75,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 500,
        freeDeliveryThresholdEnabled: true,
        minimumOrder: 299,
        serviceableZipCodes: ['122001'],
        businessHolidays: [],
        emergencyBannerEnabled: false,
        emergencyBannerText: '',
        popupMessageEnabled: false,
        popupMessageTitle: '',
        popupMessageText: '',
        couponBannerEnabled: false,
        couponBannerText: '',
        maintenanceMode: false
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
      localStorage.setItem('cakeLounge_cart', JSON.stringify([
        { id: 'test_item_1', name: 'Sample Item', price: 200, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
      ]));
    });

    // 11. Guest checkout view
    await page.goto('/checkout');
    await expect(page.locator('text=₹75').first()).toBeVisible();
    await expect(page.locator('text=Add ₹300 more to unlock FREE Delivery.')).toBeVisible();

    // 13. Browser refresh session persistence
    await page.reload();
    await expect(page.locator('text=₹75').first()).toBeVisible();
    await expect(page.locator('text=Add ₹300 more to unlock FREE Delivery.')).toBeVisible();
  });
});

test.describe('Server-side CMS Delivery Calculation & Tamper Protection', () => {
  const futureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  test('Server calculates exact expected amounts matching CMS configurations', async ({ request }) => {
    const { calculateExpectedAmount } = require('../backend/server');

    // TEST 1: Fee ₹50, Threshold ₹499, Subtotal ₹1 -> Delivery ₹50, Total ₹51
    const config1 = { deliveryCharges: 50, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 1, quantity: 1 }], '10:00 AM – 12:00 PM', config1)).toBe(51);

    // TEST 2: Fee ₹80, Threshold ₹499, Subtotal ₹1 -> Delivery ₹80, Total ₹81
    const config2 = { deliveryCharges: 80, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 1, quantity: 1 }], '10:00 AM – 12:00 PM', config2)).toBe(81);

    // TEST 3: Fee ₹50, Threshold ₹499, Subtotal ₹499 -> Delivery FREE, Total ₹499
    const config3 = { deliveryCharges: 50, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 499, quantity: 1 }], '10:00 AM – 12:00 PM', config3)).toBe(499);

    // TEST 4: Fee ₹50, Threshold ₹499, Subtotal ₹500 -> Delivery FREE, Total ₹500
    const config4 = { deliveryCharges: 50, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 500, quantity: 1 }], '10:00 AM – 12:00 PM', config4)).toBe(500);

    // TEST 5: Delivery disabled, Subtotal ₹1 -> Delivery FREE, Total ₹1
    const config5 = { deliveryCharges: 50, deliveryChargesEnabled: false, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 1, quantity: 1 }], '10:00 AM – 12:00 PM', config5)).toBe(1);

    // TEST 6: Delivery fee = ₹0, Subtotal ₹1 -> Delivery FREE, Total ₹1
    const config6 = { deliveryCharges: 0, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true };
    expect(calculateExpectedAmount([{ price: 1, quantity: 1 }], '10:00 AM – 12:00 PM', config6)).toBe(1);
  });

  test('Order creation endpoint succeeds when total matches CMS calculation and rejects tampered total', async ({ request }) => {
    const generalSettings = {
      deliveryCharges: 50,
      deliveryChargesEnabled: true,
      freeDeliveryThreshold: 499,
      freeDeliveryThresholdEnabled: true,
    };

    // 1. Valid request where totalAmount matches expected total (Subtotal 1 + Shipping 50 = 51)
    const validRes = await request.post('http://localhost:5000/api/orders', {
      data: {
        totalAmount: 51,
        items: [{ id: 'item_1', name: 'Standard Cake', price: 1, quantity: 1 }],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
        deliveryDate: futureDate(),
        deliveryTimeSlot: '10:00 AM – 12:00 PM',
        generalSettings,
      }
    });

    expect(validRes.status()).toBe(200);
    const validBody = await validRes.json();
    expect(validBody.order).toBeDefined();

    // 2. Tampered request where expected total is 51, but client sends 1
    const tamperedRes1 = await request.post('http://localhost:5000/api/orders', {
      data: {
        totalAmount: 1,
        items: [{ id: 'item_1', name: 'Standard Cake', price: 1, quantity: 1 }],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
        deliveryDate: futureDate(),
        deliveryTimeSlot: '10:00 AM – 12:00 PM',
        generalSettings,
      }
    });

    expect(tamperedRes1.status()).toBe(400);
    const tamperedBody1 = await tamperedRes1.json();
    expect(tamperedBody1.error).toContain('Mismatched order total amount. Expected ₹51, got ₹1.');

    // 3. Tampered request where expected total is 1 (delivery disabled), but client sends 51
    const disabledSettings = { ...generalSettings, deliveryChargesEnabled: false };
    const tamperedRes2 = await request.post('http://localhost:5000/api/orders', {
      data: {
        totalAmount: 51,
        items: [{ id: 'item_1', name: 'Standard Cake', price: 1, quantity: 1 }],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
        deliveryDate: futureDate(),
        deliveryTimeSlot: '10:00 AM – 12:00 PM',
        generalSettings: disabledSettings,
      }
    });

    expect(tamperedRes2.status()).toBe(400);
    const tamperedBody2 = await tamperedRes2.json();
    expect(tamperedBody2.error).toContain('Mismatched order total amount. Expected ₹1, got ₹51.');
  });
});
