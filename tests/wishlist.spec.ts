import { test, expect } from '@playwright/test';

test.describe('Favourites System Flow', () => {
  test('should allow saving, removing, and moving items to cart in Favourites', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Start at menu page (using port 3001 as configured in baseURL)
    await page.goto('http://localhost:3001/menu');
    await page.waitForTimeout(2000); // Allow complete hydration

    // 2. Locate first product card and title
    const firstProductTitle = page.locator('h3').first();
    const productName = await firstProductTitle.textContent();
    console.log(`Testing Favourites with product: ${productName}`);

    // 3. Click the Heart icon on the first product card to save to Favourites
    // We search for the button with aria-label containing "Save to Favourites"
    const saveButton = page.locator('button[aria-label="Save to Favourites"]').first();
    await saveButton.click();

    // 4. Verify heart button changes its label to "Remove from Favourites"
    await expect(page.locator('button[aria-label="Remove from Favourites"]').first()).toBeVisible();

    // Scroll to top of the page to ensure the fixed Navbar is fully visible and not hidden
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 5. Verify favourites badge shows 1 in navbar
    const favouritesBadge = page.locator('a[aria-label="View Favourites"]').locator('.absolute');
    await expect(favouritesBadge).toHaveText('1');

    // 6. Navigate to the Favourites Page (routed at /wishlist)
    await page.click('a[aria-label="View Favourites"]');
    await page.waitForURL(/\/wishlist/);

    // 7. Verify Favourites page has the product
    await expect(page.locator('h1:has-text("My Favourites")')).toBeVisible();
    await expect(page.locator(`h3:has-text("${productName?.trim()}")`)).toBeVisible();

    // 8. Test clicking Add to Cart on the Favourites Page
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

    // 11. Test removing product from the Favourites Page
    const removeButton = page.locator('button[aria-label="Remove from Favourites"]').first();
    await removeButton.click();

    // 12. Verify empty state matches the requirements
    await expect(page.locator('text=No Favourites Yet')).toBeVisible();
    await expect(page.locator('text=Save your favourite cakes and desserts')).toBeVisible();

    // 13. Verify Continue Shopping button works and takes user back to menu
    const continueShoppingButton = page.locator('a:has-text("Continue Shopping")');
    await continueShoppingButton.click();
    await page.waitForURL(/\/menu/);

    console.log('Favourites Flow verified successfully!');
  });
});
