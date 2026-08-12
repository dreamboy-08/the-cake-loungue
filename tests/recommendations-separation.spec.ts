import { test, expect } from '@playwright/test';

test.describe('Recommendations Separation Suite', () => {

  test('PDP: Separate Cakes and Decorations sections correctly', async ({ page }) => {
    // Navigate to a cake product detail page
    await page.goto('http://localhost:3000/shop/1');
    await expect(page.locator('h1:has-text("Royal Raspberry Birthday Cake")')).toBeVisible();

    // Verify "You May Also Like" title is visible
    const recSection = page.locator('section').filter({ hasText: 'You May Also Like' });
    await expect(recSection.locator('h3:has-text("You May Also Like")')).toBeVisible();

    // Verify separate subheadings for "Cakes" and "Decorations" are visible inside the section
    const cakesHeader = recSection.locator('h4:has-text("Cakes")');
    const decorationsHeader = recSection.locator('h4:has-text("Decorations")');
    await expect(cakesHeader).toBeVisible();
    await expect(decorationsHeader).toBeVisible();

    // Verify that the elements under Cakes are indeed cakes (not containing 'dec_' in their links or specific decorative content)
    const cakesSection = recSection.locator('div:has(h4:text("Cakes"))').first();
    const cakesCards = cakesSection.locator('a[href^="/shop/"]');
    const firstCakeHref = await cakesCards.first().getAttribute('href');
    expect(firstCakeHref).not.toContain('dec_');

    // Verify that elements under Decorations are indeed decorations (containing 'dec_' in their links)
    const decorationsSection = recSection.locator('div:has(h4:text("Decorations"))').first();
    const decorationsCards = decorationsSection.locator('a[href^="/shop/"]');
    const firstDecorationHref = await decorationsCards.first().getAttribute('href');
    expect(firstDecorationHref).toContain('dec_');
  });

  test('Cart Drawer: Separate Cakes and Decorations categories inside recommendations', async ({ page }) => {
    // Navigate to product detail page
    await page.goto('http://localhost:3000/shop/1');
    await expect(page.locator('h1:has-text("Royal Raspberry Birthday Cake")')).toBeVisible();

    // Add item to cart to ensure cart is populated and open cart modal
    await page.click('button:has-text("Add to Cart")');

    // Scroll to top of the page to ensure the fixed Navbar is fully visible and not hidden before clicking View Cart
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('button[aria-label="View Cart"]');

    // Verify recommendations section is visible inside Cart modal
    const cartRecHeader = page.locator('h4:has-text("You May Also Like")');
    await expect(cartRecHeader).toBeVisible();

    // Check separation subheadings inside the drawer under the "You May Also Like" section
    const drawerCakesHeader = page.locator('h5:has-text("Cakes")');
    const drawerDecorationsHeader = page.locator('h5:has-text("Decorations")');

    await expect(drawerCakesHeader).toBeVisible();
    await expect(drawerDecorationsHeader).toBeVisible();
  });

});
