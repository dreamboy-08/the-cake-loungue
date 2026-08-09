import { test, expect } from '@playwright/test';

test.describe('Categories CMS Storefront & Admin E2E Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Direct browser console logs for debug trace
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  });

  test('Complete Category CMS Lifecycle: CRUD, Visibility, Reordering, Custom Links', async ({ page }) => {
    // 1. Open Admin Categories Page with auth bypass
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    await expect(page.locator('h1:has-text("Category Management")')).toBeVisible();

    // Verify some default categories exist
    await expect(page.locator('h3:has-text("Birthday Cakes")')).toBeVisible();
    await expect(page.locator('h3:has-text("Wedding Cakes")')).toBeVisible();

    // 2. Add a new category
    await page.click('button:has-text("Add New Category")');
    await expect(page.locator('h2:has-text("New Category")')).toBeVisible();

    // Fill form details
    await page.fill('label:has-text("Category Name") + input', 'Milestone Treat');
    await page.fill('label:has-text("Description") + textarea', 'Exquisite milestones');
    await page.fill('label:has-text("Link / Destination") + input', '/menu?category=milestone-treat');
    await page.fill('label:has-text("Category Tag") + input', 'Festive');
    await page.fill('label:has-text("Designs / Subtitle") + input', '12+ Designs');

    // Submit form
    await page.click('button[type="submit"]');

    // Confirm addition and toast notification
    await expect(page.locator('h3:has-text("Milestone Treat")')).toBeVisible();

    // 3. Open Homepage and verify changed category is visible
    await page.goto('http://localhost:3000/');
    await expect(page.locator('p:has-text("Browse By Category")')).toBeVisible();

    const newCategoryCard = page.locator('div[role="button"]').filter({ hasText: 'Milestone Treat' });
    await expect(newCategoryCard).toBeVisible();
    await expect(newCategoryCard.locator('div:has-text("Festive")').last()).toBeVisible();
    await expect(newCategoryCard.locator('p:has-text("12+ Designs")')).toBeVisible();

    // 4. Click the Category Card and verify the custom destination/link works
    await newCategoryCard.click();
    await expect(page).toHaveURL(/.*category=milestone-treat/);

    // 5. Open Admin Categories Page again to Edit
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    const milestoneCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3', { hasText: 'Milestone Treat' }) }).first();

    // Click the Edit button (2nd button on the card container)
    await milestoneCard.locator('button').nth(1).click();
    await expect(page.locator('h2:has-text("Edit Category")')).toBeVisible();

    // Modify details
    await page.fill('label:has-text("Category Name") + input', 'Milestone Deluxe');
    await page.fill('label:has-text("Category Tag") + input', 'Premium Elite');
    await page.click('button[type="submit"]');

    // Confirm updated name in admin list
    await expect(page.locator('h3:has-text("Milestone Deluxe")')).toBeVisible();

    // Open Homepage and verify edited content is visible
    await page.goto('http://localhost:3000/');
    const updatedCard = page.locator('div[role="button"]').filter({ hasText: 'Milestone Deluxe' });
    await expect(updatedCard).toBeVisible();
    await expect(updatedCard.locator('div:has-text("Premium Elite")').last()).toBeVisible();

    // 6. Reorder categories: Move "Milestone Deluxe" to position #1
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    const deluxeCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3', { hasText: 'Milestone Deluxe' }) }).first();
    await deluxeCard.locator('button').nth(1).click();
    await expect(page.locator('h2:has-text("Edit Category")')).toBeVisible();

    // Change Display Order to 1
    await page.fill('label:has-text("Display Order") + input', '1');
    await page.click('button[type="submit"]');

    // Check first position on homepage
    await page.goto('http://localhost:3000/');
    const firstCategory = page.locator('div[role="button"]').first();
    await expect(firstCategory).toContainText('Milestone Deluxe');

    // 7. Disable category
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    const deluxeCardToDisable = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3', { hasText: 'Milestone Deluxe' }) }).first();

    // Click Live toggle overlay button (first button)
    await deluxeCardToDisable.locator('button').first().click();

    // Verify homepage hides disabled category
    await page.goto('http://localhost:3000/');
    await expect(page.locator('div[role="button"]').filter({ hasText: 'Milestone Deluxe' })).not.toBeVisible();

    // 8. Re-enable category
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    const deluxeCardToEnable = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3', { hasText: 'Milestone Deluxe' }) }).first();
    await deluxeCardToEnable.locator('button').first().click();

    // Verify homepage shows it again
    await page.goto('http://localhost:3000/');
    await expect(page.locator('div[role="button"]').filter({ hasText: 'Milestone Deluxe' })).toBeVisible();

    // 9. Delete test category
    await page.goto('http://localhost:3000/admin/categories?bypass=true');
    const deluxeCardToDelete = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3', { hasText: 'Milestone Deluxe' }) }).first();

    // Click delete (3rd button)
    await deluxeCardToDelete.locator('button').nth(2).click();
    await expect(page.locator('h3:has-text("Delete Category?")')).toBeVisible();

    // Click confirm
    await page.click('button:has-text("Confirm Delete")');

    // Verify deleted in admin list
    await expect(page.locator('h3:has-text("Milestone Deluxe")')).not.toBeVisible();

    // Refresh and verify persistence
    await page.reload();
    await expect(page.locator('h3:has-text("Milestone Deluxe")')).not.toBeVisible();

    // Verify homepage doesn't show deleted category
    await page.goto('http://localhost:3000/');
    await expect(page.locator('div[role="button"]').filter({ hasText: 'Milestone Deluxe' })).not.toBeVisible();
  });

});
