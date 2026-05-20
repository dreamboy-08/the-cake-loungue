import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'menu', path: '/menu' },
  { name: 'custom-cake', path: '/custom-cake' },
  { name: 'checkout', path: '/checkout' }
];

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 667 }
];

test.describe('Visual Audit', () => {
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`Audit ${page.name} on ${viewport.name}`, async ({ page: browserPage }) => {
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });

        // Use a longer timeout for navigation
        await browserPage.goto(`http://localhost:3000${page.path}`, { waitUntil: 'networkidle', timeout: 60000 });

        // Wait for images to load
        await browserPage.waitForTimeout(2000);

        await browserPage.screenshot({
          path: `verification/audit-${page.name}-${viewport.name}.png`,
          fullPage: true
        });
      });
    }
  }
});
