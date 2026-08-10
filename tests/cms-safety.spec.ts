import { test, expect } from '@playwright/test';

test.describe('CMS Safety — Undo + Restore Defaults Verification', () => {

  test('should support Undo Last Change for Create, Edit, Toggle, and Delete mutations on Announcements', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Navigate to announcements admin
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Announcement & Marquee")')).toBeVisible();
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 45000 });

    // Ensure we start from a clean state (Restore Defaults)
    await page.locator('button:has-text("Restore Defaults")').first().click();
    await page.locator('button:has-text("Restore Defaults")').last().click(); // Click on confirm modal button
    await expect(page.locator('text=Default content restored successfully.')).toBeVisible();

    // The Undo button should be visible (as Restore Defaults itself can be undone!)
    await expect(page.locator('button:has-text("Undo Last Change")')).toBeVisible();

    // 2. Perform Create mutation
    await page.click('button:has-text("Add Announcement")');
    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '✨ Temp Offer for Safety Test');
    await page.fill('input[placeholder="e.g. 🎂, 🚚, 🎉"]', '✨');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Announcement created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("✨ Temp Offer for Safety Test")').first()).toBeVisible();

    // 3. Undo Create
    await page.click('button:has-text("Undo Last Change")');
    await expect(page.locator('text=Previous state restored successfully.')).toBeVisible();
    // Verify item is removed!
    await expect(page.locator('h3:has-text("✨ Temp Offer for Safety Test")')).not.toBeVisible();

    // 4. Create again so we can test Toggle and Delete undo
    await page.click('button:has-text("Add Announcement")');
    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '✨ Temp Offer for Safety Test');
    await page.fill('input[placeholder="e.g. 🎂, 🚚, 🎉"]', '✨');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Announcement created successfully')).toBeVisible();

    // Toggle status (from Live to Hidden/Disabled)
    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("✨ Temp Offer for Safety Test")') }).first();
    await card.locator('button:has-text("Live")').click();
    await expect(page.locator('text=Announcement is now Disabled')).toBeVisible();

    // Undo Toggle
    await page.click('button:has-text("Undo Last Change")');
    await expect(page.locator('text=Previous state restored successfully.')).toBeVisible();
    // Should be Live again
    await expect(card.locator('button:has-text("Live")')).toBeVisible();

    // 5. Delete and Undo Delete
    await card.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Announcement deleted successfully.')).toBeVisible();
    await expect(page.locator('h3:has-text("✨ Temp Offer for Safety Test")')).not.toBeVisible();

    // Undo Delete
    await page.click('button:has-text("Undo Last Change")');
    await expect(page.locator('text=Previous state restored successfully.')).toBeVisible();
    // Item should return!
    await expect(page.locator('h3:has-text("✨ Temp Offer for Safety Test")').first()).toBeVisible();

    // Cleanup: Delete the temporary announcement
    const finalCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("✨ Temp Offer for Safety Test")') }).first();
    await finalCard.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Announcement deleted successfully.')).toBeVisible();
  });

  test('should support Restore Defaults with confirmation and Undo on Navigation links', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Navigate to Navigation Link Management
    await page.goto('http://localhost:3000/admin/navigation?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Navigation Management")')).toBeVisible();
    await expect(page.locator('text=Loading navigation links...')).not.toBeVisible({ timeout: 45000 });

    // 2. Perform a mutation (Create temporary nav link)
    await page.click('button:has-text("Add Navigation Link")');
    await page.fill('input[placeholder="e.g. Bestsellers, Wedding Cakes"]', '🎁 Temp Link');
    await page.fill('input[placeholder="e.g. /menu?category=wedding-cakes"]', '/temp-page');
    await page.click('button:has-text("Create Link")');
    await expect(page.locator('text=Navigation link created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("🎁 Temp Link")').first()).toBeVisible();

    // 3. Click Restore Defaults -> Verify Confirmation modal is displayed
    await page.locator('button:has-text("Restore Defaults")').first().click();
    await expect(page.locator('h3:has-text("Restore Default Content?")')).toBeVisible();
    await expect(page.locator('text=This will replace the current content in this section')).toBeVisible();

    // Cancel and confirm no change occurred
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('h3:has-text("🎁 Temp Link")').first()).toBeVisible();

    // Confirm Restore Defaults
    await page.locator('button:has-text("Restore Defaults")').first().click();
    await page.locator('button:has-text("Restore Defaults")').last().click(); // click on Confirm button in modal
    await expect(page.locator('text=Default content restored successfully.')).toBeVisible();

    // The temporary link should be replaced by defaults
    await expect(page.locator('h3:has-text("🎁 Temp Link")')).not.toBeVisible();

    // Undo Restore Defaults -> temporary link should return!
    await page.click('button:has-text("Undo Last Change")');
    await expect(page.locator('text=Previous state restored successfully.')).toBeVisible();
    await expect(page.locator('h3:has-text("🎁 Temp Link")').first()).toBeVisible();

    // Cleanup: Delete the temporary link
    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🎁 Temp Link")') }).first();
    await card.locator('button[title="Delete Link"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Navigation link deleted successfully.')).toBeVisible();
  });
});
