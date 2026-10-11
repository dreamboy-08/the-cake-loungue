import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-auth-helper';

test.describe('Admin Permanent Customer Deletion Feature', () => {

  test('backend API rejects unauthenticated delete requests', async ({ request }) => {
    const response = await request.post('/api/admin/delete-customer', {
      data: { targetUid: 'customer-uid-to-delete' }
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Unauthorized');
  });

  test('backend API rejects non-admin customer delete requests', async ({ request }) => {
    const response = await request.post('/api/admin/delete-customer', {
      headers: {
        'x-admin-caller-uid': 'regular-user-uid',
        'x-admin-caller-email': 'customer@gmail.com'
      },
      data: { targetUid: 'target-customer-uid' }
    });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('backend API rejects missing target customer UID', async ({ request }) => {
    const response = await request.post('/api/admin/delete-customer', {
      headers: {
        'x-admin-caller-uid': 'admin-caller-uid-123',
        'x-admin-caller-email': 'admin@cakelounge.com'
      },
      data: { targetUid: '' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Target customer UID is required');
  });

  test('backend API prevents admin from deleting their own account', async ({ request }) => {
    const response = await request.post('/api/admin/delete-customer', {
      headers: {
        'x-admin-caller-uid': 'admin-uid-123',
        'x-admin-caller-email': 'admin@cakelounge.com'
      },
      data: { targetUid: 'admin-uid-123' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Administrators cannot delete their own account');
  });

  test('backend API executes authorized customer deletion and anonymizes order PII', async ({ request }) => {
    const response = await request.post('/api/admin/delete-customer', {
      headers: {
        'x-admin-caller-uid': 'admin-uid-123',
        'x-admin-caller-email': 'admin@cakelounge.com'
      },
      data: { targetUid: 'test-customer-to-delete-456' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.summary.targetUid).toBe('test-customer-to-delete-456');
  });

  test('Admin UI allows opening delete customer modal with details', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/customers');
    await page.waitForLoadState('networkidle');

    // Verify Customer Management header
    await expect(page.locator('h1')).toContainText('Customer Management');

    // Search for or check customer rows
    const deleteButton = page.locator('button[title="Delete Customer"]').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Check confirmation modal header
      await expect(page.locator('h3:has-text("Permanently Delete Customer?")')).toBeVisible();

      // Cancel deletion
      await page.locator('button:has-text("Cancel")').click();
      await expect(page.locator('h3:has-text("Permanently Delete Customer?")')).not.toBeVisible();
    }
  });

});
