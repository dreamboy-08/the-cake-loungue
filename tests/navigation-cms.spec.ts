import { test, expect } from '@playwright/test';

test.describe('Phase 1 — Navigation CMS E2E Verification Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Print browser console logs to debug if needed
    page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));
  });

  test('Perform Step 4 Manual Verification Flow successfully', async ({ page }) => {
    // Set viewport to desktop size to ensure "hidden md:block" elements are visible
    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Open storefront homepage first and confirm default nav items exist
    await page.goto('http://localhost:3000/?bypass=true');
    await expect(page.getByRole('link', { name: 'Cakes', exact: true })).toBeVisible();

    // 2. Open Admin Panel Navigation CMS
    await page.goto('http://localhost:3000/admin/website-content?bypass=true');
    await expect(page.locator('h2:has-text("Header Navigation Links")')).toBeVisible();

    // 3. Add Navigation Item
    await page.click('button:has-text("Add Navigation Link")');
    const newLinkInput = page.locator('input[value="New Link"]').first();
    await expect(newLinkInput).toBeVisible();

    // Change Label to 'Test Navigation'
    await newLinkInput.fill('Test Navigation');

    // Change URL to '/'
    const linkRow = page.locator('div[class*="p-5"]').filter({ has: page.locator('input[value="Test Navigation"]') }).first();
    const urlInput = linkRow.locator('input[type="text"]').nth(1); // Label is text input 0, URL is text input 1
    await urlInput.fill('/');

    // Save the navigation
    await page.click('button:has-text("Save Navigation Setup")');
    await expect(page.locator('text=Navigation changes saved successfully!')).toBeVisible();

    // 4. Open/refresh the actual storefront
    await page.goto('http://localhost:3000/?bypass=true');
    // Confirm 'Test Navigation' appears in the main Navbar
    await expect(page.getByRole('link', { name: 'Test Navigation', exact: true })).toBeVisible();

    // 5. Open Admin Panel and edit 'Test Navigation'
    await page.goto('http://localhost:3000/admin/website-content?bypass=true');
    const editInput = page.locator('input[value="Test Navigation"]').first();
    await editInput.fill('Test Navigation Updated');

    // Save changes
    await page.click('button:has-text("Save Navigation Setup")');
    await expect(page.locator('text=Navigation changes saved successfully!')).toBeVisible();

    // 6. Refresh storefront
    await page.goto('http://localhost:3000/?bypass=true');
    // Confirm the updated value appears
    await expect(page.getByRole('link', { name: 'Test Navigation Updated', exact: true })).toBeVisible();

    // 7. Open Admin Panel and disable the item
    await page.goto('http://localhost:3000/admin/website-content?bypass=true');
    const updatedRow = page.locator('div[class*="p-5"]').filter({ has: page.locator('input[value="Test Navigation Updated"]') }).first();

    // Click 'Active' toggle to make it 'Disabled'
    await updatedRow.locator('button:has-text("Active")').click();
    await expect(updatedRow.locator('button:has-text("Disabled")')).toBeVisible();

    // Save changes
    await page.click('button:has-text("Save Navigation Setup")');
    await expect(page.locator('text=Navigation changes saved successfully!')).toBeVisible();

    // 8. Refresh storefront
    await page.goto('http://localhost:3000/?bypass=true');
    // Confirm it is no longer visible
    await expect(page.getByRole('link', { name: 'Test Navigation Updated', exact: true })).not.toBeVisible();

    // 9. Open Admin Panel and delete 'Test Navigation Updated'
    await page.goto('http://localhost:3000/admin/website-content?bypass=true');
    const deleteRow = page.locator('div[class*="p-5"]').filter({ has: page.locator('input[value="Test Navigation Updated"]') }).first();

    // Click delete trash icon button (last button in row)
    await deleteRow.locator('button').last().click();
    await expect(page.locator('input[value="Test Navigation Updated"]')).not.toBeVisible();

    // Save changes
    await page.click('button:has-text("Save Navigation Setup")');
    await expect(page.locator('text=Navigation changes saved successfully!')).toBeVisible();

    // 10. Refresh storefront
    await page.goto('http://localhost:3000/?bypass=true');
    // Confirm it is completely removed
    await expect(page.getByRole('link', { name: 'Test Navigation Updated', exact: true })).not.toBeVisible();
  });

});
