import { test, expect } from '@playwright/test';

test.describe('Testimonials CMS Verification', () => {

  test('should support full testimonial CRUD, enable/disable, and sorting operations', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to admin panel testimonials route
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("Testimonials CMS")')).toBeVisible();

    // Wait for Next.js compilation and loading state to disappear
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 20000 });

    // ----------------------------------------------------
    // TEST 1: Create Testimonial ("Test Customer")
    // ----------------------------------------------------
    await page.click('button:has-text("Add Testimonial")');
    await expect(page.locator('h2:has-text("New Testimonial")')).toBeVisible();

    // Fill details
    await page.fill('input[placeholder="e.g. Priya Sharma"]', 'Test Customer');
    await page.fill('textarea[placeholder="e.g. Ordered a custom birthday cake..."]', 'This is a CMS testimonial test.');
    await page.fill('input[type="number"]', '5'); // Rating
    await page.fill('input[placeholder="e.g. Loyal Customer · 3 yrs"]', 'VVIP Customer');

    // Click Create
    await page.click('button:has-text("Create")');

    // Confirm creation success
    await expect(page.locator('text=Testimonial created successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Test Customer")').first()).toBeVisible();

    // Verify it appears on the actual storefront homepage testimonials section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#testimonials')).toBeVisible();
    await expect(page.locator('#testimonials').locator('text=Test Customer').first()).toBeVisible();
    await expect(page.locator('#testimonials').locator('text=This is a CMS testimonial test.').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 2: Edit Testimonial details
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    const card = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Test Customer")') }).first();
    await card.locator('button[title="Edit"]').click();

    await expect(page.locator('h2:has-text("Edit Testimonial")')).toBeVisible();
    await page.fill('input[placeholder="e.g. Priya Sharma"]', 'Updated Test Customer');
    await page.fill('textarea[placeholder="e.g. Ordered a custom birthday cake..."]', 'Updated CMS testimonial content.');
    await page.click('button:has-text("Update")');

    await expect(page.locator('text=Testimonial updated successfully')).toBeVisible();
    await expect(page.locator('h3:has-text("Updated Test Customer")').first()).toBeVisible();

    // Confirm storefront displays updated details
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#testimonials').locator('text=Updated Test Customer').first()).toBeVisible();
    await expect(page.locator('#testimonials').locator('text=Updated CMS testimonial content.').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 3: Disable the testimonial
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Customer")') }).first();

    // Toggle Live button to Hidden
    await updatedCard.locator('button:has-text("Live")').click();
    await expect(page.locator('text=Testimonial is now Disabled')).toBeVisible();

    // Confirm it disappears from storefront testimonials section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    if (await page.locator('#testimonials').isVisible()) {
      await expect(page.locator('#testimonials').locator('text=Updated Test Customer')).not.toBeVisible();
    }

    // ----------------------------------------------------
    // TEST 4: Re-enable the testimonial
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    const disabledCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Customer")') }).first();
    await disabledCard.locator('button:has-text("Hidden")').click();
    await expect(page.locator('text=Testimonial is now Active')).toBeVisible();

    // Confirm it returns to storefront testimonials section
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#testimonials').locator('text=Updated Test Customer').first()).toBeVisible();

    // ----------------------------------------------------
    // TEST 5: Create a second testimonial and test Display Order
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Add Testimonial")');
    await expect(page.locator('h2:has-text("New Testimonial")')).toBeVisible();

    await page.fill('input[placeholder="e.g. Priya Sharma"]', 'Second Test Customer');
    await page.fill('textarea[placeholder="e.g. Ordered a custom birthday cake..."]', 'Second CMS testimonial test.');
    await page.locator('input[type="number"]').nth(0).fill('4'); // Rating
    await page.locator('input[type="number"]').nth(1).fill('1'); // Display Order to be first
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Testimonial created successfully')).toBeVisible();

    // Go to storefront and check that Second Test Customer comes before Updated Test Customer
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#testimonials')).toBeVisible();

    const textOfTestimonials = await page.locator('#testimonials').locator('.text-chocolate').allInnerTexts();
    const secondIndex = textOfTestimonials.indexOf('Second Test Customer');
    const updatedIndex = textOfTestimonials.indexOf('Updated Test Customer');

    // Confirm both are present and secondIndex is less than updatedIndex
    expect(secondIndex).toBeGreaterThan(-1);
    expect(updatedIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeLessThan(updatedIndex);

    // ----------------------------------------------------
    // TEST 6: Delete temporary test testimonials
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    // Delete "Updated Test Customer"
    const deleteCard1 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Updated Test Customer")') }).first();
    await deleteCard1.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible();

    // Delete "Second Test Customer"
    const deleteCard2 = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Second Test Customer")') }).first();
    await deleteCard2.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible();

    // Confirm storefront no longer has them
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#testimonials').locator('text=Updated Test Customer')).not.toBeVisible();
    await expect(page.locator('#testimonials').locator('text=Second Test Customer')).not.toBeVisible();
  });
});
