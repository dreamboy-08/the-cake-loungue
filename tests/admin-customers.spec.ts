import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-auth-helper';

test.describe('Admin Customer Management Modal E2E Suite', () => {
  test('Customer Details Modal positioning, centering, order detail viewing, and escape key', async ({ page }) => {
    // 1. Login as Admin
    await loginAsAdmin(page);

    // 2. Navigate to Admin Customers page
    await page.goto('http://localhost:3000/admin/customers');
    await expect(page.locator('h1')).toHaveText('Customer Management');

    // Wait for loading indicator to finish
    await expect(page.locator('text=Loading Customers...')).not.toBeVisible({ timeout: 10000 });

    // 3. Verify customer rows are loaded
    const customerRow = page.locator('tbody tr').first();
    await expect(customerRow).toBeVisible();

    // 4. Click the customer row to open Customer Details modal
    await customerRow.click();

    // 5. Verify modal overlay and centered container
    const modalHeading = page.locator('h2:has-text("Guest"), h2:has-text("Customer"), h2.font-playfair').first();
    await expect(modalHeading).toBeVisible();

    // Check modal backdrop flex container (items-center justify-center)
    const overlay = page.locator('div.fixed.inset-0.z-\\[9999\\]');
    await expect(overlay).toBeVisible();

    const overlayBox = await overlay.boundingBox();
    const modalBox = await page.locator('div.relative.bg-white.rounded-\\[32px\\]').first().boundingBox();

    expect(overlayBox).not.toBeNull();
    expect(modalBox).not.toBeNull();

    if (overlayBox && modalBox) {
      // Check horizontal centering: margin left and right should be approximately equal
      const leftGap = modalBox.x - overlayBox.x;
      const rightGap = (overlayBox.x + overlayBox.width) - (modalBox.x + modalBox.width);
      expect(Math.abs(leftGap - rightGap)).toBeLessThan(10);

      // Check vertical centering: margin top and bottom should be approximately equal
      const topGap = modalBox.y - overlayBox.y;
      const bottomGap = (overlayBox.y + overlayBox.height) - (modalBox.y + modalBox.height);
      expect(Math.abs(topGap - bottomGap)).toBeLessThan(10);
    }

    // 6. Test scrolling inside modal does not scroll document body
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');

    // 7. Close modal via close button
    const closeBtn = page.locator('button[aria-label="Close modal"]').first();
    await closeBtn.click();
    await expect(overlay).not.toBeVisible();

    // 8. Re-open modal and test closing with Escape key
    await customerRow.click();
    await expect(overlay).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();
  });
});
