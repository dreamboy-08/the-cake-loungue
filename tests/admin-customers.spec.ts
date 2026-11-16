import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-auth-helper';

test.describe('Admin customer management removal', () => {
  test('hides the Customers navigation item and returns 404 for the removed route', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('http://localhost:3000/admin');
    await expect(page.getByRole('link', { name: 'Customers', exact: true })).toHaveCount(0);

    const response = await page.goto('http://localhost:3000/admin/customers');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Customer Management' })).toHaveCount(0);
  });

  test('keeps the Admin Orders route available', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/orders');
    await expect(page.getByRole('heading', { name: 'Order Management' })).toBeVisible();
  });
});
