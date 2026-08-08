import { test, expect } from '@playwright/test';

test.describe('Checkout Midnight Delivery Caution', () => {
  test('should show midnight delivery caution only when midnight slot is selected', async ({ page }) => {
    // 1. Go to Menu page and add a product to the cart
    await page.goto('http://localhost:3000/menu');
    await page.waitForTimeout(1000); // Wait for hydration

    const addButton = page.locator("button:has-text('Add')").first();
    await addButton.click();

    // Verify product added (cart badge shows 1)
    const cartBadge = page.locator('button[aria-label="View Cart"]').locator('.absolute');
    await expect(cartBadge).toHaveText('1');

    // 2. Go to Checkout page with bypass=true to skip auth checks
    await page.goto('http://localhost:3000/checkout?bypass=true');
    await page.waitForTimeout(2000); // Wait for page load and state initialization

    // 3. Confirm Midnight Delivery Caution is initially HIDDEN
    const cautionSelector = page.locator('text=⚠ IMPORTANT — Midnight Delivery');
    await expect(cautionSelector).not.toBeVisible();

    // 4. Select a delivery date
    // Click the calendar button
    await page.click('button:has-text("Select Delivery Date")');
    await page.waitForSelector('.react-datepicker');

    // Click a selectable day that is not disabled or out of range
    // React-datepicker days have class 'react-datepicker__day'
    // Let's click the second day cell (or future) that is selectable and not disabled or outside month
    // selecting the second day guarantees that the 16-hour preparation lead time rule doesn't disable our target slot.
    const dayElement = page.locator('.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)').nth(1);
    await dayElement.click();

    // 5. Select a non-midnight delivery slot (e.g. "10:00 AM – 12:00 PM")
    const timeSlotDropdown = page.locator('select');
    await timeSlotDropdown.selectOption('10:00 AM – 12:00 PM');

    // Confirm Caution is STILL HIDDEN
    await expect(cautionSelector).not.toBeVisible();

    // 6. Select the Midnight Delivery slot
    await timeSlotDropdown.selectOption('10:00 PM – 12:00 AM (Midnight Delivery)');

    // Confirm Caution is now IMMEDIATELY VISIBLE
    await expect(cautionSelector).toBeVisible();

    // 7. Select a non-midnight delivery slot again (e.g. "02:00 PM – 04:00 PM")
    await timeSlotDropdown.selectOption('02:00 PM – 04:00 PM');

    // Confirm Caution is INSTANTLY HIDDEN again
    await expect(cautionSelector).not.toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: '/home/jules/verification/checkout_caution_flow.png', fullPage: true });
  });
});
