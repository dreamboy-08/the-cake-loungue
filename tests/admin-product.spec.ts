import { test, expect } from '@playwright/test';

/**
 * Admin Product CRUD & Sync Verification
 *
 * Note: These tests use mocked Firestore and Storage responses to verify the application's
 * internal logic, routing, and UI synchronization without requiring live Firebase credentials.
 */

test.describe('Admin Product Management & Sync', () => {

  test.beforeEach(async ({ page }) => {
    // Print browser console logs
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    // Mock Firestore for Categories (needed for the form)
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

    // Mock initial empty products list
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

    // Navigate to Admin Products
    await page.goto('http://localhost:3000/admin/products?bypass=true');
  });

  test('CRUD Flow: Create, Read, Update, Delete', async ({ page }) => {
    // 1. CREATE
    await page.click('button:has-text("Add New Product")');
    await page.locator('label:has-text("Product Name") + input').fill('Verification Cake');

    // Fill the variant price (which auto-synchronizes and updates the base price)
    await page.locator('input[placeholder="Price"]').first().fill('499');

    // For Category, wait for loading to finish and select option
    await page.waitForSelector('select:not([disabled])');
    await page.locator('label:has-text("Category") + select').selectOption({ label: 'Birthday Cakes' });

    await page.locator('label:has-text("Flavor") + input').fill('Vanilla');
    await page.locator('label:has-text("Description") + textarea').fill('This is a delicious verification cake.');

    // Upload an image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Add Image');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('data'),
    });

    // Mock successful creation
    await page.route('**/firestore.googleapis.com/**/products', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ name: 'projects/p/databases/d/documents/products/new-id-123' })
        });
      }
    });

    // Mock the subsequent list fetch with the new product
    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            documents: [{
              name: 'projects/p/databases/d/documents/products/new-id-123',
              fields: {
                name: { stringValue: 'Verification Cake' },
                price: { integerValue: '499' },
                category: { stringValue: 'Birthday Cakes' },
                img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
                flavor: { stringValue: 'Vanilla' }
              },
              createTime: new Date().toISOString(),
              updateTime: new Date().toISOString()
            }]
          })
        });
      }
    });

    await page.click('button:has-text("Create Product")');

    // Verify visibility in list
    await expect(page.locator('tbody tr').filter({ hasText: 'Verification Cake' })).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: 'Verification Cake' }).locator('text=₹499')).toBeVisible();

    // 2. UPDATE
    const row = page.locator('tbody tr').filter({ hasText: 'Verification Cake' });
    await row.locator('button').first().click(); // Click Edit button in the row
    await page.locator('label:has-text("Product Name") + input').fill('Updated Verification Cake');
    await page.locator('input[placeholder="Price"]').first().fill('1299');

    // Mock successful update
    await page.route('**/firestore.googleapis.com/**/products/new-id-123', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
    });

    // Mock list with updated data
    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            documents: [{
              name: 'projects/p/databases/d/documents/products/new-id-123',
              fields: {
                name: { stringValue: 'Updated Verification Cake' },
                price: { integerValue: '1299' },
                category: { stringValue: 'Birthday Cakes' },
                img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
              }
            }]
          })
        });
      }
    });

    await page.click('button:has-text("Update Product")');
    await expect(page.locator('tbody tr').filter({ hasText: 'Updated Verification Cake' })).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: 'Updated Verification Cake' }).locator('text=₹1299')).toBeVisible();

    // 3. DELETE
    const updatedRow = page.locator('tbody tr').filter({ hasText: 'Updated Verification Cake' });
    await updatedRow.locator('button').nth(1).click(); // Click Delete button in the row
    await page.click('button:has-text("Delete")');

    // Mock successful deletion and empty list
    await page.route('**/firestore.googleapis.com/**/products/new-id-123', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
    });

    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ documents: [] }) });
      }
    });

    await expect(page.locator('tbody tr').filter({ hasText: 'Updated Verification Cake' })).not.toBeVisible();
  });

  test('Visibility Sync: Customer Menu and Detail Page', async ({ page }) => {
    // 1. Mock a product in Firestore
    const mockProduct = {
      name: 'projects/p/databases/d/documents/products/999',
      fields: {
        name: { stringValue: 'Sync Test Cake' },
        price: { integerValue: '750' },
        category: { stringValue: 'Birthday Cakes' },
        img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
        description: { stringValue: 'This is a sync test cake.' },
        flavor: { stringValue: 'Chocolate' }
      }
    };

    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ documents: [mockProduct] })
      });
    });

    // 2. Check Customer Menu
    await page.goto('http://localhost:3000/menu');
    await page.waitForTimeout(2500); // Allow complete hydration
    await expect(page.locator('text=Sync Test Cake')).toBeVisible();
    await expect(page.locator('text=₹750')).toBeVisible();

    // 3. Check Product Detail Page
    await page.click('text=Sync Test Cake');
    await page.waitForURL(/\/shop\/999/);
    await expect(page.url()).toContain('/shop/999');
    await expect(page.locator('h1')).toContainText('Sync Test Cake');
    await expect(page.locator('text=This is a sync test cake.')).toBeVisible();
  });

  test('Image Handling: URL and Upload Preview UI', async ({ page }) => {
    await page.click('button:has-text("Add New Product")');

    // Test upload and preview rendering
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Add Image');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('data'),
    });

    // Verify preview card is visible
    const previewImg = page.locator('div[class*="relative aspect-square"] img');
    await expect(previewImg).toBeVisible();
  });
});
