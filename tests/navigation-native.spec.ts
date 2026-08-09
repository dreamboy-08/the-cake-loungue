import { test, expect } from '@playwright/test';

test.describe('Native Navigation CMS CRUD Page Flow', () => {

  test('should perform full CRUD on native Navigation admin section and verify on storefront', async ({ page }) => {
    // 1. Navigate to Native Admin Navigation page
    await page.goto('http://localhost:3000/admin/navigation?bypass=true');

    // Confirm heading is present
    await expect(page.locator('h1:has-text("Navigation Management")')).toBeVisible();

    // 2. Add 'Test Navigation'
    await page.click('button:has-text("Add Navigation Link")');
    await expect(page.locator('h2:has-text("New Navigation Link")')).toBeVisible();

    // Fill form
    await page.fill('input[placeholder="e.g. Bestsellers, Wedding Cakes"]', 'Test Navigation');
    await page.fill('input[placeholder="e.g. /menu?category=wedding-cakes"]', '/test');
    await page.selectOption('select', 'custom');
    await page.click('button:has-text("Create Link")');

    // Toast feedback check
    await expect(page.locator('text=Navigation link created successfully')).toBeVisible();

    // Check card is visible on Admin grid
    await expect(page.locator('h3:has-text("Test Navigation")')).toBeVisible();

    // 3. Confirm it appears on the real storefront Navbar
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Test Navigation').first()).toBeVisible();

    // 4. Edit it to 'Test Navigation Edit'
    await page.goto('http://localhost:3000/admin/navigation?bypass=true');
    const card = page.locator('div[class*="bg-white"]').filter({ hasText: 'Test Navigation' }).first();
    await card.locator('button[title="Edit Link"]').click();
    await page.fill('input[placeholder="e.g. Bestsellers, Wedding Cakes"]', 'Test Navigation Edit');
    await page.click('button:has-text("Update Link")');

    // Confirm updated in grid
    await expect(page.locator('h3:has-text("Test Navigation Edit")')).toBeVisible();

    // 5. Confirm storefront updates
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Test Navigation Edit').first()).toBeVisible();

    // 6. Disable it
    await page.goto('http://localhost:3000/admin/navigation?bypass=true');
    const editCard = page.locator('div[class*="bg-white"]').filter({ hasText: 'Test Navigation Edit' }).first();
    await editCard.locator('button:has-text("Live")').click(); // Toggle status from Live to Hidden
    await expect(page.locator('text=Navigation is now Disabled')).toBeVisible();

    // 7. Confirm it disappears from storefront
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Test Navigation Edit')).not.toBeVisible();

    // 8. Re-enable it
    await page.goto('http://localhost:3000/admin/navigation?bypass=true');
    const hiddenCard = page.locator('div[class*="bg-white"]').filter({ hasText: 'Test Navigation Edit' }).first();
    await hiddenCard.locator('button:has-text("Hidden")').click(); // Toggle status back to Live
    await expect(page.locator('text=Navigation is now Active')).toBeVisible();

    // 9. Change display order
    const enableCard = page.locator('div[class*="bg-white"]').filter({ hasText: 'Test Navigation Edit' }).first();
    await enableCard.locator('button[title="Edit Link"]').click();
    await page.fill('input[type="number"]', '1'); // Move to top position #1
    await page.click('button:has-text("Update Link")');
    await expect(page.locator('text=Navigation link updated successfully')).toBeVisible();

    // Confirm it displays first
    await expect(page.locator('h3:has-text("Test Navigation Edit")').locator('xpath=../span')).toHaveText('#1');

    // 10. Delete it
    const deleteCard = page.locator('div[class*="bg-white"]').filter({ hasText: 'Test Navigation Edit' }).first();
    await deleteCard.locator('button[title="Delete Link"]').click();
    await expect(page.locator('h3:has-text("Delete Navigation Link?")')).toBeVisible();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Navigation link deleted successfully')).toBeVisible();

    // 11. Confirm it disappears from storefront
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Test Navigation Edit')).not.toBeVisible();
  });

});
