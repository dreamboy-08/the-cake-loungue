# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/cart-sync.spec.ts >> Cart State Synchronization >> should synchronize cart across menu and product detail pages
- Location: tests/cart-sync.spec.ts:4:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 90000ms exceeded.
Call log:
  - waiting for locator('h3').first()

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Cart State Synchronization', () => {
  4  |   test('should synchronize cart across menu and product detail pages', async ({ page }) => {
  5  |     // Increase timeout for the whole test
  6  |     test.setTimeout(90000);
  7  |
  8  |     // 1. Start at menu page
  9  |     await page.goto('http://localhost:3001/menu');
  10 |
  11 |     // 2. Find first product and add to cart
  12 |     const firstProductTitle = page.locator('h3').first();
> 13 |     const productName = await firstProductTitle.textContent();
     |                                                 ^ Error: locator.textContent: Test timeout of 90000ms exceeded.
  14 |     console.log(`Testing with product: ${productName}`);
  15 |
  16 |     const addButton = page.locator("button:has-text('Add')").first();
  17 |     await addButton.click();
  18 |
  19 |     // 3. Verify button changes to "Added"
  20 |     await expect(page.locator("button:has-text('Added')").first()).toBeVisible();
  21 |
  22 |     // 4. Verify navbar badge shows 1
  23 |     const cartBadge = page.locator('button[aria-label="View Cart"]').locator('.absolute');
  24 |     await expect(cartBadge).toHaveText('1');
  25 |
  26 |     // 5. Navigate to product detail page
  27 |     await firstProductTitle.click();
  28 |     await page.waitForURL(/\/shop\/.+/);
  29 |
  30 |     // 6. Verify detail page button says "Added"
  31 |     const detailAddButton = page.locator("button:has-text('Added')");
  32 |     await expect(detailAddButton).toBeVisible();
  33 |
  34 |     // 7. Open cart modal and verify item is there
  35 |     await page.click('button[aria-label="View Cart"]');
  36 |     await expect(page.locator('text=Your Cart (1)')).toBeVisible();
  37 |     await expect(page.locator(`h4:has-text("${productName?.trim()}")`)).toBeVisible();
  38 |
  39 |     // 8. Refresh page and verify persistence
  40 |     await page.reload();
  41 |     await expect(page.locator('button[aria-label="View Cart"]').locator('.absolute')).toHaveText('1');
  42 |     await page.click('button[aria-label="View Cart"]');
  43 |     await expect(page.locator(`h4:has-text("${productName?.trim()}")`)).toBeVisible();
  44 |
  45 |     // 9. Remove item from cart using aria-label
  46 |     const removeButton = page.locator(`button[aria-label="Remove ${productName?.trim()} from cart"]`);
  47 |     await removeButton.click();
  48 |
  49 |     // 10. Verify cart is empty
  50 |     await expect(page.locator('text=Your cart is feeling light...')).toBeVisible();
  51 |     await expect(page.locator('button[aria-label="View Cart"]').locator('.absolute')).not.toBeVisible();
  52 |
  53 |     // 11. Close modal and verify detail page button reverted to "Add to Cart"
  54 |     await page.click('button[aria-label="Close cart"]');
  55 |     await expect(page.locator("button:has-text('Add to Cart')")).toBeVisible();
  56 |
  57 |     await page.screenshot({ path: '/home/jules/verification/cart_sync_final.png', fullPage: true });
  58 |   });
  59 | });
  60 |
```