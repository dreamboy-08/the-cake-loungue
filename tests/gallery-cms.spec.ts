import { test, expect } from '@playwright/test';

test.describe('Product-Based Gallery CMS Verification', () => {

  test('should support product-based gallery selection, storefront display, navigation, and CRUD', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to admin panel gallery route
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Product Gallery CMS")')).toBeVisible();

    // Wait for loading state to disappear
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 20000 });

    // ----------------------------------------------------
    // TEST 1: Open Modal & Verify No Manual URL / Link Inputs Exist
    // ----------------------------------------------------
    await page.click('button:has-text("Add Gallery Item")');
    await expect(page.locator('h2:has-text("Add to Gallery")')).toBeVisible();

    // Confirm category selector exists
    await expect(page.locator('select')).toBeVisible();

    // Confirm manual URL and Destination link inputs DO NOT exist
    await expect(page.locator('input[placeholder*="Royal Raspberry Birthday Cake.jpg"]')).not.toBeVisible();
    await expect(page.locator('input[placeholder*="/shop/1 or /menu"]')).not.toBeVisible();

    // Select category "Wedding Cakes"
    await page.selectOption('select', 'Wedding Cakes');

    // Select product "Ivory Lace Wedding Cake"
    const productBtn = page.locator('button:has-text("Ivory Lace Wedding Cake")').first();
    await expect(productBtn).toBeVisible();
    await productBtn.click();

    // Verify Selected Product Summary Card displays automatically
    await expect(page.locator('h4:has-text("Ivory Lace Wedding Cake")')).toBeVisible();

    // Save item
    await page.click('button:has-text("Add to Gallery")');
    await expect(page.locator('text=Gallery item created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Ivory Lace Wedding Cake")').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 2: Verify Storefront Displays Selected Product & Navigates Correctly
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery')).toBeVisible();

    const storefrontCard = page.locator('#gallery').locator('a:has-text("Ivory Lace Wedding Cake")').first();
    await expect(storefrontCard).toBeVisible();

    // Click link (using force: true because of continuous marquee animation) and verify it navigates to product detail page /shop/13
    await storefrontCard.click({ force: true });
    await expect(page).toHaveURL(/.*\/shop\/13/);
    await expect(page.locator('h1:has-text("Ivory Lace Wedding Cake")')).toBeVisible();

    // ----------------------------------------------------
    // TEST 3: Disable / Hide Gallery Item
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Ivory Lace Wedding Cake")') }).first();
    await card.locator('button:has-text("Live")').click();
    await expect(page.locator('text=Gallery item is now Disabled')).toBeVisible();

    // Confirm hidden from storefront
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery').locator('text=Ivory Lace Wedding Cake')).not.toBeVisible();

    // ----------------------------------------------------
    // TEST 4: Delete Gallery Item
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    const disabledCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Ivory Lace Wedding Cake")') }).first();
    await disabledCard.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Gallery item deleted successfully')).toBeVisible();

    // Confirm completely removed
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery').locator('text=Ivory Lace Wedding Cake')).not.toBeVisible();
  });
});
