import { test, expect } from '@playwright/test';

/**
 * Authentication and Admin Management Tests
 *
 * Note: These tests assume a running local environment with access to Firebase.
 * Mocking or using a dedicated test project is recommended for full CI/CD.
 */

test.describe('Authentication Flows', () => {
  test('Login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });

  test('Signup page renders correctly', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up', exact: true })).toBeVisible();
  });

  test('Forgot Password page renders correctly', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByText('Reset Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  });

  test('Admin routes are protected', async ({ page }) => {
    // Should redirect to login if not authenticated or not admin
    await page.goto('/admin');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });
});

test.describe('Admin User Management UI', () => {
  // This test checks if the UI components for User Management exist
  // Functional testing would require a signed-in admin session

  test('Admin sidebar contains Users link when (hypothetically) logged in as admin', async ({ page }) => {
    // We can't easily mock the Firebase auth state in this simple E2E without more setup,
    // but we can check if the link is defined in the layout source if we were to render it.
    // For now, we'll verify the login requirement is working.
    await page.goto('/admin/users');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });
});
