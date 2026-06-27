import { test, expect } from '@playwright/test';

/**
 * Admin Product CRUD & Sync Verification
 *
 * Note: These tests use mocked Firestore and Storage responses to verify the application's
 * internal logic, routing, and UI synchronization without requiring live Firebase credentials.
 */

test.describe('Admin Product Management & Sync', () => {

  test.beforeEach(async ({ page }) => {
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
    await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Verification Cake');
    await page.fill('input[placeholder="499"]', '499');
    await page.selectOption('select', 'Birthday Cakes');
    await page.fill('input[placeholder="https://images.unsplash.com/..."]', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587');

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
    await expect(page.locator('text=Verification Cake')).toBeVisible();
    await expect(page.locator('text=₹499')).toBeVisible();

    // 2. UPDATE
    await page.click('button[title="Edit Product"]');
    await page.fill('input[value="Verification Cake"]', 'Updated Verification Cake');
    await page.fill('input[value="499"]', '1299');

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

    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Updated Verification Cake')).toBeVisible();
    await expect(page.locator('text=₹1299')).toBeVisible();

    // 3. DELETE
    await page.click('button[title="Delete Product"]');
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

    await expect(page.locator('text=Updated Verification Cake')).not.toBeVisible();
  });

  test('Visibility Sync: Customer Menu and Detail Page', async ({ page }) => {
    // 1. Mock a product in Firestore
    const mockProduct = {
      name: 'projects/p/databases/d/documents/products/sync-id',
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
    await expect(page.locator('text=Sync Test Cake')).toBeVisible();
    await expect(page.locator('text=₹750')).toBeVisible();

    // 3. Check Product Detail Page
    // Assuming clicking the cake leads to /product/sync-id
    await page.click('text=Sync Test Cake');
    await expect(page.url()).toContain('/product/');
    await expect(page.locator('h1')).toContainText('Sync Test Cake');
    await expect(page.locator('text=This is a sync test cake.')).toBeVisible();
  });

  test('Image Handling: URL and Upload Fallback UI', async ({ page }) => {
    await page.click('button:has-text("Add New Product")');

    // Test URL input
    await page.fill('input[placeholder="https://images.unsplash.com/..."]', 'https://example.com/direct.jpg');
    const previewImg = page.locator('div[className*="relative aspect-square"] img');
    await expect(previewImg).toHaveAttribute('src', /direct\.jpg/);

    // Test Upload Fallback Error UI
    await page.route('**/storage.googleapis.com/**', route => route.abort('failed'));

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('div:has-text("Click to upload image")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('data'),
    });

    await page.click('button:has-text("Create Product")');
    await expect(page.locator('text=Image upload failed. Please use the fallback URL below.').first()).toBeVisible();

    // Verify loading state reset
    await expect(page.locator('button:has-text("Create Product")')).toBeEnabled();
  });
});
