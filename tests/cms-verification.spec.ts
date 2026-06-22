import { test, expect } from '@playwright/test';

test.describe('Website Content CMS Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Force Firebase to use long polling to avoid WebChannel issues with Playwright mocking
    await page.addInitScript(() => {
      (window as any).FORCE_FIREBASE_LONG_POLLING = true;
    });

    // Mock all Firestore calls to prevent actual network activity and hanging
    await page.route('**/firestore.googleapis.com/**', async route => {
      const url = route.request().url();
      const method = route.request().method();

      // Initial GET requests for content
      if (method === 'GET') {
        if (url.includes('homepageContent')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ fields: { hero: { mapValue: { fields: { title: { stringValue: 'Original Hero Title' }, subtitle: { stringValue: 'Original Subtitle' } } } } } })
          });
        }
        if (url.includes('siteSettings')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ fields: { announcementBar: { mapValue: { fields: { enabled: { booleanValue: true }, text: { stringValue: 'Original Promo' } } } } } })
          });
        }
        if (url.includes('contactInfo')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fields: { phone: { stringValue: '1234567890' } } }) });
        }
        if (url.includes('businessHours')) {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fields: { mon_fri: { stringValue: '9-5' } } }) });
        }
      }

      // Handle Writes (Updates)
      if (method === 'PATCH' || method === 'POST') {
        // Return success for commits/writes
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ writeResults: [{ updateTime: "2026-01-01T00:00:00Z" }] })
        });
      }

      // Abort streaming/channel to force fallback or just ignore
      if (url.includes('/Listen/') || url.includes('/Write/')) {
        return route.abort();
      }

      return route.continue();
    });

    await page.goto('http://localhost:3001/admin/website-content?bypass=true');
  });

  test('Update Homepage Hero Text', async ({ page }) => {
    // Log console for debugging
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    await page.waitForSelector('h1:has-text("Website Content")', { timeout: 30000 });

    await page.click('button:has-text("Homepage")');

    await page.fill('label:has-text("Main Title") + input', 'Verified New Hero Title');
    await page.fill('label:has-text("Subtitle / Description") + textarea', 'Verified New Subtitle');

    await page.click('button:has-text("Save Homepage Content")');

    // Verify toast with longer timeout
    await expect(page.locator('text=Homepage content saved successfully')).toBeVisible({ timeout: 15000 });

    // Verify change reflects on Homepage
    await page.route('**/firestore.googleapis.com/**/homepageContent*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fields: {
              hero: {
                mapValue: {
                  fields: {
                    title: { stringValue: 'Verified New Hero Title' },
                    subtitle: { stringValue: 'Verified New Subtitle' }
                  }
                }
              }
            }
          })
        });
      });

    await page.goto('http://localhost:3001/');
    await expect(page.locator('text=Verified New Hero Title')).toBeVisible();
    await expect(page.locator('text=Verified New Subtitle')).toBeVisible();

    await page.screenshot({ path: 'verification/02_homepage_updated.png', fullPage: true });
  });

  test('Update Global Settings (Phone & Hours)', async ({ page }) => {
    await page.waitForSelector('h1:has-text("Website Content")', { timeout: 30000 });

    await page.fill('label:has-text("Phone Number") + input', '9876543210');
    await page.fill('label:has-text("Mon - Fri") + input', '11:00 AM - 11:00 PM');

    await page.click('button:has-text("Save Global Settings")');
    await expect(page.locator('text=Global settings saved successfully')).toBeVisible({ timeout: 15000 });
  });
});
