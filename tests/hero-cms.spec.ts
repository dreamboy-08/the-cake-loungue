import { test, expect } from '@playwright/test';

test.describe('Phase 4 — Homepage Hero CMS E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Log browser messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  });

  test('Complete Admin -> Storefront E2E Workflow', async ({ page }) => {
    // 1. Go to the Admin Hero page with auth bypass
    await page.goto('/admin/hero?bypass=true');

    // 2. Verify the Hero CMS management UI is visible
    await expect(page.locator('h1:has-text("Homepage Hero CMS")')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Supports line breaks using Enter"]')).toBeVisible();

    // 3. Change Hero Heading
    const headingTextarea = page.locator('textarea[placeholder="Supports line breaks using Enter"]');
    await headingTextarea.fill('TEST HERO HEADING');

    // 4. Change Description
    const descTextarea = page.locator('textarea[placeholder="Introduce the patisserie..."]');
    await descTextarea.fill('This is a CMS test description.');

    // 5. Change CTA Button Text
    const buttonTextInput = page.locator('input[placeholder="e.g. Order Now"]');
    await buttonTextInput.fill('Explore Test Collection');

    // 6. Set CTA button Link
    const buttonLinkInput = page.locator('input[placeholder="e.g. /menu or https://..."]');
    await buttonLinkInput.fill('/menu');

    // 7. Change the first image URL slot
    const firstImageInput = page.locator('input[placeholder="Image URL"]').first();
    await firstImageInput.fill('https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=500&auto=format&fit=crop');

    // 8. Save the settings
    await page.locator('button:has-text("Save All Settings")').click();

    // 9. Verify that save succeeds (Toast appears)
    await expect(page.locator('text=Homepage Hero configurations saved successfully!')).toBeVisible();

    // 10. Navigate to actual storefront / homepage
    await page.goto('/');

    // 11. Assert values reflect updated CMS state on the actual storefront
    await expect(page.locator('#hero h1')).toContainText('TEST HERO HEADING');
    await expect(page.locator('#hero p')).toContainText('This is a CMS test description.');

    const orderBtn = page.locator('#hero a', { hasText: 'Explore Test Collection' });
    await expect(orderBtn).toHaveAttribute('href', '/menu');

    const heroImage = page.locator('#hero img[alt="Chocolate Cake Collage"]');
    await expect(heroImage).toHaveAttribute('src', /.*photo-1519915028121-7d3463d20b13.*/);

    // 12. Disable Hero through the Admin UI
    await page.goto('/admin/hero?bypass=true');
    await expect(page.locator('button:has-text("Section Live")')).toBeVisible();
    await page.locator('button:has-text("Section Live")').click();
    await expect(page.locator('button:has-text("Section Hidden")')).toBeVisible();

    await page.locator('button:has-text("Save All Settings")').click();
    await expect(page.locator('text=Homepage Hero configurations saved successfully!')).toBeVisible();

    // 13. Navigate back to actual storefront and verify Hero is hidden
    await page.goto('/');
    await expect(page.locator('#hero')).not.toBeVisible();

    // 14. Re-enable Hero through Admin UI
    await page.goto('/admin/hero?bypass=true');
    await expect(page.locator('button:has-text("Section Hidden")')).toBeVisible();
    await page.locator('button:has-text("Section Hidden")').click();
    await expect(page.locator('button:has-text("Section Live")')).toBeVisible();

    await page.locator('button:has-text("Save All Settings")').click();
    await expect(page.locator('text=Homepage Hero configurations saved successfully!')).toBeVisible();

    // 15. Verify Hero returns to homepage
    await page.goto('/');
    await expect(page.locator('#hero')).toBeVisible();

    // 16. Cleanup / Restore Default configurations
    await page.goto('/admin/hero?bypass=true');
    await page.locator('button:has-text("Restore Defaults")').first().click();
    await page.locator('button:has-text("Restore Defaults")').last().click(); // confirm dialog
    await expect(page.locator('text=Default content restored successfully.')).toBeVisible();

    // 17. Verify original heading returned to homepage
    await page.goto('/');
    await expect(page.locator('#hero h1')).toContainText('Exquisite Cakes');
  });

  test('Responsive verification checks on mobile', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify main components are readable and present on mobile viewport
    await expect(page.locator('#hero h1')).toBeVisible();
    await expect(page.locator('#hero p')).toBeVisible();

    // The CTA button should be visible and clickable
    const ctaButton = page.locator('#hero a.btn-primary').first();
    await expect(ctaButton).toBeVisible();
  });
});
