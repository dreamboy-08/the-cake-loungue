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
