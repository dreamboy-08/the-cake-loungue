import { test, expect } from '@playwright/test';

test.describe('Decorative Items CMS & Storefront Integration Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to Admin Decorations CMS panel with auth bypass
    await page.goto('http://localhost:3000/admin/decorations?bypass=true');
    await expect(page.locator('h1:has-text("Decorative Items CMS")')).toBeVisible();
  });

  test('Decorations CMS: Listing, CRUD operations, Reordering, and Safety Defaults', async ({ page }) => {
    // 1. Initial State Check
    await expect(page.locator('h3:has-text("Premium Pastel Balloon Bouquet")')).toBeVisible();
    await expect(page.locator('h3:has-text("Luxury Golden Sparkler Candles")')).toBeVisible();

    // 2. Reset Defaults to guarantee consistent state
    await page.click('button:has-text("Reset Defaults")');
    await page.click('button:has-text("Restore Defaults")');
    await expect(page.getByText('Restored decorative items to default configurations!')).toBeVisible();

    // 3. Create a new decorative item
    await page.click('button:has-text("Add Decorative Item")');
    await expect(page.locator('h2:has-text("New Decorative Item")')).toBeVisible();

    await page.locator('input[placeholder="e.g. Elegant Golden Sparkler Candles"]').fill('Birthday LED Fairy Lights');
    await page.locator('textarea[placeholder="Provide a detailed description of the decorative item..."]').fill('Warm white LED lights to beautify your party decoration space.');
    await page.locator('input[placeholder="e.g. 149"]').fill('199');
    await page.locator('select').selectOption('Other');

    // Click submit
    await page.click('button:has-text("Create Item")');
    await expect(page.getByText('Decorative Item created successfully.')).toBeVisible();

    // Verify item is added to the dashboard
    await expect(page.locator('h3:has-text("Birthday LED Fairy Lights")')).toBeVisible();

    // 4. Edit the item
    const decorRow = page.locator('div.group').filter({ has: page.locator('h3:text("Birthday LED Fairy Lights")') }).first();
    await decorRow.locator('button[title="Edit"]').click();
    await page.locator('input[placeholder="e.g. Elegant Golden Sparkler Candles"]').fill('Birthday LED Rainbow Fairy Lights');
    await page.click('button:has-text("Save Item")');
    await expect(page.getByText('Decorative Item updated successfully.')).toBeVisible();
    await expect(page.locator('h3:has-text("Birthday LED Rainbow Fairy Lights")')).toBeVisible();

    // 5. Toggle active status
    const toggleBtn = page.locator('div.group').filter({ has: page.locator('h3:text("Birthday LED Rainbow Fairy Lights")') }).locator('button:has-text("Live")').first();
    await toggleBtn.click();
    await expect(page.getByText('is now Disabled.')).toBeVisible();

    // Toggle back to active
    const disabledBtn = page.locator('div.group').filter({ has: page.locator('h3:text("Birthday LED Rainbow Fairy Lights")') }).locator('button:has-text("Hidden")').first();
    await disabledBtn.click();
    await expect(page.getByText('is now Active.')).toBeVisible();

    // 6. Move display order (Move Up)
    const listRow = page.locator('div.group').filter({ has: page.locator('h3:text("Birthday LED Rainbow Fairy Lights")') }).first();
    const moveUpBtn = listRow.locator('button[title="Move Up"]');
    if (await moveUpBtn.isEnabled()) {
      await moveUpBtn.click();
      await expect(page.getByText('Display order updated successfully.')).toBeVisible();
    }

    // 7. Delete the item
    await listRow.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.getByText('Decorative item deleted successfully.')).toBeVisible();
    await expect(page.locator('h3:has-text("Birthday LED Rainbow Fairy Lights")')).not.toBeVisible();
  });

  test('Storefront Integration: Decoration detail page and recommendations', async ({ page }) => {
    // 1. Visit decoration detail page directly
    await page.goto('http://localhost:3000/shop/dec_1');
    await expect(page.locator('h1:has-text("Premium Pastel Balloon Bouquet")')).toBeVisible();

    // Verify cake specific selections are hidden
    await expect(page.locator('label:has-text("Select Weight")')).not.toBeVisible();
    await expect(page.locator('span:has-text("Serving Information")')).not.toBeVisible();
    await expect(page.locator('span:has-text("Cake Message")')).not.toBeVisible();

    // Add to Cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('button:has-text("Added to Cart")')).toBeVisible();

    // 2. Open general cake page and check recommendations
    await page.goto('http://localhost:3000/shop/1');
    await expect(page.locator('h1:has-text("Royal Raspberry Birthday Cake")')).toBeVisible();

    // Verify recommendations contain balloons
    await expect(page.locator('h4:has-text("Premium Pastel Balloon Bouquet")').first()).toBeVisible();
  });

});
