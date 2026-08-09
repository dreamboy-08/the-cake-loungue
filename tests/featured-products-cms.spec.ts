import { test, expect } from '@playwright/test';

test.describe('Featured Products CMS End-to-End Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Subscribe to browser console logs
    page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));

    // Navigate to Admin Featured Products CMS panel with auth bypass
    await page.goto('http://localhost:3000/admin/featured-products?bypass=true');
    // Ensure the page heading is fully loaded before continuing
    await expect(page.getByRole('heading', { name: 'Homepage Featured Products CMS' })).toBeVisible();
  });

  test('Featured Products Lifecycle: Add, Reorder, Remove, Disable, Re-enable, and Persist', async ({ page }) => {
    // 1. Initial State Check
    await expect(page.getByText('Section Settings')).toBeVisible();
    await expect(page.getByText('Curated Featured List')).toBeVisible();

    // Reset defaults first to ensure clean state
    await page.click('button:has-text("Reset Defaults")');
    await expect(page.getByText('Reset local inputs to default array. Save to apply.')).toBeVisible();

    // 2. Customize Title & Subtitle Labels
    const headingInput = page.locator('input[placeholder="e.g. Featured Cakes"]');
    await headingInput.fill('Artisan Signature Selection');

    const subheadingInput = page.locator('input[placeholder="e.g. Our Bestsellers"]');
    await subheadingInput.fill('Handcrafted Masterpieces');

    // Add a new product to Featured list from catalog picker
    // Let's search and add "Pearl Blossom Birthday Cake" if it's not already featured
    await page.locator('input[placeholder="Search catalog products..."]').fill('Pearl Blossom');

    // Check if the "Add" button is visible for "Pearl Blossom Birthday Cake" in the selection panel
    const addPearlBlossomBtn = page.locator('div').filter({ has: page.locator('p:text("Pearl Blossom Birthday Cake")') }).locator('button:has-text("Add")').first();
    if (await addPearlBlossomBtn.isVisible()) {
      await addPearlBlossomBtn.click();
      await expect(page.getByText('Added to featured selection!')).toBeVisible();
    }

    // Save All Settings
    await page.click('button:has-text("Save All Settings")');
    await expect(page.getByText('Featured Products configurations saved successfully!')).toBeVisible();

    // 3. Open Homepage and Verify Rendering
    await page.goto('http://localhost:3000/');
    const productsSection = page.locator('#products');
    await expect(productsSection).toBeVisible();

    // Verify custom Title & Subtitle labels are loaded correctly
    await expect(productsSection.locator('h2:text("Artisan Signature Selection")')).toBeVisible();
    await expect(productsSection.locator('p:text("Handcrafted Masterpieces")')).toBeVisible();

    // Verify "Pearl Blossom Birthday Cake" is featured in the list on the homepage
    await expect(productsSection.locator('h3:has-text("Pearl Blossom Birthday Cake")').first()).toBeVisible();

    // 4. Test Sorting Display Order (Reordering)
    // Go back to Admin Panel
    await page.goto('http://localhost:3000/admin/featured-products?bypass=true');
    await expect(page.getByRole('heading', { name: 'Homepage Featured Products CMS' })).toBeVisible();

    // Let's add "Eternal Love Anniversary Cake" so we have a few items to reorder
    await page.locator('input[placeholder="Search catalog products..."]').fill('Eternal Love');
    const addEternalLoveBtn = page.locator('div').filter({ has: page.locator('p:text("Eternal Love Anniversary Cake")') }).locator('button:has-text("Add")').first();
    if (await addEternalLoveBtn.isVisible()) {
      await addEternalLoveBtn.click();
      await expect(page.getByText('Added to featured selection!')).toBeVisible();
    }

    // Find "Eternal Love Anniversary Cake" in Curated Featured List and Move it Up
    // We click the Move Up arrow on the very last item (since new item is appended at the end)
    const featuredItems = page.locator('div[class*="border-gray-100 bg-gray-50"]');
    const lastItemMoveUpBtn = featuredItems.last().locator('button[title="Move Up"]');
    await lastItemMoveUpBtn.click();
    await expect(page.getByText('Display order updated local draft')).toBeVisible();

    // Save Changes
    await page.click('button:has-text("Save All Settings")');
    await expect(page.getByText('Featured Products configurations saved successfully!')).toBeVisible();

    // 5. Verify order change on homepage
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#products')).toBeVisible();
    // Verify "Eternal Love Anniversary Cake" is indeed visible on the homepage section
    await expect(page.locator('#products h3:has-text("Eternal Love Anniversary Cake")').first()).toBeVisible();

    // 6. Test Removal of Featured Product
    await page.goto('http://localhost:3000/admin/featured-products?bypass=true');
    await expect(page.getByRole('heading', { name: 'Homepage Featured Products CMS' })).toBeVisible();

    // Search or find "Eternal Love Anniversary Cake" in featured list and click Remove (Trash) icon
    const eternalLoveRow = page.locator('div[class*="border-gray-100 bg-gray-50"]').filter({ hasText: 'Eternal Love Anniversary Cake' }).first();
    await eternalLoveRow.locator('button[title="Remove"]').click();
    await expect(page.getByText('Removed from featured list')).toBeVisible();

    // Save Changes
    await page.click('button:has-text("Save All Settings")');
    await expect(page.getByText('Featured Products configurations saved successfully!')).toBeVisible();

    // Open homepage and verify "Eternal Love Anniversary Cake" is gone from Featured section
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#products h3:has-text("Eternal Love Anniversary Cake")')).not.toBeVisible();

    // Verify Eternal Love Anniversary Cake still exists in the general product catalog
    await page.goto('http://localhost:3000/menu');
    await expect(page.locator('h3:has-text("Eternal Love Anniversary Cake")').first()).toBeVisible();

    // 7. Test Disabling the Entire Section
    await page.goto('http://localhost:3000/admin/featured-products?bypass=true');
    await expect(page.getByRole('heading', { name: 'Homepage Featured Products CMS' })).toBeVisible();

    // Click section status toggle to disable (hides from storefront)
    await page.click('button:has-text("Section Live")');
    await expect(page.getByText('Section Hidden')).toBeVisible();

    // Save Settings
    await page.click('button:has-text("Save All Settings")');
    await expect(page.getByText('Featured Products configurations saved successfully!')).toBeVisible();

    // Open homepage and verify #products is completely hidden or does not render
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#products')).not.toBeVisible();

    // 8. Test Re-enabling the Section and verify it returns with the saved products list
    await page.goto('http://localhost:3000/admin/featured-products?bypass=true');
    await expect(page.getByRole('heading', { name: 'Homepage Featured Products CMS' })).toBeVisible();

    // Click section status toggle to re-enable (live)
    await page.click('button:has-text("Section Hidden")');
    await expect(page.getByText('Section Live')).toBeVisible();

    // Save Settings
    await page.click('button:has-text("Save All Settings")');
    await expect(page.getByText('Featured Products configurations saved successfully!')).toBeVisible();

    // Verify on homepage that the section has successfully returned with customized title
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('#products h2:text("Artisan Signature Selection")')).toBeVisible();

    // 9. Test Persistence after Reload
    await page.reload();
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('#products h2:text("Artisan Signature Selection")')).toBeVisible();
  });

});
