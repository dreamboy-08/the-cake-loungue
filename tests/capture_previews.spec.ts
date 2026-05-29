import { test, expect } from '@playwright/test';

test('capture home page animation', async ({ page }) => {
  await page.goto('/');
  // Find an "Add to Cart" button on a product card
  const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
  await addToCartBtn.scrollIntoViewIfNeeded();

  // Click and capture
  await addToCartBtn.click();
  await page.waitForTimeout(300); // Mid flight
  await page.screenshot({ path: 'screenshot_home_animation.png' });
});

test('capture product detail page animation', async ({ page }) => {
  // Navigate to a product detail page (assuming slug exists or using ID)
  // Let's use /menu and click a product first to get to detail
  await page.goto('/menu');
  await page.locator('a[href^="/shop/"]').first().click();
  await page.waitForLoadState('networkidle');

  const addToCartBtn = page.locator('button:has-text("Add to Cart")');
  await addToCartBtn.scrollIntoViewIfNeeded();

  await addToCartBtn.click();
  await page.waitForTimeout(300); // Mid flight
  await page.screenshot({ path: 'screenshot_product_detail_animation.png' });
});

test('capture mobile view animation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
  await addToCartBtn.scrollIntoViewIfNeeded();

  await addToCartBtn.click();
  await page.waitForTimeout(300); // Mid flight
  await page.screenshot({ path: 'screenshot_mobile_animation.png' });
});
