import { Page, expect } from '@playwright/test';

/**
 * Helper function to authenticate a customer via the mandatory auth gate
 */
export async function loginAsCustomer(page: Page, email = 'customer@cakelounge.com', password = 'password123') {
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.removeItem('cakelounge_mock_user'));
  await page.reload();
  const gateHeader = page.locator('text=Welcome to The Cake Lounge');
  await expect(gateHeader).toBeVisible();
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]:has-text("Sign In")');
  await expect(gateHeader).not.toBeVisible();
}

/**
 * Helper function to authenticate an admin via the mandatory auth gate
 */
export async function loginAsAdmin(page: Page, email = 'admin@cakelounge.com', password = 'password123') {
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.removeItem('cakelounge_mock_user'));
  await page.reload();
  const gateHeader = page.locator('text=Welcome to The Cake Lounge');
  await expect(gateHeader).toBeVisible();
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]:has-text("Sign In")');
  await expect(gateHeader).not.toBeVisible();
}
