import { test, expect } from '@playwright/test';

test.describe('Cart State Synchronization', () => {
  test('should synchronize cart across menu and product detail pages', async ({ page }) => {
    // Increase timeout for the whole test
    test.setTimeout(90000);

    // 1. Start at menu page
    await page.goto('http://localhost:3001/menu');

    // 2. Find first product and add to cart
    const firstProductTitle = page.locator('h3').first();
    const productName = await firstProductTitle.textContent();
    console.log(`Testing with product: ${productName}`);

    const addButton = page.locator("button:has-text('Add')").first();
    await addButton.click();

    // 3. Verify button changes to "Added"
    await expect(page.locator("button:has-text('Added')").first()).toBeVisible();

    // 4. Verify navbar badge shows 1
    const cartBadge = page.locator('button[aria-label="View Cart"]').locator('.absolute');
    await expect(cartBadge).toHaveText('1');

    // 5. Navigate to product detail page
    await firstProductTitle.click();
    await page.waitForURL(/\/shop\/.+/);

    // 6. Verify detail page button says "Added"
    const detailAddButton = page.locator("button:has-text('Added')");
    await expect(detailAddButton).toBeVisible();

    // 7. Open cart modal and verify item is there
    await page.click('button[aria-label="View Cart"]');
    await expect(page.locator('text=Your Cart (1)')).toBeVisible();
    await expect(page.locator(`h4:has-text("${productName?.trim()}")`)).toBeVisible();

    // 8. Refresh page and verify persistence
    await page.reload();
    await expect(page.locator('button[aria-label="View Cart"]').locator('.absolute')).toHaveText('1');
    await page.click('button[aria-label="View Cart"]');
    await expect(page.locator(`h4:has-text("${productName?.trim()}")`)).toBeVisible();

    // 9. Remove item from cart using aria-label
    const removeButton = page.locator(`button[aria-label="Remove ${productName?.trim()} from cart"]`);
    await removeButton.click();

    // 10. Verify cart is empty
    await expect(page.locator('text=Your cart is feeling light...')).toBeVisible();
    await expect(page.locator('button[aria-label="View Cart"]').locator('.absolute')).not.toBeVisible();

    // 11. Close modal and verify detail page button reverted to "Add to Cart"
    await page.click('button[aria-label="Close cart"]');
    await expect(page.locator("button:has-text('Add to Cart')")).toBeVisible();

    await page.screenshot({ path: '/home/jules/verification/cart_sync_final.png', fullPage: true });
  });
});
