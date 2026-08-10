import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Manager End-To-End Integration E2E', () => {

  test('Should configure home page SEO settings via Admin Panel and see immediate storefront update', async ({ page }) => {
    // 1. Navigate to Admin Panel -> SEO tab with auth bypass
    await page.goto('http://localhost:3000/admin/website-content?tab=seo&bypass=true');

    // Confirm Tab is visible
    await expect(page.locator('h2:has-text("SEO & Meta Manager")')).toBeVisible();

    // 2. Modify Homepage SEO Metadata inputs
    // We locate the inputs using direct child (>) label matching
    const titleInput = page.locator('div:has(> label:has-text("SEO Title Tag"))').first().locator('input');
    await titleInput.fill('The Cake Lounge | Handcrafted Elite Patisserie');

    const keywordsInput = page.locator('div:has(> label:has-text("SEO Keywords"))').first().locator('input');
    await keywordsInput.fill('elite, cakes, patisserie');

    const descTextarea = page.locator('div:has(> label:has-text("Meta Description"))').first().locator('textarea');
    await descTextarea.fill('Order premium handcrafted cakes in Gurugram.');

    const canonicalInput = page.locator('div:has(> label:has-text("Canonical Link URL"))').first().locator('input');
    await canonicalInput.fill('https://thecakelounge.com/test-home');

    const ogImageInput = page.locator('div:has(> label:has-text("OG / Social Preview Image URL"))').first().locator('input');
    await ogImageInput.fill('https://images.unsplash.com/photo-test-og-image.jpg');

    // 3. Save the configurations
    await page.click('button:has-text("Save Search Meta")');

    // Confirm Toast feedback
    await expect(page.locator('text=SEO Metadata changes saved successfully!')).toBeVisible();

    // 4. Navigate to storefront homepage
    await page.goto('http://localhost:3000/');

    // 5. Verify head elements are updated correctly in real-time
    await expect(page).toHaveTitle('The Cake Lounge | Handcrafted Elite Patisserie');

    const description = page.locator("meta[name='description']");
    await expect(description).toHaveAttribute('content', 'Order premium handcrafted cakes in Gurugram.');

    const keywords = page.locator("meta[name='keywords']");
    await expect(keywords).toHaveAttribute('content', 'elite, cakes, patisserie');

    const ogImage = page.locator("meta[property='og:image']");
    await expect(ogImage).toHaveAttribute('content', 'https://images.unsplash.com/photo-test-og-image.jpg');

    const canonical = page.locator("link[rel='canonical']");
    await expect(canonical).toHaveAttribute('href', 'https://thecakelounge.com/test-home');

    const robots = page.locator("meta[name='robots']");
    await expect(robots).toHaveAttribute('content', 'index, follow');
  });

  test('Should dynamically generate accurate product-specific SEO meta tags on detail pages', async ({ page }) => {
    // Navigate to a dynamic product detail page (ID 1 corresponds to 'Royal Raspberry Birthday Cake')
    await page.goto('http://localhost:3000/shop/1');

    // Verify product-specific title is set dynamically on client-side (polls automatically)
    await expect(page).toHaveTitle(/Raspberry/);
    await expect(page).toHaveTitle(/The Cake Lounge/);

    // Verify description exists and matches product description
    const description = page.locator("meta[name='description']");
    await expect(description).toHaveAttribute('content', /raspberry/i);

    // Verify ogImage is set to the product's image
    const ogImage = page.locator("meta[property='og:image']");
    await expect(ogImage).toHaveAttribute('content', /\.(jpg|jpeg|png|webp)/i);

    // Verify canonical URL is product detail url
    const canonical = page.locator("link[rel='canonical']");
    await expect(canonical).toHaveAttribute('href', 'https://thecakelounge.com/shop/1');

    // Verify indexable
    const robots = page.locator("meta[name='robots']");
    await expect(robots).toHaveAttribute('content', 'index, follow');
  });
});
