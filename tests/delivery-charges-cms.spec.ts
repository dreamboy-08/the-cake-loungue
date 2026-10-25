import { test, expect } from '@playwright/test';
import { loginAsCustomer } from './test-auth-helper';
import { DEFAULT_GENERAL_SETTINGS, DEFAULT_DELIVERY_MATRIX } from '../src/constants/cmsDefaults';

test.describe('Smart Delivery Pricing Matrix & Fee Settings Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('1. Matrix Pricing: Under 2 km distance defaults to FREE delivery across subtotals', async ({ page }) => {
    await page.evaluate(() => {
      sessionStorage.setItem('cakeLounge_buyNowItem', JSON.stringify({
        id: 'test_item_1', name: 'Mini Sample Pastry', price: 100, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
      }));
      const mockUser = JSON.parse(localStorage.getItem('cakelounge_mock_user') || '{}');
      if (!mockUser.addresses) mockUser.addresses = [];
      mockUser.addresses = [{
        id: 'addr_1', name: 'Tester', phone: '9876543210', houseNumber: '123', street: 'DLF Phase 3', area: 'DLF Phase 3', city: 'Gurugram', state: 'Haryana', zipCode: '122002', isDefault: true
      }];
      localStorage.setItem('cakelounge_mock_user', JSON.stringify(mockUser));
      localStorage.removeItem('cakeLounge_cms_generalSettings');
    });

    await page.goto('http://localhost:3000/checkout');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Delivery Fee')).toBeVisible();
    await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=🎉 Congratulations! You unlocked FREE Delivery.')).toBeVisible();
  });

  test('2. Matrix Pricing: 2–5 km distance with subtotal < ₹500 calculates ₹99 fee', async ({ page }) => {
    await page.evaluate(({ defaultSettings, defaultMatrix }) => {
      sessionStorage.setItem('cakeLounge_buyNowItem', JSON.stringify({
        id: 'test_item_1', name: 'Mini Sample Pastry', price: 300, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
      }));
      const mockUser = JSON.parse(localStorage.getItem('cakelounge_mock_user') || '{}');
      if (!mockUser.addresses) mockUser.addresses = [];
      mockUser.addresses = [{
        id: 'addr_1', name: 'Tester', phone: '9876543210', houseNumber: '123', street: 'Main St', area: 'Sector 17', city: 'Gurugram', state: 'Haryana', zipCode: '122015', isDefault: true
      }];
      localStorage.setItem('cakelounge_mock_user', JSON.stringify(mockUser));

      const general = {
        ...defaultSettings,
        deliveryMatrix: defaultMatrix,
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
    }, { defaultSettings: DEFAULT_GENERAL_SETTINGS, defaultMatrix: DEFAULT_DELIVERY_MATRIX });

    await page.goto('http://localhost:3000/checkout');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Zone: 2–5 km')).toBeVisible();
    await expect(page.locator('text=₹99').first()).toBeVisible();
  });

  test('3. Matrix Pricing: Unavailable pricing cell mode disables checkout button with warning message', async ({ page }) => {
    await page.evaluate(({ defaultSettings }) => {
      sessionStorage.setItem('cakeLounge_buyNowItem', JSON.stringify({
        id: 'test_item_1', name: 'Small Cupcake', price: 200, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
      }));
      const mockUser = JSON.parse(localStorage.getItem('cakelounge_mock_user') || '{}');
      if (!mockUser.addresses) mockUser.addresses = [];
      mockUser.addresses = [{
        id: 'addr_1', name: 'Tester', phone: '9876543210', houseNumber: '123', street: 'Outer Road', area: 'Farrukhnagar', city: 'Gurugram', state: 'Haryana', zipCode: '122101', isDefault: true
      }];
      localStorage.setItem('cakelounge_mock_user', JSON.stringify(mockUser));

      const matrixConfig = {
        enabled: true,
        distanceBrackets: [
          { id: 'd_under2', label: 'Under 2 km', minKm: 0, maxKm: 2 },
          { id: 'd_15plus', label: '15 km and above', minKm: 15, maxKm: null },
        ],
        subtotalBrackets: [
          { id: 's_under500', label: 'Under ₹500', minSubtotal: 0, maxSubtotal: 500 },
          { id: 's_1999plus', label: '₹1,999+', minSubtotal: 1999, maxSubtotal: null },
        ],
        cells: {
          'd_under2_s_under500': { distanceBracketId: 'd_under2', subtotalBracketId: 's_under500', mode: 'free', amount: 0 },
          'd_15plus_s_under500': { distanceBracketId: 'd_15plus', subtotalBracketId: 's_under500', mode: 'unavailable', amount: 0 },
          'd_15plus_s_1999plus': { distanceBracketId: 'd_15plus', subtotalBracketId: 's_1999plus', mode: 'unavailable', amount: 0 },
        }
      };

      const general = {
        ...defaultSettings,
        deliveryMatrix: matrixConfig,
        serviceableZipCodes: ['122101'],
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
    }, { defaultSettings: DEFAULT_GENERAL_SETTINGS });

    await page.goto('http://localhost:3000/checkout');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=N/A').first()).toBeVisible();
    await expect(page.locator('text=Delivery is currently unavailable')).toBeVisible();
  });

  test('4. Legacy Fallback: When delivery matrix is disabled, standard flat fee and threshold apply', async ({ page }) => {
    await page.evaluate(({ defaultSettings }) => {
      sessionStorage.setItem('cakeLounge_buyNowItem', JSON.stringify({
        id: 'test_item_1', name: 'Sample Pastry', price: 200, quantity: 1, weight: '0.5 Kg', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
      }));
      const mockUser = JSON.parse(localStorage.getItem('cakelounge_mock_user') || '{}');
      if (!mockUser.addresses) mockUser.addresses = [];
      mockUser.addresses = [{
        id: 'addr_1', name: 'Tester', phone: '9876543210', houseNumber: '123', street: 'Main St', area: 'Sector 14', city: 'Gurugram', state: 'Haryana', zipCode: '122001', isDefault: true
      }];
      localStorage.setItem('cakelounge_mock_user', JSON.stringify(mockUser));

      const general = {
        ...defaultSettings,
        deliveryCharges: 75,
        deliveryChargesEnabled: true,
        freeDeliveryThreshold: 2000,
        freeDeliveryThresholdEnabled: true,
        deliveryMatrix: { enabled: false, distanceBrackets: [], subtotalBrackets: [], cells: {} },
        serviceableZipCodes: ['122001'],
      };
      localStorage.setItem('cakeLounge_cms_generalSettings', JSON.stringify(general));
    }, { defaultSettings: DEFAULT_GENERAL_SETTINGS });

    await page.goto('http://localhost:3000/checkout');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=₹75').first()).toBeVisible();
  });
});

test.describe('Server-side CMS Delivery Calculation & Tamper Protection', () => {
  const futureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  test('Server calculates exact expected amounts matching CMS configurations', async () => {
    const { calculateExpectedAmount } = require('../backend/server');

    // Matrix DEFAULT_DELIVERY_MATRIX tests:
    // Distance < 2km (e.g. 1.5km) -> All Subtotals FREE
    expect(calculateExpectedAmount([{ price: 300, quantity: 1 }], '10:00 AM – 12:00 PM', null, 1.5)).toBe(300);
    expect(calculateExpectedAmount([{ price: 700, quantity: 1 }], '10:00 AM – 12:00 PM', null, 1.5)).toBe(700);

    // Distance 2-5km:
    // Under 500 (e.g. 300) -> Fee 99 -> Total 399
    expect(calculateExpectedAmount([{ price: 300, quantity: 1 }], '10:00 AM – 12:00 PM', null, 3.5)).toBe(399);
    // 500-999 (e.g. 600) -> Fee 69 -> Total 669
    expect(calculateExpectedAmount([{ price: 600, quantity: 1 }], '10:00 AM – 12:00 PM', null, 3.5)).toBe(669);
    // 999-1999 (e.g. 1200) -> Fee 49 -> Total 1249
    expect(calculateExpectedAmount([{ price: 1200, quantity: 1 }], '10:00 AM – 12:00 PM', null, 3.5)).toBe(1249);
    // 1999+ (e.g. 2000) -> Fee FREE -> Total 2000
    expect(calculateExpectedAmount([{ price: 2000, quantity: 1 }], '10:00 AM – 12:00 PM', null, 3.5)).toBe(2000);

    // Distance 5-10km:
    // Under 500 (e.g. 300) -> Fee 149 -> Total 449
    expect(calculateExpectedAmount([{ price: 300, quantity: 1 }], '10:00 AM – 12:00 PM', null, 7.5)).toBe(449);
    // 500-999 (e.g. 600) -> Fee 99 -> Total 699
    expect(calculateExpectedAmount([{ price: 600, quantity: 1 }], '10:00 AM – 12:00 PM', null, 7.5)).toBe(699);

    // Distance 10-15km:
    // Under 500 (e.g. 300) -> Fee 199 -> Total 499
    expect(calculateExpectedAmount([{ price: 300, quantity: 1 }], '10:00 AM – 12:00 PM', null, 12.5)).toBe(499);
    // 500-999 (e.g. 600) -> Fee 149 -> Total 749
    expect(calculateExpectedAmount([{ price: 600, quantity: 1 }], '10:00 AM – 12:00 PM', null, 12.5)).toBe(749);

    // Distance 15km+:
    // Under 500 (e.g. 300) -> Fee 249 -> Total 549
    expect(calculateExpectedAmount([{ price: 300, quantity: 1 }], '10:00 AM – 12:00 PM', null, 18.0)).toBe(549);

    // Legacy fallback (when matrix disabled)
    const legacyConfig = { deliveryCharges: 50, deliveryChargesEnabled: true, freeDeliveryThreshold: 499, freeDeliveryThresholdEnabled: true, deliveryMatrix: { enabled: false } };
    expect(calculateExpectedAmount([{ price: 1, quantity: 1 }], '10:00 AM – 12:00 PM', legacyConfig)).toBe(51);
  });

  test('Order creation endpoint succeeds when total matches CMS calculation and rejects tampered total', async ({ request }) => {
    // 1. Valid request matching matrix fee (2-5km, subtotal 300 -> fee 99 -> total 399)
    const validRes = await request.post('http://localhost:5000/api/orders', {
      data: {
        totalAmount: 399,
        items: [{ id: 'item_1', name: 'Standard Cake', price: 300, quantity: 1 }],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
        deliveryDate: futureDate(),
        deliveryTimeSlot: '10:00 AM – 12:00 PM',
        deliveryDistanceKm: 3.5,
        addressZip: '122015'
      }
    });

    expect(validRes.status()).toBe(200);
    const validBody = await validRes.json();
    expect(validBody.order).toBeDefined();

    // 2. Tampered request where expected total is 399, but client sends 300 (trying to bypass delivery charge)
    const tamperedRes = await request.post('http://localhost:5000/api/orders', {
      data: {
        totalAmount: 300,
        items: [{ id: 'item_1', name: 'Standard Cake', price: 300, quantity: 1 }],
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
        deliveryDate: futureDate(),
        deliveryTimeSlot: '10:00 AM – 12:00 PM',
        deliveryDistanceKm: 3.5,
        addressZip: '122015'
      }
    });

    expect(tamperedRes.status()).toBe(400);
    const tamperedBody = await tamperedRes.json();
    expect(tamperedBody.error).toContain('Mismatched order total amount. Expected ₹399, got ₹300.');
  });
});
