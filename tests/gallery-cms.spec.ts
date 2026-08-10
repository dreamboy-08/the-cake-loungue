import { test, expect } from '@playwright/test';

test.describe('Gallery CMS Verification', () => {

  test('should support full gallery CRUD, enable/disable, and sorting operations', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to admin panel gallery route
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Gallery CMS")')).toBeVisible();

    // Wait for Next.js compilation and loading state to disappear
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 20000 });

    // ----------------------------------------------------
    // TEST 1: Add Gallery Item ("Test Gallery Image")
    // ----------------------------------------------------
    await page.click('button:has-text("Add Gallery Item")');
    await expect(page.locator('h2:has-text("New Gallery Item")')).toBeVisible();

    // Fill details
    await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Test Gallery Image');
    await page.fill('input[placeholder="e.g. /shop/1 or /menu?category=birthday-cakes"]', '/shop/1');
    // Display Order is pre-filled, let's keep it or change it if needed

    // Click Create
    await page.click('button:has-text("Create")');

    // Confirm creation success
    await expect(page.locator('text=Gallery item created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Test Gallery Image")').first()).toBeVisible();

    // Verify it appears on the actual storefront homepage gallery section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('#gallery').locator('text=Test Gallery Image').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 2: Edit Gallery Item details
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Test Gallery Image")') }).first();
    await card.locator('button[title="Edit"]').click();

    await expect(page.locator('h2:has-text("Edit Gallery Item")')).toBeVisible();
    await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Updated Test Gallery Image');
    await page.click('button:has-text("Update")');

    await expect(page.locator('text=Gallery item updated successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Updated Test Gallery Image")').first()).toBeVisible();

    // Confirm storefront displays updated details
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery').locator('text=Updated Test Gallery Image').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 3: Disable the gallery item
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Gallery Image")') }).first();

    // Toggle Live button to Hidden
    await updatedCard.locator('button:has-text("Live")').click();
    await expect(page.locator('text=Gallery item is now Disabled')).toBeVisible();

    // Confirm it disappears from storefront gallery section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    if (await page.locator('#gallery').isVisible()) {
      await expect(page.locator('#gallery').locator('text=Updated Test Gallery Image')).not.toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 4: Re-enable the gallery item
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    const disabledCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Gallery Image")') }).first();
    await disabledCard.locator('button:has-text("Hidden")').click();
    await expect(page.locator('text=Gallery item is now Active')).toBeVisible();

    // Confirm it returns to storefront gallery section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery').locator('text=Updated Test Gallery Image').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 5: Create a second gallery item and test Display Order
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Add Gallery Item")');
    await expect(page.locator('h2:has-text("New Gallery Item")')).toBeVisible();

    await page.fill('input[placeholder="e.g. Royal Raspberry Birthday Cake"]', 'Second Test Gallery Image');
    await page.fill('input[placeholder="e.g. /shop/1 or /menu?category=birthday-cakes"]', '/shop/2');
    await page.fill('input[type="number"]', '1'); // Set display order to 1 (first)
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Gallery item created successfully')).toBeVisible();

    // Go to storefront and check that Second Test Gallery Image comes before Updated Test Gallery Image
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery')).toBeVisible();

    // Collect visible gallery alt texts in slider
    const images = page.locator('#gallery').locator('img');
    const imageAlts = await images.evaluateAll(imgs => imgs.map(img => img.getAttribute('alt')));

    const secondIndex = imageAlts.indexOf('Second Test Gallery Image');
    const updatedIndex = imageAlts.indexOf('Updated Test Gallery Image');

    // Confirm both are present and secondIndex is less than updatedIndex
    expect(secondIndex).toBeGreaterThan(-1);
    expect(updatedIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeLessThan(updatedIndex);

    // ----------------------------------------------------
    // TEST 6: Delete temporary test gallery items
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/gallery?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading gallery...')).not.toBeVisible({ timeout: 15000 });

    // Delete "Updated Test Gallery Image"
    const deleteCard1 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Gallery Image")') }).first();
    await deleteCard1.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Gallery item deleted successfully')).toBeVisible();

    // Delete "Second Test Gallery Image"
    const deleteCard2 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Second Test Gallery Image")') }).first();
    await deleteCard2.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Gallery item deleted successfully')).toBeVisible();

    // Confirm storefront no longer has them
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gallery').locator('text=Updated Test Gallery Image')).not.toBeVisible();
    await expect(page.locator('#gallery').locator('text=Second Test Gallery Image')).not.toBeVisible();
  });
});
