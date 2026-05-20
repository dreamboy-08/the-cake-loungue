import { test, expect } from '@playwright/test';

test('Verify Shared Cart State across pages', async ({ page }) => {
  // 1. Go to Menu and add an item
  await page.goto('http://localhost:3000/menu');
  await page.waitForSelector('text=Our Exquisite Menu');

  // Use a more specific locator for the "Add" button inside ProductCard
  // Selecting by text 'Add' inside a button
  const addToCartButton = page.getByRole('button', { name: /Add/i }).first();
  await addToCartButton.click();

  // 2. Verify Navbar badge updates
  // There are two badges (one for desktop, one for mobile).
  const navCartBadge = page.locator('nav span.bg-rose-deep').first();
  await expect(navCartBadge).toBeVisible({ timeout: 10000 });
  await expect(navCartBadge).toHaveText('1');

  // 3. Navigate to a Product Detail page and add another item
  const productHeading = page.locator('div.flex-1 h3').nth(1);
  const productName = await productHeading.innerText();
  await productHeading.click();
  await page.waitForURL(/\/products\/\d+/);

  await page.getByRole('button', { name: /Add to Cart/i }).click();

  // 4. Verify Navbar badge updates to 2
  await expect(navCartBadge).toHaveText('2');

  // 5. Navigate back to Home and verify badge persists
  await page.goto('http://localhost:3000/');
  await expect(navCartBadge).toHaveText('2');

  // Take screenshot
  await page.screenshot({ path: 'verification/cart_badge_verification.png' });

  console.log('Shared Cart State verified successfully.');
});
