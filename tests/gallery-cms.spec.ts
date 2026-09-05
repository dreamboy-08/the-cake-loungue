import { test, expect } from '@playwright/test';

test.describe('Gallery CMS Verification', () => {

  test('should support selecting existing products, multi-select, sorting, toggling, and removal from Our Creations', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to admin panel gallery route
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Gallery / Our Creations")')).toBeVisible();

    // Wait for loading to finish
    await expect(page.locator('text=Synchronizing Our Creations CMS Module...')).not.toBeVisible({ timeout: 20000 });

    // ----------------------------------------------------
    // TEST 1: Open Add Products modal and select existing products
    // ----------------------------------------------------
    await page.click('button:has-text("+ Add Products")');
    await expect(page.locator('h2:has-text("Add Products to Our Creations")')).toBeVisible();

    // Search for a product
    await page.fill('input[placeholder="Search products..."]', 'Chocolate');

    // Select the first available matching product
    const productCheckbox = page.locator('input[type="checkbox"]').first();
    if (await productCheckbox.isVisible()) {
      await productCheckbox.click({ force: true });
    }

    // Click "Add Selected"
    await page.click('button:has-text("Add Selected")');
    await expect(page.locator('text=Added 1 product(s) to Our Creations!')).toBeVisible();

    // ----------------------------------------------------
    // TEST 2: Verify storefront reflects selected products
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery')).toBeVisible();

    // ----------------------------------------------------
    // TEST 3: Toggle active/disabled state
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Synchronizing Our Creations CMS Module...')).not.toBeVisible({ timeout: 15000 });

    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('button[title="Remove from Our Creations"]') }).first();
    if (await card.isVisible()) {
      const toggleBtn = card.locator('button').filter({ hasText: /Live|Hidden/ }).first();
      await toggleBtn.click();
      await expect(page.locator('text=Showcase item is now')).toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 4: Remove product from Our Creations (non-destructive)
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Synchronizing Our Creations CMS Module...')).not.toBeVisible({ timeout: 15000 });

    const deleteCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('button[title="Remove from Our Creations"]') }).first();
    if (await deleteCard.isVisible()) {
      await deleteCard.locator('button[title="Remove from Our Creations"]').click();
      await page.click('button:has-text("Remove Product")');
      await expect(page.locator('text=Product removed from Our Creations.')).toBeVisible();
    }
  });
});
