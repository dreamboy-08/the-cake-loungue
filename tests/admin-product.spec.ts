import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from './test-auth-helper';

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

    // Ensure logged in as admin
    await loginAsAdmin(page);

    // Navigate to Admin Products
    await page.goto('http://localhost:3000/admin/products');
    await expect(page.getByRole('button', { name: 'More Actions' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add New Product' })).toBeVisible();
  });

  test('CRUD Flow: Create, Read, Update, Delete', async ({ page }) => {
    // 1. CREATE
    await page.click('button:has-text("Add New Product")');
    await page.locator('label:has-text("Product Name") + input').fill('Verification Cake');

    // Fill the variant price (which auto-synchronizes and updates the base price)
    await page.locator('input[placeholder="Price"]').first().fill('499');
    await page.locator('label:has-text("Discount Price") + input').fill('399');

    // For Category, wait for loading to finish and select option
    await page.waitForSelector('select:not([disabled])');
    await page.locator('label:has-text("Category") + select').selectOption({ label: 'Birthday Cakes' });

    await page.locator('label:has-text("Flavor") + input').fill('Vanilla');
    await page.getByRole('button', { name: 'Add Flavour' }).click();
    await page.getByRole('textbox', { name: 'Flavour 1' }).fill('Chocolate Truffle');
    await page.getByRole('button', { name: 'Add Flavour' }).click();
    await page.getByRole('textbox', { name: 'Flavour 2' }).fill('Black Forest');
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
    let createdFields: Record<string, any> | undefined;
    await page.route('**/firestore.googleapis.com/**/products', async route => {
      if (route.request().method() === 'POST') {
        createdFields = route.request().postDataJSON().fields;
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
                flavor: { stringValue: 'Vanilla' },
                discountPrice: { integerValue: '399' },
                flavors: { arrayValue: { values: [{ stringValue: 'Chocolate Truffle' }, { stringValue: 'Black Forest' }] } }
              },
              createTime: new Date().toISOString(),
              updateTime: new Date().toISOString()
            }]
          })
        });
      }
    });

    await page.click('button:has-text("Create Product")');

    const storedCreatedProduct = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('cakeLounge_cms_products') || '[]');
      return saved.find((item: any) => item.name === 'Verification Cake');
    });
    expect(Number(createdFields?.discountPrice?.integerValue || storedCreatedProduct?.discountPrice)).toBe(399);
    expect(
      createdFields?.flavors?.arrayValue?.values?.map((value: any) => value.stringValue) ||
      storedCreatedProduct?.flavors
    ).toEqual(['Chocolate Truffle', 'Black Forest']);

    // Verify visibility in list
    await expect(page.locator('tbody tr').filter({ hasText: 'Verification Cake' })).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: 'Verification Cake' }).locator('text=₹499')).toBeVisible();

    // 2. UPDATE
    const row = page.locator('tbody tr').filter({ hasText: 'Verification Cake' });
    await row.locator('button').first().click(); // Click Edit button in the row
    await page.locator('label:has-text("Product Name") + input').fill('Updated Verification Cake');
    await page.locator('input[placeholder="Price"]').first().fill('1299');
    await page.getByRole('textbox', { name: 'Flavour 1' }).fill('Vanilla');
    await page.getByRole('button', { name: 'Remove flavour 2' }).click();

    // Mock successful update
    let updatedFields: Record<string, any> | undefined;
    await page.route('**/firestore.googleapis.com/**/products/new-id-123', async route => {
      if (route.request().method() === 'PATCH') {
        updatedFields = route.request().postDataJSON().fields;
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
                img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
                flavors: { arrayValue: { values: [{ stringValue: 'Vanilla' }] } }
              }
            }]
          })
        });
      }
    });

    await page.click('button:has-text("Update Product")');
    const storedUpdatedProduct = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('cakeLounge_cms_products') || '[]');
      return saved.find((item: any) => item.name === 'Updated Verification Cake');
    });
    expect(
      updatedFields?.flavors?.arrayValue?.values?.map((value: any) => value.stringValue) ||
      storedUpdatedProduct?.flavors
    ).toEqual(['Vanilla']);
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
      name: 'projects/p/databases/d/documents/products/1',
      fields: {
        name: { stringValue: 'Royal Raspberry Birthday Cake' },
        price: { integerValue: '750' },
        category: { stringValue: 'Birthday Cakes' },
        img: { stringValue: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
        description: { stringValue: 'Royal Raspberry Birthday Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration.' },
        flavor: { stringValue: 'Chocolate' },
        discountPrice: { integerValue: '0' }
      }
    };

    await page.route('**/firestore.googleapis.com/**/products*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ documents: [mockProduct] })
      });
    });
    await page.evaluate(() => {
      const products = [{
        id: 1,
        name: 'Royal Raspberry Birthday Cake',
        price: 750,
        discountPrice: 0,
        oldPrice: 0,
        category: 'Birthday Cakes',
        img: '/images/products/Royal Raspberry Birthday Cake.jpg',
        description: 'Royal Raspberry Birthday Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration.',
        flavor: 'Chocolate',
        flavors: [],
        rating: 5,
        reviews: 0,
        tag: '',
      }];
      localStorage.setItem('cakeLounge_cms_products', JSON.stringify(products));
      window.dispatchEvent(new Event('admin_products_updated'));
    });

    // 2. Check Customer Menu
    await page.goto('http://localhost:3000/menu');
    await page.waitForTimeout(2500); // Allow complete hydration
    await expect(page.locator('h3:has-text("Royal Raspberry Birthday Cake")').first()).toBeVisible();

    // 3. Check Product Detail Page
    await page.goto('http://localhost:3000/shop/1', { waitUntil: 'domcontentloaded' });
    await expect(page.url()).toContain('/shop/1');
    await expect(page.locator('h1')).toContainText('Royal Raspberry Birthday Cake');
    await expect(page.locator('text=Royal Raspberry Birthday Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration.')).toBeVisible();
    await expect(page.locator('#product-flavor')).toHaveCount(0);
    await expect(page.locator('text=0% OFF')).toHaveCount(0);
    await expect(page.locator('text=₹0')).toHaveCount(0);
  });

  test('Configured flavours and discounts persist through cart and checkout', async ({ page }) => {
    await page.evaluate(() => {
      const products = [{
        id: 'discounted-cake',
        name: 'Flavoured Discount Cake',
        price: 1000,
        discountPrice: 800,
        category: 'Birthday Cakes',
        img: '/images/products/Royal Raspberry Birthday Cake.jpg',
        description: 'A cake with selectable flavours.',
        flavor: 'Classic',
        flavors: ['Chocolate Truffle', 'Black Forest'],
        weights: [{ label: '0.5 Kg', price: 1000 }, { label: '1 Kg', price: 2000 }],
        oldPrice: 0,
        rating: 5,
        reviews: 0,
        tag: '',
      }];
      localStorage.setItem('cakeLounge_cms_products', JSON.stringify(products));
      window.dispatchEvent(new Event('admin_products_updated'));
    });

    await page.goto('http://localhost:3000/menu');
    const discountProductCard = page.locator('a[href="/shop/discounted-cake"]');
    await expect(discountProductCard.getByText('₹800', { exact: true })).toBeVisible();
    await expect(discountProductCard.getByText('₹1000', { exact: true })).toBeVisible();
    await expect(discountProductCard.getByText('20% OFF')).toBeVisible();
    await discountProductCard.getByRole('button', { name: 'Choose' }).click();
    await expect(page).toHaveURL(/\/shop\/discounted-cake/);
    await expect(page.locator('h1')).toHaveText('Flavoured Discount Cake');
    await expect(page.locator('text=₹800')).toBeVisible();
    await expect(page.locator('text=₹1000')).toBeVisible();
    await expect(page.locator('text=20% OFF')).toBeVisible();

    await page.getByRole('button', { name: '1 Kg' }).click();
    await expect(page.getByText('₹1600', { exact: true }).first()).toBeVisible();
    await expect(page.locator('text=₹2000')).toBeVisible();
    await page.locator('#product-flavor').selectOption('Black Forest');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', { name: 'View Cart' }).click();
    await expect(page.locator('#cart-drawer-overlay p').filter({ hasText: 'Black Forest' })).toBeVisible();
    await expect(page.locator('#cart-drawer-overlay').getByText('₹1600', { exact: true }).first()).toBeVisible();

    await page.goto('http://localhost:3000/checkout');
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
    await expect(page.getByText('Black Forest', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('₹1600', { exact: true }).first()).toBeVisible();

    await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('cakeLounge_cms_products') || '[]');
      saved[0].flavors = ['Vanilla'];
      localStorage.setItem('cakeLounge_cms_products', JSON.stringify(saved));
      window.dispatchEvent(new Event('admin_products_updated'));
    });
    await page.goto('http://localhost:3000/shop/discounted-cake');
    await expect(page.locator('#product-flavor')).toHaveCount(0);
    await expect(page.getByRole('main').getByText('Vanilla', { exact: true })).toBeVisible();
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
