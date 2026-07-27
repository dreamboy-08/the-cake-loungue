import { test, expect } from '@playwright/test';

test.describe('Wishlist System Flow', () => {
  test('should allow saving, removing, and moving items to cart in Wishlist', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Start at menu page (using port 3001 as configured in baseURL)
    await page.goto('http://localhost:3001/menu');
    await page.waitForTimeout(2000); // Allow complete hydration

    // 2. Locate first product card and title
    const firstProductTitle = page.locator('h3').first();
    const productName = await firstProductTitle.textContent();
    console.log(`Testing Wishlist with product: ${productName}`);

    // 3. Click the Heart icon on the first product card to add to Wishlist
    // We search for the button with aria-label containing "Add to Wishlist"
    const wishlistButton = page.locator('button[aria-label="Add to Wishlist"]').first();
    await wishlistButton.click();

    // 4. Verify heart button changes its label to "Remove from Wishlist"
    await expect(page.locator('button[aria-label="Remove from Wishlist"]').first()).toBeVisible();

    // Scroll to top of the page to ensure the fixed Navbar is fully visible and not hidden
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 5. Verify wishlist badge shows 1 in navbar
    const wishlistBadge = page.locator('a[aria-label="View Wishlist"]').locator('.absolute');
    await expect(wishlistBadge).toHaveText('1');

    // 6. Navigate to the Wishlist Page
    await page.click('a[aria-label="View Wishlist"]');
    await page.waitForURL(/\/wishlist/);

    // 7. Verify Wishlist page has the product
    await expect(page.locator('h1:has-text("My Premium Wishlist")')).toBeVisible();
    await expect(page.locator(`h3:has-text("${productName?.trim()}")`)).toBeVisible();

    // 8. Test clicking Add to Cart on the Wishlist Page
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    // 9. Verify navbar cart badge displays '1'
    const cartBadge = page.locator('button[aria-label="View Cart"]').locator('.absolute');
    await expect(cartBadge).toHaveText('1');

    // Scroll to top of the page to ensure the fixed Navbar is fully visible and not hidden before clicking View Cart
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 10. Open Cart Modal and verify product name matches
    await page.click('button[aria-label="View Cart"]');
    await expect(page.locator(`h4:has-text("${productName?.trim()}")`)).toBeVisible();
    await page.click('button[aria-label="Close cart"]');

    // 11. Test removing product from the Wishlist Page
    const removeButton = page.locator('button[aria-label="Remove from Wishlist"]').first();
    await removeButton.click();

    // 12. Verify empty state matches the requirements
    await expect(page.locator('text=Your Wishlist is Empty')).toBeVisible();
    await expect(page.locator('text=Save your favourite cakes and desserts')).toBeVisible();

    // 13. Verify Continue Shopping button works and takes user back to menu
    const continueShoppingButton = page.locator('a:has-text("Continue Shopping")');
    await continueShoppingButton.click();
    await page.waitForURL(/\/menu/);

    console.log('Wishlist Flow verified successfully!');
  });
});
