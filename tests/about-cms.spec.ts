import { test, expect } from '@playwright/test';

test.describe('Phase 7 — Homepage About Us / Our Story CMS E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Log browser messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  });

  test('Complete Admin -> Storefront E2E Workflow', async ({ page }) => {
    // 1. Go to the Admin Our Story page with auth bypass
    await page.goto('/admin/our-story?bypass=true');

    // 2. Verify the Our Story CMS management UI is visible
    await expect(page.locator('h1:has-text("About Us & Our Story CMS")')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Supports line breaks using Enter"]')).toBeVisible();

    // 3. Change About Heading
    const headingTextarea = page.locator('textarea[placeholder="Supports line breaks using Enter"]');
    await headingTextarea.fill('TEST ABOUT HEADING');

    // 4. Change Description / Story content
    const storyTextarea = page.locator('textarea[placeholder="Enter rich paragraph content, or select text and click styling buttons above."]');
    await storyTextarea.fill('<p>This is a CMS test story content paragraph.</p>');

    // 5. Setup file chooser listener to upload a dummy / replacement image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label:has-text("Replace Image")').click();
    const fileChooser = await fileChooserPromise;

    // Create a simple 1x1 pixel PNG image buffer to upload
    const dummyImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    await fileChooser.setFiles([
      {
        name: 'test-about-image.png',
        mimeType: 'image/png',
        buffer: dummyImageBuffer,
      },
    ]);

    // 6. Verify Crop Illustration Image modal opens
    await expect(page.locator('h3:has-text("Crop Illustration Image")')).toBeVisible();

    // 7. Click Apply Crop & Save inside modal
    await page.locator('button:has-text("Apply Crop & Save")').click();

    // Wait for the modal to close
    await expect(page.locator('h3:has-text("Crop Illustration Image")')).not.toBeVisible();

    // 8. Save all settings
    await page.locator('button:has-text("Save All Settings")').click();

    // 9. Verify save succeeds (Toast appears)
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 10. Navigate to actual storefront / homepage
    await page.goto('/');

    // 11. Assert values reflect updated CMS state on the actual storefront
    await expect(page.locator('#about h2')).toContainText('TEST ABOUT HEADING');
    await expect(page.locator('#about .about-content')).toContainText('This is a CMS test story content paragraph.');

    // Since we uploaded a data URL in tests (due to missing Cloudinary configs in test environment), let's verify it contains the base64 string
    const aboutImage = page.locator('#about img[alt="Our Story Illustration"]');
    await expect(aboutImage).toHaveAttribute('src', /.*data:image\/jpeg;base64.*/);

    // 12. Disable About through the Admin UI
    await page.goto('/admin/our-story?bypass=true');
    await expect(page.locator('button:has-text("Section Enabled")')).toBeVisible();
    await page.locator('button:has-text("Section Enabled")').click();
    await expect(page.locator('button:has-text("Section Hidden")')).toBeVisible();

    await page.locator('button:has-text("Save All Settings")').click();
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 13. Navigate back to actual storefront and verify About section is hidden
    await page.goto('/');
    await expect(page.locator('#about')).not.toBeVisible();

    // 14. Re-enable About through Admin UI
    await page.goto('/admin/our-story?bypass=true');
    await expect(page.locator('button:has-text("Section Hidden")')).toBeVisible();
    await page.locator('button:has-text("Section Hidden")').click();
    await expect(page.locator('button:has-text("Section Enabled")')).toBeVisible();

    await page.locator('button:has-text("Save All Settings")').click();
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 15. Verify About returns to homepage and retains its configuration
    await page.goto('/');
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#about h2')).toContainText('TEST ABOUT HEADING');

    // 16. Refresh actual storefront / homepage to confirm persistence
    await page.reload();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#about h2')).toContainText('TEST ABOUT HEADING');
  });

  test('Responsive verification checks on mobile', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify main components are readable and present on mobile viewport
    await expect(page.locator('#about h2')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
  });
});
