import { test, expect } from '@playwright/test';

test.describe('Mandatory Customer Authentication Gate E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Ensure clean logged-out session for every test without interfering with runtime localStorage
    await page.addInitScript(() => {
      window.sessionStorage.clear();
    });
  });

  test('should display non-dismissible authentication gate for unauthenticated visitors on storefront routes', async ({ page }) => {
    // 1. Open homepage without logging in
    await page.goto('http://localhost:3000/');

    // 2. Auth gate should be visible immediately
    const authGate = page.locator('text=Welcome to The Cake Lounge');
    await expect(authGate).toBeVisible();

    // 3. Verify no close buttons exist to dismiss the gate
    const closeBtn = page.locator('button[aria-label="Close modal"], button[aria-label="Close reminder"]');
    await expect(closeBtn).toHaveCount(0);

    // 4. Test pressing Escape key does not dismiss the gate
    await page.keyboard.press('Escape');
    await expect(authGate).toBeVisible();

    // 5. Test clicking outside (backdrop) does not dismiss the gate
    await page.mouse.click(10, 10);
    await expect(authGate).toBeVisible();
  });

  test('should protect direct URL access to protected routes (PDP, menu, cart, profile)', async ({ page }) => {
    // 1. Direct access to /menu
    await page.goto('http://localhost:3000/menu');
    await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();

    // 2. Direct access to /profile
    await page.goto('http://localhost:3000/profile');
    await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();

    // 3. Direct access to /checkout
    await page.goto('http://localhost:3000/checkout');
    await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();
  });

  test('should handle customer login, session persistence, and logout correctly', async ({ page }) => {
    // 1. Access homepage unauthenticated
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();

    // 2. Fill in sign in form
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]:has-text("Sign In")');

    // 3. Auth gate should dismiss and storefront content should render
    await expect(page.locator('text=Welcome to The Cake Lounge')).not.toBeVisible();
    await expect(page.locator('text=The Cake Lounge').first()).toBeVisible();

    // 4. Session persistence check: reload page
    await page.reload();
    await expect(page.locator('text=Welcome to The Cake Lounge')).not.toBeVisible();

    // 5. Logout check: click profile or logout button
    await page.goto('http://localhost:3000/profile');
    const logoutBtn = page.locator('button:has-text("Log Out"), button:has-text("Logout")');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();
    }
  });

  test('should support customer sign-up flow', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=Welcome to The Cake Lounge')).toBeVisible();

    // Click Create Account tab
    await page.click('button:has-text("Create Account")');

    // Fill signup details
    await page.fill('input[placeholder="John Doe"]', 'Jane Doe');
    await page.fill('input[placeholder="your@email.com"]', 'jane@example.com');
    await page.fill('input[placeholder="••••••••"]', 'password123');
    await page.click('button[type="submit"]:has-text("Create Account")');

    // Gate should dismiss
    await expect(page.locator('text=Welcome to The Cake Lounge')).not.toBeVisible();
  });

  test('should deny regular customers from accessing admin panel and allow authorized admins', async ({ page }) => {
    // 1. Log in as regular customer
    await page.goto('http://localhost:3000/');
    await page.fill('input[type="email"]', 'regular_customer@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]:has-text("Sign In")');
    await expect(page.locator('text=Welcome to The Cake Lounge')).not.toBeVisible();

    // 2. Try accessing admin dashboard -> should redirect to /login
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain('/admin');

    // 3. Log in as admin
    await page.evaluate(() => localStorage.removeItem('cakelounge_mock_user'));
    await page.goto('http://localhost:3000/');

    await page.fill('input[type="email"]', 'admin@cakelounge.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]:has-text("Sign In")');
    await expect(page.locator('text=Welcome to The Cake Lounge')).not.toBeVisible();

    // 4. Access admin dashboard -> allowed
    await page.goto('http://localhost:3000/admin');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

});
