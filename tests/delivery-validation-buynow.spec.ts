import { test, expect } from '@playwright/test';

test.describe('Buy Now & 16-Hour Preparation Validation E2E Flow', () => {
  test('should allow buying now with selected quantity and validate prep rules on checkout', async ({ page }) => {
    // 1. Visit Product Page
    await page.goto('http://localhost:3000/shop/1?bypass=true');
    await page.waitForTimeout(1000); // Wait for hydration

    // Check that Product Details Page loads
    await expect(page.locator('h1')).toContainText('Royal Raspberry Birthday Cake');

    // Check that Premium Info Box is visible on Product details page
    await expect(page.locator('text=Dynamic Preparation Time Rule')).toBeVisible();
    await expect(page.locator('text=Earliest Delivery:')).toBeVisible();

    // 2. Adjust Quantity to 2
    await page.click('[aria-label="Increase quantity"]');

    // 3. Click "Buy Now"
    const buyNowBtn = page.locator('[aria-label="Buy Royal Raspberry Birthday Cake Now"]');
    await expect(buyNowBtn).toBeVisible();
    await buyNowBtn.click();

    // 4. Verify direct navigation to Checkout (skipping cart drawer)
    await page.waitForURL(/\/checkout/);
    await expect(page.url()).toContain('/checkout');

    // Check that Checkout page loaded with correct single item and quantity
    await expect(page.locator('h1')).toContainText('Secure Checkout');
    await expect(page.locator('h4', { hasText: 'Royal Raspberry Birthday Cake' })).toBeVisible();
    await expect(page.locator('text=Quantity: 2')).toBeVisible();

    // Check that Subtotal is computed correctly (₹499 * 2 = ₹998)
    await expect(page.locator('text=Subtotal').locator('..').locator('span').last()).toContainText('₹998');

    // Check that Prep Rule Card is rendered on Checkout page
    await expect(page.locator('text=Dynamic Preparation Time Rule')).toBeVisible();
  });
});
