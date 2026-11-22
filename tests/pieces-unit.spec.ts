import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-auth-helper';

test.describe('Admin Product — Pieces Unit Variants', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Firestore to avoid live Firebase dependency
    await page.route('**/firestore.googleapis.com/**/categories*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          documents: [
            { name: 'projects/p/databases/d/documents/categories/1', fields: { name: { stringValue: 'Birthday Cakes' } } }
          ]
        })
      });
    });

    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ documents: [] }) });
      } else {
        await route.continue();
      }
    });

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/products');
    await expect(page.getByRole('button', { name: 'Add New Product' })).toBeVisible();
  });

  test('ProductForm renders both Weights & Variants and Pieces Variants sections', async ({ page }) => {
    test.setTimeout(60000);
    await page.click('button:has-text("Add New Product")');

    // Weight section
    await expect(page.getByText('Weights & Variants', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Variant/i })).toBeVisible();

    // Pieces section
    await expect(page.getByText('Pieces Variants', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Pieces Option/i })).toBeVisible();
  });

  test('can add and remove a pieces option', async ({ page }) => {
    test.setTimeout(60000);
    await page.click('button:has-text("Add New Product")');

    // Initially no pieces rows — only placeholder text
    await expect(page.getByText('No pieces variants', { exact: false })).toBeVisible();

    // Add a pieces option
    await page.getByRole('button', { name: /Add Pieces Option/i }).click();

    // A select for piece label should now exist
    const pieceSelect = page.locator('select').filter({ hasText: /Piece/ }).last();
    await expect(pieceSelect).toBeVisible();

    // Set a price for the piece
    const priceCells = page.locator('input[placeholder="Price"]');
    // The last price input belongs to the new pieces row
    await priceCells.last().fill('299');

    // Remove the pieces option
    const removeButtons = page.locator('button[aria-label], button:has(svg.lucide-x)');
    // Click the trash/x button on the pieces row (last remove button)
    const lastRemove = page.locator('button').filter({ has: page.locator('svg') }).last();
    await lastRemove.click();

    // Placeholder text should be back
    await expect(page.getByText('No pieces variants', { exact: false })).toBeVisible();
  });

  test('pieces options support standard piece labels via dropdown', async ({ page }) => {
    test.setTimeout(60000);
    await page.click('button:has-text("Add New Product")');
    await page.getByRole('button', { name: /Add Pieces Option/i }).click();

    // The pieces select should have standard options
    const pieceSelect = page.locator('select').filter({ hasText: /Piece/ }).last();
    const options = await pieceSelect.locator('option').allTextContents();

    expect(options).toContain('1 Piece');
    expect(options).toContain('6 Pieces');
    expect(options).toContain('12 Pieces');
  });
});

test.describe('Product Detail — Pieces selector UI', () => {
  test('weight-based product shows weight selector, not pieces selector', async ({ page }) => {
    test.setTimeout(60000);
    // Product id=1 has weights but no pieces in static data
    await page.goto('http://localhost:3000/shop/1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Select Weight', { exact: false })).toBeVisible();
    // Pieces selector should not appear for weight-only products
    await expect(page.getByText('Select Quantity', { exact: false })).not.toBeVisible();
  });
});
