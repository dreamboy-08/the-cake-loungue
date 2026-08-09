import { test, expect } from '@playwright/test';

test.describe('Phase 3 — Announcement / Offer Marquee CMS Verification', () => {

  test('should support full announcement CRUD and date-scheduling operations', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to admin panel
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Announcement & Marquee")')).toBeVisible();

    // Wait for Next.js compilation and loading state to disappear
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 20000 });

    // ----------------------------------------------------
    // TEST 1: Create Announcement ("🎂 Test Offer — 20% OFF")
    // ----------------------------------------------------
    await page.click('button:has-text("Add Announcement")');
    await expect(page.locator('h2:has-text("New Announcement")')).toBeVisible();

    // Fill details
    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '🎂 Test Offer — 20% OFF');
    await page.fill('input[placeholder="e.g. 🎂, 🚚, 🎉"]', '🎂');
    await page.fill('input[placeholder="e.g. /collections/birthday-cakes or https://..."]', '/menu');
    await page.fill('input[placeholder="e.g. 1"]', '5');

    // Click Create
    await page.click('button:has-text("Create")');

    // Confirm creation success
    await expect(page.locator('text=Announcement created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("🎂 Test Offer — 20% OFF")').first()).toBeVisible();

    // Verify it appears on the actual storefront marquee
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#offer-banner')).toBeVisible();
    await expect(page.locator('#offer-banner').locator('text=🎂 Test Offer — 20% OFF').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 2: Edit announcement text to "🎂 Updated Test Offer — 25% OFF"
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 15000 });

    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🎂 Test Offer — 20% OFF")') }).first();
    await card.locator('button[title="Edit"]').click();

    await expect(page.locator('h2:has-text("Edit Announcement")')).toBeVisible();
    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '🎂 Updated Test Offer — 25% OFF');
    await page.click('button:has-text("Update")');

    await expect(page.locator('text=Announcement updated successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("🎂 Updated Test Offer — 25% OFF")').first()).toBeVisible();

    // Confirm storefront displays updated text
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#offer-banner').locator('text=🎂 Updated Test Offer — 25% OFF').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 3: Add link and click it (tested via checking href)
    // ----------------------------------------------------
    const linkElement = page.locator('#offer-banner').locator('a[href="/menu"]').first();
    await expect(linkElement).toBeVisible();

    // ----------------------------------------------------
    // TEST 4: Disable the announcement
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🎂 Updated Test Offer — 25% OFF")') }).first();

    // Toggle Live button to Hidden
    await updatedCard.locator('button:has-text("Live")').click();
    await expect(page.locator('text=Announcement is now Disabled')).toBeVisible();

    // Confirm it disappears from storefront marquee
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    if (await page.locator('#offer-banner').isVisible()) {
      await expect(page.locator('#offer-banner').locator('text=🎂 Updated Test Offer — 25% OFF')).not.toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 5: Create a future-dated announcement (should not appear)
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Add Announcement")');

    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '🚀 Future Offer');
    await page.fill('input[placeholder="e.g. 🎂, 🚚, 🎉"]', '🚀');

    // Set start date far in the future
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const pad = (num: number) => String(num).padStart(2, '0');
    const futureDateStr = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T12:00`;

    const dateInputs = page.locator('input[type="datetime-local"]');
    await dateInputs.nth(0).fill(futureDateStr);

    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Announcement created successfully')).toBeVisible();

    // Confirm it does NOT appear on storefront
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    if (await page.locator('#offer-banner').isVisible()) {
      await expect(page.locator('#offer-banner').locator('text=🚀 Future Offer')).not.toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 6: Create an expired announcement (should not appear)
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Add Announcement")');

    await page.fill('textarea[placeholder="e.g. 🎂 Flat 20% OFF on Birthday Cakes"]', '🥀 Expired Offer');
    await page.fill('input[placeholder="e.g. 🎂, 🚚, 🎉"]', '🥀');

    // Set end date far in the past
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const pastDateStr = `${pastDate.getFullYear()}-${pad(pastDate.getMonth() + 1)}-${pad(pastDate.getDate())}T12:00`;

    await page.locator('input[type="datetime-local"]').nth(1).fill(pastDateStr);

    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Announcement created successfully')).toBeVisible();

    // Confirm it does NOT appear on storefront
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    if (await page.locator('#offer-banner').isVisible()) {
      await expect(page.locator('#offer-banner').locator('text=🥀 Expired Offer')).not.toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 8: Delete test announcements
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/announcements?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading announcements...')).not.toBeVisible({ timeout: 15000 });

    // Delete "Updated Test Offer"
    const deleteCard1 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🎂 Updated Test Offer — 25% OFF")') }).first();
    await deleteCard1.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Announcement deleted successfully')).toBeVisible();

    // Delete "Future Offer"
    const deleteCard2 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🚀 Future Offer")') }).first();
    await deleteCard2.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Announcement deleted successfully')).toBeVisible();

    // Delete "Expired Offer"
    const deleteCard3 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("🥀 Expired Offer")') }).first();
    await deleteCard3.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Announcement deleted successfully')).toBeVisible();
  });
});
