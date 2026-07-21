import { test, expect } from '@playwright/test';

test.describe('Checkout Same-Day Delivery Notice & WhatsApp Integration', () => {
  test('should display Same-Day Delivery notice and WhatsApp button with prefilled message', async ({ page }) => {
    // 1. Visit the checkout page
    await page.goto('http://localhost:3000/checkout?bypass=true');

    // 2. Look for the Same-Day Delivery notice with a longer timeout to allow CMS fallback to resolve after firestore timeout (5s)
    const noticeHeader = page.locator('text=Need Same-Day Delivery?');
    await expect(noticeHeader).toBeVisible({ timeout: 15000 });

    const noticeSubtext = page.locator('text=Same-day delivery requests are handled manually');
    await expect(noticeSubtext).toBeVisible({ timeout: 15000 });

    // 3. Verify the WhatsApp button is present and visible
    const whatsappBtn = page.locator('a:has-text("Chat on WhatsApp")');
    await expect(whatsappBtn).toBeVisible({ timeout: 15000 });

    // 4. Verify the link is constructed correctly with the correct default or configured WhatsApp number and pre-filled message
    const href = await whatsappBtn.getAttribute('href');
    expect(href).not.toBeNull();
    if (href) {
      expect(href).toContain('wa.me');
      expect(href).toContain('text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Same-Day%20Delivery.');
    }
  });
});
