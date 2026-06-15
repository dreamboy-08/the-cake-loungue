import { test, expect } from '@playwright/test';

test('Final UI Verification', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'final_home.png', fullPage: true });

  await page.goto('http://localhost:3001/menu');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'final_menu.png' });

  await page.goto('http://localhost:3001/checkout');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'final_checkout.png' });
});
