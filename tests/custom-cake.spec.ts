import { test, expect } from '@playwright/test';

test.describe('Custom Cake Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/custom-cake');
    // Wait for the page to be fully loaded
    await expect(page.locator('h1')).toContainText('Design Your Masterpiece');
  });

  test('should load the custom cake builder page', async ({ page }) => {
    await expect(page.locator('text=Estimated Price')).toBeVisible();
  });

  test('should update price when changing flavor', async ({ page }) => {
    // Get the price display specifically
    const priceDisplay = page.locator('span.text-rose-deep').first();
    const initialPrice = await priceDisplay.innerText();

    // Select Vanilla
    await page.click('button:has-text("Vanilla")');

    // Wait for price to potentially change
    await page.waitForTimeout(500);
    const newPrice = await priceDisplay.innerText();
    expect(initialPrice).not.toBe(newPrice);
  });

  test('should update price when changing weight', async ({ page }) => {
    const priceDisplay = page.locator('span.text-rose-deep').first();
    const initialPrice = await priceDisplay.innerText();
    expect(initialPrice).toBe('₹499');

    // Select 1 Kg
    const weightBtn = page.locator('button:has-text("1 Kg")');
    await weightBtn.click();

    // Wait for the specific price to appear (499 * 1.8 = 898)
    await expect(priceDisplay).toHaveText(/₹898/);
  });

  test('should show validation errors if contact info is missing', async ({ page }) => {
    // We expect an alert if name/phone is missing
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Please enter your name and phone number');
      await dialog.dismiss();
    });

    await page.click('button:has-text("Send Custom Cake Request")');
  });

  test('responsive layout check', async ({ page }) => {
    // Desktop: side by side (60/40)
    await page.setViewportSize({ width: 1280, height: 800 });
    // Use a more specific selector for the main grid
    const grid = page.locator('div.grid.lg\\:grid-cols-10');
    await expect(grid).toBeVisible();

    // Mobile: stacked
    await page.setViewportSize({ width: 375, height: 667 });

    const preview = page.locator('div.lg\\:col-span-6');
    const form = page.locator('div.lg\\:col-span-4');

    const previewBox = await preview.boundingBox();
    const formBox = await form.boundingBox();

    if (previewBox && formBox) {
      expect(formBox.y).toBeGreaterThan(previewBox.y);
    }
  });
});
