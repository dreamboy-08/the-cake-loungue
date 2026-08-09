import { test, expect } from '@playwright/test';

test.describe('Mega Menu CMS Management Verification Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the newly created Mega Menu admin panel with bypass
    await page.goto('http://localhost:3000/admin/megamenu?bypass=true');
  });

  test('should display existing mega menu sections', async ({ page }) => {
    await expect(page.locator('h1:has-text("Mega Menu Management")')).toBeVisible();

    // Verify default sections are rendered as card headings (using .first() to handle any duplicate names)
    await expect(page.locator('h3:has-text("Category")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Designer")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Flavours")').first()).toBeVisible();
  });

  test('should support full CRUD cycle for Mega Menu Column and items', async ({ page }) => {
    // 1. ADD NEW SECTION WITH ONE ITEM
    await page.click('button:has-text("Add Mega Menu Section")');
    await expect(page.locator('h2:has-text("New Mega Menu Column")')).toBeVisible();

    // Fill Column title
    await page.locator('input[placeholder="e.g. Categories, Flavours, Occasions"]').fill('Temporary Column');

    // Add nested item
    await page.click('button:has-text("Add Link")');
    await page.locator('input[placeholder="Link Label (e.g. Birthday Cakes)"]').first().fill('Temp Link');
    await page.locator('input[placeholder="URL (e.g. /menu?category=birthday-cakes)"]').first().fill('/temp-path');

    // Create Column
    await page.click('button:has-text("Create Column")');

    // Toast notification check
    await expect(page.locator('text=Mega Menu column created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Temporary Column")').first()).toBeVisible();

    // 2. EDIT COLUMN
    const colCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Temporary Column")') }).first();
    await colCard.locator('button[title="Edit Section"]').click();
    await expect(page.locator('h2:has-text("Edit Mega Menu Column")')).toBeVisible();

    // Edit Title
    await page.locator('input[placeholder="e.g. Categories, Flavours, Occasions"]').fill('Temporary Column Updated');

    // Save Edit
    await page.click('button:has-text("Update Column")');
    await expect(page.locator('text=Mega Menu column updated successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Temporary Column Updated")').first()).toBeVisible();

    // 3. DELETE COLUMN
    const updatedCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Temporary Column Updated")') }).first();
    await updatedCard.locator('button[title="Delete Section"]').click();

    // Verify confirmation modal
    await expect(page.locator('h3:has-text("Delete Mega Menu Column?")')).toBeVisible();
    await page.click('button:has-text("Confirm Delete")');

    // Verify removed
    await expect(page.locator('text=Mega Menu column deleted successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Temporary Column Updated")')).not.toBeVisible();
  });
});
