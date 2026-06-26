import { test, expect } from '@playwright/test';

test('verify premium custom cake preview', async ({ page }) => {
  await page.goto('http://localhost:3001/custom-cake');

  // Wait for the page to load
  await page.waitForSelector('h1');

  // Enter a message
  await page.fill('input[placeholder="Happy Birthday Riya"]', 'Premium Cake');

  // Change flavor
  await page.selectOption('select >> nth=0', 'Red Velvet');

  // Change theme
  await page.fill('input[placeholder="Princess, Cars, Space..."]', 'Princess');

  // Take desktop screenshot
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.screenshot({ path: 'premium_custom_cake_desktop.png', fullPage: true });

  // Take mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'premium_custom_cake_mobile.png', fullPage: true });
});
