import { test, expect } from '@playwright/test';

test.describe('Decoration & Party Essentials System E2E', () => {

  test('Admin CRUD and Suggestion Engine integration flow', async ({ page }) => {
    // 1. Visit Admin Categories and confirm listing default categories
    await page.goto('http://localhost:3000/admin/decorations-categories?bypass=true');
    await expect(page.locator('h3:has-text("Party Essentials")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Candles")').first()).toBeVisible();

    // 2. Visit Admin Decorations Management Page
    await page.goto('http://localhost:3000/admin/decorations?bypass=true');
    await expect(page.locator('h1:has-text("Deco & Party Essentials")')).toBeVisible();
    await expect(page.locator('text=Party Poppers (Premium)').first()).toBeVisible();

    // 3. Create a new decorative product
    await page.click('button:has-text("Add Decoration")');
    await page.locator('label:has-text("Product Name") + input').fill('E2E LED Balloon');
    await page.locator('label:has-text("Category") + select').selectOption('Party Essentials');
    await page.locator('label:has-text("Base Price") + input').fill('150');
    await page.locator('label:has-text("Short Description") + input').fill('Beautiful shining E2E LED balloon.');

    // Add file preview mock and create
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Add Image');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'balloon.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('balloon_data'),
    });

    // Save
    await page.click('button:has-text("Create Decoration")');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=E2E LED Balloon').first()).toBeVisible();

    // 4. Verification on Storefront (Product detail suggestions integration)
    await page.goto('http://localhost:3000/shop/1'); // Visit product page with ID 1
    await expect(page.locator('text=Enhance Your Celebration with Decorative Add-ons')).toBeVisible();
    await expect(page.locator('text=Party Poppers (Premium)').first()).toBeVisible();
  });
});
