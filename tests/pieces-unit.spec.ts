import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-auth-helper';

/**
 * Variant validation scenarios:
 * 1. Weight-only  → PASS
 * 2. Pieces-only  → PASS
 * 3. Both         → PASS
 * 4. Neither      → validation error
 */

test.describe('Admin Product — Weight / Pieces variant validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Firestore to avoid live Firebase dependency
    await page.route('**/firestore.googleapis.com/**/categories*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          documents: [
            {
              name: 'projects/p/databases/d/documents/categories/1',
              fields: { name: { stringValue: 'Birthday Cakes' } }
            }
          ]
        })
      });
    });

    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ documents: [] })
        });
      } else {
        await route.continue();
      }
    });

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/products');
    await expect(page.getByRole('button', { name: 'Add New Product' })).toBeVisible();
  });

  /** Fill in the required fields shared by all scenarios. */
  async function fillRequiredFields(page: any) {
    await page.click('button:has-text("Add New Product")');

    await page.locator('label:has-text("Product Name") + input').fill('Test Cake Validation');

    // Category dropdown — select the first real option
    const catSelect = page.locator('select').filter({ hasText: /Birthday Cakes|Select Category/ }).first();
    await catSelect.selectOption({ index: 1 });

    // Base price
    await page.locator('label:has-text("Base Price") + input').fill('499');

    // Description
    await page.locator('textarea').fill('A test cake for validation.');

    // Flavor
    await page.locator('label:has-text("Flavor") + input').fill('Vanilla');

    // Add a placeholder image URL so the image check passes
    // (image upload is mocked away in unit test context — skip image requirement)
  }

  test('Scenario 1: Weight-only product passes validation', async ({ page }) => {
    test.setTimeout(60000);
    await fillRequiredFields(page);

    // Weights section already has the default "0.5 Kg" row — just set its price
    await page.locator('input[placeholder="Price"]').first().fill('499');

    // Pieces section must be empty (default state)
    await expect(page.getByText('No pieces variants', { exact: false })).toBeVisible();

    // Form is valid — no "weight variant" error should appear on submit attempt
    // (actual save would need Cloudinary+Firestore; we just verify no blocking validation toast)
    await page.getByRole('button', { name: /Create Product|Update Product/i }).click();
    await page.waitForTimeout(500);

    // Should NOT show the weight/pieces error
    const toast = page.locator('text=Please add at least one Weight or Pieces variant');
    await expect(toast).not.toBeVisible();

    // Should NOT show the old mandatory weight error
    const oldError = page.locator('text=At least one weight variant is required');
    await expect(oldError).not.toBeVisible();
  });

  test('Scenario 2: Pieces-only product passes validation', async ({ page }) => {
    test.setTimeout(60000);
    await fillRequiredFields(page);

    // Remove the default weight row
    const removeButtons = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
    // The first X button in the weights section removes the default row
    // Find it by its proximity to the weight select
    const weightRow = page.locator('div').filter({ has: page.locator('select').filter({ hasText: /Kg/ }) }).first();
    const weightRemoveBtn = weightRow.locator('button').last();
    await weightRemoveBtn.click();
    await page.waitForTimeout(200);

    // Weights should now be empty
    await expect(page.locator('select').filter({ hasText: /Kg/ })).not.toBeVisible();

    // Add one pieces option
    await page.getByRole('button', { name: /Add Pieces Option/i }).click();
    await page.locator('input[placeholder="Price"]').last().fill('299');

    // Try to submit
    await page.getByRole('button', { name: /Create Product|Update Product/i }).click();
    await page.waitForTimeout(500);

    // Should NOT show the weight/pieces error
    const toast = page.locator('text=Please add at least one Weight or Pieces variant');
    await expect(toast).not.toBeVisible();

    // Should NOT show the old mandatory weight error
    const oldError = page.locator('text=At least one weight variant is required');
    await expect(oldError).not.toBeVisible();
  });

  test('Scenario 3: Both Weight and Pieces passes validation', async ({ page }) => {
    test.setTimeout(60000);
    await fillRequiredFields(page);

    // Set price on existing default weight row
    await page.locator('input[placeholder="Price"]').first().fill('499');

    // Add a pieces option
    await page.getByRole('button', { name: /Add Pieces Option/i }).click();
    await page.locator('input[placeholder="Price"]').last().fill('199');

    // Try to submit
    await page.getByRole('button', { name: /Create Product|Update Product/i }).click();
    await page.waitForTimeout(500);

    // Should NOT show either variant error
    await expect(page.locator('text=Please add at least one Weight or Pieces variant')).not.toBeVisible();
    await expect(page.locator('text=At least one weight variant is required')).not.toBeVisible();
  });

  test('Scenario 4: Neither Weight nor Pieces shows validation error', async ({ page }) => {
    test.setTimeout(60000);
    await fillRequiredFields(page);

    // Remove the default weight row
    const weightRow = page.locator('div').filter({ has: page.locator('select').filter({ hasText: /Kg/ }) }).first();
    const weightRemoveBtn = weightRow.locator('button').last();
    await weightRemoveBtn.click();
    await page.waitForTimeout(200);

    // Pieces section stays empty (default)
    await expect(page.getByText('No pieces variants', { exact: false })).toBeVisible();

    // Try to submit
    await page.getByRole('button', { name: /Create Product|Update Product/i }).click();
    await page.waitForTimeout(500);

    // MUST show the new combined error
    const toast = page.locator('text=Please add at least one Weight or Pieces variant');
    await expect(toast).toBeVisible();
  });
});

test.describe('Admin Product — Pieces section renders correctly', () => {
  test('ProductForm renders Weights and Pieces sections independently', async ({ page }) => {
    test.setTimeout(60000);

    await page.route('**/firestore.googleapis.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ documents: [] })
      });
    });

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/products');
    await page.click('button:has-text("Add New Product")');

    await expect(page.getByText('Weights & Variants', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Variant/i })).toBeVisible();
    await expect(page.getByText('Pieces Variants', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Pieces Option/i })).toBeVisible();
    await expect(page.getByText('No pieces variants', { exact: false })).toBeVisible();
  });

  test('Pieces dropdown has standard labels', async ({ page }) => {
    test.setTimeout(60000);

    await page.route('**/firestore.googleapis.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ documents: [] })
      });
    });

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/products');
    await page.click('button:has-text("Add New Product")');
    await page.getByRole('button', { name: /Add Pieces Option/i }).click();

    const pieceSelect = page.locator('select').filter({ hasText: /Piece/ }).last();
    const options = await pieceSelect.locator('option').allTextContents();

    expect(options).toContain('1 Piece');
    expect(options).toContain('2 Pieces');
    expect(options).toContain('6 Pieces');
    expect(options).toContain('12 Pieces');
  });
});

test.describe('Product Detail — Pieces selector UI', () => {
  test('Weight-based product shows weight selector only', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:3000/shop/1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Select Weight', { exact: false })).toBeVisible();
    await expect(page.getByText('Select Quantity', { exact: false })).not.toBeVisible();
  });
});
