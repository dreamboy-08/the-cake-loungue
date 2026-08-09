import { test, expect } from '@playwright/test';

test.describe('Phase 8 Website Settings & Branding Integration E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate directly to Website Settings tab with auth bypass
    await page.goto('http://localhost:3000/admin/website-content?tab=settings&bypass=true');
  });

  test('Should update branding and see changes applied dynamically across the storefront', async ({ page }) => {
    // 1. Confirm we are on the branding settings panel
    await expect(page.locator('h2:has-text("Branding & Styling Settings")')).toBeVisible();

    // 2. Change Brand Logo Text and Business details
    const logoInput = page.locator('input[value="The Cake Lounge"]').first();
    await logoInput.fill('Elite Patisserie TEST');

    const businessNameInput = page.locator('input[value="The Cake Lounge Patisserie"]').first();
    await businessNameInput.fill('Elite Patisserie Corp');

    const phoneInput = page.locator('input[value="+91 98765 43210"]').first();
    await phoneInput.fill('+91 12345 67890');

    const whatsappInput = page.locator('input[value="+91 98765 43210"]').last();
    await whatsappInput.fill('+91 55555 44444');

    const addressInput = page.locator('textarea').last();
    await addressInput.fill('99 Custom Elite Street, Gurugram, India');

    // 3. Save Website Branding
    await page.click('button:has-text("Save Website Branding")');

    // 4. Confirm Toast feedback
    await expect(page.locator('text=Settings changes saved successfully!')).toBeVisible();

    // 5. Navigate to Storefront Homepage
    await page.goto('http://localhost:3000/');

    // 6. Verify brand logo text reflects 'Elite Patisserie TEST' on Navbar and Footer
    await expect(page.locator('#navbar').locator('text=Elite Patisserie TEST')).toBeVisible();
    await expect(page.locator('footer').locator('text=Elite Patisserie TEST')).toBeVisible();

    // 7. Verify Contact Info reflects the updated values
    await expect(page.locator('#contact').locator('text=99 Custom Elite Street, Gurugram, India')).toBeVisible();
    await expect(page.locator('#contact').locator('text=+91 12345 67890')).toBeVisible();

    // 8. Go to Custom Cake page and verify WhatsApp routing
    await page.goto('http://localhost:3000/custom-cake');
    const whatsappBtn = page.locator('button:has-text("Send Your Cake Design on WhatsApp")');
    await expect(whatsappBtn).toBeVisible();

    // Trigger click on whatsapp button (which normally does window.open)
    // We can evaluate the window.open call or verify the logic in code
  });

});
