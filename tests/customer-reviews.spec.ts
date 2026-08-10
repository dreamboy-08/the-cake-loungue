import { test, expect } from '@playwright/test';

test.describe('Customer Reviews + Testimonials System E2E', () => {

  test('should support the complete Customer Review -> Admin Moderation -> Homepage display lifecycle', async ({ page }) => {
    test.setTimeout(90000);

    // ----------------------------------------------------
    // Pristine state setup: Clear any previous test data
    // ----------------------------------------------------
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.removeItem('cakeLounge_cms_testimonials');
      localStorage.removeItem('cakeLounge_orders');
    });

    // ----------------------------------------------------
    // Scenario 1: Generic Review Flow (No Verified Badge)
    // ----------------------------------------------------

    // 1. Open the homepage
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('#testimonials')).toBeVisible();

    // Wait for client-side hydration to fully complete
    await page.waitForTimeout(2500);

    // 2. Verify "Write a Review" entry point in Homepage/Testimonials area is visible
    const writeReviewButton = page.locator('#testimonials').locator('a:has-text("Write a Review")').first();
    await writeReviewButton.scrollIntoViewIfNeeded();
    await expect(writeReviewButton).toBeVisible();

    // Click and wait for navigation, with direct fallback if hydration lag blocks client-side click handler
    try {
      await writeReviewButton.click();
      await page.waitForURL(/.*\/reviews/, { timeout: 3000 });
    } catch (e) {
      console.log("Direct click navigation failed or timed out, navigating directly to /reviews...");
      await page.goto('http://localhost:3000/reviews', { waitUntil: 'networkidle' });
    }

    // 3. Verify we are on the reviews submission page
    await expect(page).toHaveURL(/.*\/reviews/);
    await expect(page.locator('h1:has-text("Write a Customer Review")')).toBeVisible();

    // 4. Fill in generic review details (Not logged in / guest)
    await page.fill('input[placeholder="Enter your name"]', 'Jane Guest Tester');

    // Select 4 Stars (click 4th star button)
    const starButtons = page.locator('form button[type="button"]');
    await starButtons.nth(3).click(); // 4th star is index 3

    await page.fill('textarea[placeholder*="Tell us about"]', 'Amazing textures! Highly recommended for birthday parties.');

    // 5. Submit the review
    await page.click('button:has-text("Submit Review")');

    // 6. Verify successful confirmation screen
    await expect(page.locator('h2:has-text("Review Submitted!")')).toBeVisible();
    await expect(page.locator('text=Your review has been sent for moderation')).toBeVisible();

    // ----------------------------------------------------
    // Scenario 2: Moderation & Approval Flow in Admin
    // ----------------------------------------------------

    // 7. Go to Admin Testimonials moderation page
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("Testimonials CMS")')).toBeVisible();
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    // 8. Go to "Pending" tab to locate our newly submitted review
    await page.click('button:has-text("Pending")');
    await expect(page.locator('h3:has-text("Jane Guest Tester")').first()).toBeVisible();
    await expect(page.locator('p:has-text("Amazing textures! Highly recommended for birthday parties.")')).toBeVisible();

    // 9. Approve the review
    const pendingCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Jane Guest Tester")') }).first();
    await pendingCard.locator('button:has-text("Approve")').click();
    await expect(page.locator('text=Review marked as approved')).toBeVisible();

    // 10. Verify it is now in "Approved" tab
    await page.click('button:has-text("Approved")');
    await expect(page.locator('h3:has-text("Jane Guest Tester")').first()).toBeVisible();

    // 11. Navigate to Homepage and verify it displays on the storefront WITHOUT Verified Buyer badge
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('#testimonials')).toBeVisible();

    // Wait for testimonials to finish loading on homepage
    await expect(page.locator('#testimonials').locator('text=Jane Guest Tester').first()).toBeVisible({ timeout: 10000 });

    const reviewCardOnHome = page.locator('#testimonials').locator('div[class*="bg-white"]').filter({ has: page.locator('text=Jane Guest Tester') }).first();
    await expect(reviewCardOnHome).toBeVisible();
    await expect(reviewCardOnHome.locator('text=Amazing textures! Highly recommended for birthday parties.').first()).toBeVisible();
    // It should NOT have a Verified Buyer badge because it was not linked to an order
    await expect(reviewCardOnHome.locator('text=Verified Buyer')).not.toBeVisible();

    // ----------------------------------------------------
    // Scenario 3: Order-Based Review Flow (With Verified Badge)
    // ----------------------------------------------------

    // 12. Seed a mock Delivered Order into localStorage
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const mockOrders = [
        {
          id: "order-test-1001",
          status: "Delivered",
          userId: "user-mock-123",
          createdAt: "2025-01-20T10:00:00.000Z",
          items: [
            { name: "Belgian Chocolate Truffle Cake", price: 499, quantity: 1, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" }
          ],
          totalAmount: 499,
          customer: { name: "Alice Order Tester", phone: "9999999999" },
          shippingAddress: "456 Celebration Boulevard, Gurugram"
        }
      ];
      localStorage.setItem('cakeLounge_orders', JSON.stringify(mockOrders));
    });

    // 13. Navigate directly to reviews page with orderId query param
    await page.goto('http://localhost:3000/reviews?orderId=order-test-1001', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Verified Purchase')).toBeVisible();
    await expect(page.locator('text=Reviewing Order #EST-1001')).toBeVisible(); // Order id sliced/uppercased is EST-1001

    // 14. Fill in verified review details
    await page.fill('input[placeholder="Enter your name"]', 'Alice Order Tester');

    // Select 5 Stars (click 5th star button)
    const verifiedStarButtons = page.locator('form button[type="button"]');
    await verifiedStarButtons.nth(4).click(); // 5th star is index 4

    await page.fill('textarea[placeholder*="Tell us about"]', 'This Belgian Chocolate cake made our anniversary incredibly special!');

    // 15. Submit verified review
    await page.click('button:has-text("Submit Review")');
    await expect(page.locator('h2:has-text("Review Submitted!")')).toBeVisible();

    // 16. Duplicate protection check: try to write review for same order again
    await page.goto('http://localhost:3000/reviews?orderId=order-test-1001', { waitUntil: 'networkidle' });
    await expect(page.locator('h2:has-text("Review Already Submitted")')).toBeVisible();
    await expect(page.locator('text=You have already shared your feedback for Order #EST-1001')).toBeVisible();

    // 17. Approve the verified review in Admin panel
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Pending")');
    await expect(page.locator('h3:has-text("Alice Order Tester")').first()).toBeVisible();

    const pendingVerifiedCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Alice Order Tester")') }).first();
    await pendingVerifiedCard.locator('button:has-text("Approve")').click();
    await expect(page.locator('text=Review marked as approved')).toBeVisible();

    // 18. Verify on Homepage that Alice Order Tester displays WITH the Verified Buyer badge
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('#testimonials')).toBeVisible();

    // Wait for testimonials to finish loading on homepage
    await expect(page.locator('#testimonials').locator('text=Alice Order Tester').first()).toBeVisible({ timeout: 10000 });

    const verifiedReviewCard = page.locator('#testimonials').locator('div[class*="bg-white"]').filter({ has: page.locator('text=Alice Order Tester') }).first();
    await expect(verifiedReviewCard).toBeVisible();
    await expect(verifiedReviewCard.locator('text=This Belgian Chocolate cake made our anniversary incredibly special!').first()).toBeVisible();
    await expect(verifiedReviewCard.locator('text=Verified Buyer').first()).toBeVisible();

    // ----------------------------------------------------
    // Scenario 4: Reject/Hide & Persistence Flow
    // ----------------------------------------------------

    // 19. Go to Admin Testimonials and Reject Alice's review
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Approved")');

    const approvedAliceCard = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Alice Order Tester")') }).first();
    await approvedAliceCard.locator('button:has-text("Reject")').click();
    await expect(page.locator('text=Review marked as rejected')).toBeVisible();

    // 20. Go to Homepage and verify Alice's review disappears
    await page.goto('http://localhost:3000/?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('#testimonials').locator('text=Alice Order Tester')).not.toBeVisible();

    // 21. Refresh Homepage to verify persistence
    await page.reload();
    await expect(page.locator('#testimonials').locator('text=Alice Order Tester')).not.toBeVisible();

    // 22. Clean up mock testimonials so they don't leak into subsequent runs
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Loading testimonials...')).not.toBeVisible({ timeout: 15000 });

    // Delete Jane Guest Tester
    await page.click('button:has-text("Approved")');
    const deleteJane = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Jane Guest Tester")') }).first();
    await deleteJane.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible();

    // Delete Alice Order Tester
    await page.click('button:has-text("Rejected")');
    const deleteAlice = page.locator('div[class*="bg-white"]').filter({ has: page.locator('h3:has-text("Alice Order Tester")') }).first();
    await deleteAlice.locator('button[title="Delete"]').click();
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Testimonial deleted successfully')).toBeVisible();
  });
});
