import { test, expect } from '@playwright/test';

test.describe('Custom Cake Message & Dynamic Serving Info E2E', () => {
  test('should customize, add to cart, and check order summary', async ({ page }) => {
    // 1. Navigate to the product detail page
    await page.goto('http://localhost:3000/shop/1');

    // 2. Verify Serving Information matches 0.5 Kg (default)
    const servingInfo = page.locator('text=Serves 4–6 People');
    await expect(servingInfo).toBeVisible();

    // 3. Change weight to 1 Kg
    const oneKgButton = page.locator('button:has-text("1 Kg")');
    await oneKgButton.click();

    // 4. Verify Serving Information dynamically updates to 8–10 People
    const updatedServingInfo = page.locator('text=Serves 8–10 People');
    await expect(updatedServingInfo).toBeVisible();

    // 5. Fill custom cake message
    const messageInput = page.locator('input[placeholder="Write your cake message..."]');
    await expect(messageInput).toBeVisible();
    await messageInput.fill('Happy Birthday Aarav');

    // 6. Verify live character counter shows 20/25
    const charCounter = page.locator('text=20/25');
    await expect(charCounter).toBeVisible();

    // 7. Click Add to Cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    // Scroll back to top to ensure sticky/fixed navbar elements are fully in viewport and clickable
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 8. Open Cart Drawer and verify details
    const cartButton = page.locator('button[aria-label="View Cart"]');
    await cartButton.click({ force: true });

    const cartHeader = page.locator('text=Your Cart (1)');
    await expect(cartHeader).toBeVisible();

    // Verify Weight & Serves inside Cart Modal
    await expect(page.locator('text=Standard • 1 Kg • Serves 8–10 People')).toBeVisible();
    // Verify Cake Message inside Cart Modal
    await expect(page.locator('text=Happy Birthday Aarav').first()).toBeVisible();

    // 9. Navigate to Checkout Page
    const checkoutButton = page.locator('button:has-text("Checkout Now")');
    await checkoutButton.click();

    await page.waitForURL(/\/checkout/);
    await expect(page.url()).toContain('/checkout');

    // 10. Verify order summary in checkout page displays customizations
    await expect(page.locator('text=Weight: 1 Kg').first()).toBeVisible();
    await expect(page.locator('text=Serves: 8–10 People').first()).toBeVisible();
    await expect(page.locator('text=Cake Message').first()).toBeVisible();
    await expect(page.locator('text=Happy Birthday Aarav').first()).toBeVisible();

    // Take screenshot for verification
    await page.screenshot({ path: '/home/jules/verification/custom_cake_checkout_summary.png', fullPage: true });
    console.log('Custom Cake E2E flow verified successfully!');
  });
});
