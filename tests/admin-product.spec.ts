import { test, expect } from '@playwright/test';

/**
 * Admin Product CRUD & Sync Verification
 *
 * Note: These tests use mocked Firestore and Storage responses to verify the application's
 * internal logic, routing, and UI synchronization without requiring live Firebase credentials.
 */

test.describe('Admin Product Management & Sync', () => {

  test.beforeEach(async ({ page }) => {
    // Mock Firestore for Categories
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

    // Navigate to Admin Products with bypass
    await page.goto('http://localhost:3001/admin/products?bypass=true');
  });

  test('CRUD Flow: Create, Read, Update, Delete', async ({ page }) => {
    // 1. CREATE
    await page.waitForSelector('button:has-text("Add New Product")');
    await page.click('button:has-text("Add New Product")');

    await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Verification Cake');
    await page.fill('input[placeholder="499"]', '999');
    await page.selectOption('select', 'Birthday Cakes');

    // Handle File Upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('span:has-text("Add Image")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-cake.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    });

    // Mock successful Storage upload
    await page.route('**/storage.googleapis.com/**', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ name: 'products/fake-img.jpg', downloadTokens: 'abc' })
        });
      } else if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ downloadTokens: 'abc' })
        });
      }
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
                price: { doubleValue: 999 },
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
    await expect(page.locator('text=₹999')).toBeVisible();

    // 2. UPDATE
    await page.click('button[title="Edit Product"]');
    await page.fill('input[value="Verification Cake"]', 'Updated Verification Cake');
    await page.fill('input[value="999"]', '1299');

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
                price: { doubleValue: 1299 },
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
});
