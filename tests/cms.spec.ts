import { test, expect } from '@playwright/test';

test.describe('Enterprise Admin CMS Upgrade Validation Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Print browser console logs to debug if needed
    page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));

    // Navigate to CMS Website Content Page with auth bypass
    await page.goto('http://localhost:3000/admin/website-content?bypass=true');
  });

  test('Navigation Manager: CRUD & Visibility Controls', async ({ page }) => {
    // Expect Navigation Title in view
    await expect(page.locator('h2:has-text("Header Navigation Links")')).toBeVisible();

    // Verify default links like Cakes, Bento, Desserts are rendered
    await expect(page.locator('input[value="Cakes"]').first()).toBeVisible();

    // 1. ADD NEW LINK
    await page.click('button:has-text("Add Navigation Link")');
    const newLinkInput = page.locator('input[value="New Link"]').first();
    await expect(newLinkInput).toBeVisible();

    // 2. EDIT NAVIGATION ITEM
    await newLinkInput.fill('Milestone Cakes');
    await expect(page.locator('input[value="Milestone Cakes"]')).toBeVisible();

    // 3. REMOVE LINK
    // Target the delete button inside the parent row for 'Milestone Cakes'
    const linkRow = page.locator('div[class*="p-5"]').filter({ has: page.locator('input[value="Milestone Cakes"]') }).first();
    await linkRow.locator('button').last().click();

    await expect(page.locator('input[value="Milestone Cakes"]')).not.toBeVisible();
  });

  test('Mega Menu Sections & Items Management', async ({ page }) => {
    // Navigate to Mega Menu Tab
    await page.click('button:has-text("Mega Menu")');
    await expect(page.locator('h2:has-text("Mega Menu Columns & Nested Items")')).toBeVisible();

    // Check default section like "Category"
    await expect(page.locator('input[value="Category"]').first()).toBeVisible();

    // Create a new column
    await page.click('button:has-text("Create Mega Menu Section")');
    const newSectionTitle = page.locator('input[value="New Section"]').first();
    await expect(newSectionTitle).toBeVisible();

    // Add nested item inside that section
    // Clicking the last "Add Item" button on the page corresponds exactly to the newly created section
    await page.locator('button:has-text("Add Item")').last().click();

    // Check that a new input with placeholder "Item Name" is rendered
    await expect(page.locator('input[placeholder="Item Name"]').first()).toBeVisible();
  });

  test('Homepage CMS Visibility & Title Customization', async ({ page }) => {
    // Navigate to Homepage Tab
    await page.click('button:has-text("Homepage")');
    await expect(page.locator('h2:has-text("Homepage Manager & Section reordering")')).toBeVisible();

    // Expect Hero Banner configuration block
    await expect(page.locator('h3:has-text("Exquisite Cakes Delivered Fresh")')).toBeVisible();

    // Modify Hero title
    const heroTitleInput = page.locator('input[value="Exquisite Cakes Delivered Fresh"]').first();
    await heroTitleInput.fill('Artisan Luxury Handcrafted Cakes');
    await expect(page.locator('input[value="Artisan Luxury Handcrafted Cakes"]')).toBeVisible();
  });

  test('Scrolling Announcements Manager', async ({ page }) => {
    // Navigate to Announcements Tab
    await page.click('button:has-text("Announcements")');
    await expect(page.locator('h2:has-text("Promotional Scrolling Announcements")')).toBeVisible();

    // Verify standard defaults
    await expect(page.locator('input[value="Free Delivery on Orders Above ₹499"]').first()).toBeVisible();

    // Create announcement
    await page.click('button:has-text("Create Announcement")');
    const newAnnInput = page.locator('input[value="New Banner Text"]').first();
    await expect(newAnnInput).toBeVisible();

    // Edit content
    await newAnnInput.fill('Valentine Flat 20% Off!');
    await expect(page.locator('input[value="Valentine Flat 20% Off!"]')).toBeVisible();
  });

  test('Collections CMS Management', async ({ page }) => {
    // Navigate to Collections Tab
    await page.click('button:has-text("Collections")');
    await expect(page.locator('h2:has-text("Collection Manager")')).toBeVisible();

    // Verify Birthday Cakes collection defaults
    await expect(page.locator('input[value="Birthday Cakes"]').first()).toBeVisible();

    // Create custom milestone collection
    await page.click('button:has-text("Add Custom Collection")');
    const newColInput = page.locator('input[value="New Milestone Cakes"]').first();
    await expect(newColInput).toBeVisible();

    // Update details
    await newColInput.fill('Premium Anniversary Assortments');
    await expect(page.locator('input[value="Premium Anniversary Assortments"]')).toBeVisible();
  });

  test('Website Settings & Custom Styling', async ({ page }) => {
    // Navigate to Settings Tab
    await page.click('button:has-text("Website Settings")');
    await expect(page.locator('h2:has-text("Branding & Styling Settings")')).toBeVisible();

    // Logo Text check
    const logoInput = page.locator('input[value="The Cake Lounge"]').first();
    await expect(logoInput).toBeVisible();

    // Edit brand identity
    await logoInput.fill('The Chocolate Elite');
    await expect(page.locator('input[value="The Chocolate Elite"]')).toBeVisible();
  });

  test('Media Library Assets Explorer', async ({ page }) => {
    // Navigate to Media tab
    await page.click('button:has-text("Media Library")');
    await expect(page.locator('h2:has-text("Enterprise Media Assets")')).toBeVisible();

    // Search input exists
    await expect(page.locator('input[placeholder="Search images by name or alt text..."]')).toBeVisible();
    await page.locator('input[placeholder="Search images by name or alt text..."]').fill('chocolate');

    // Folder selector exists
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('SEO Manager Metadata & Crawling Rules', async ({ page }) => {
    // Navigate to SEO Tab
    await page.click('button:has-text("SEO Manager")');
    await expect(page.locator('h2:has-text("SEO & Meta Manager")')).toBeVisible();

    // Verify page slug home is present
    await expect(page.locator('input[value*="The Cake Lounge | Handcrafted Premium Custom Cakes"]').first()).toBeVisible();
  });

  test('General System Settings & Checkouts Configs', async ({ page }) => {
    // Navigate to General Settings Tab
    await page.click('button:has-text("General")');
    await expect(page.locator('h2:has-text("Checkout & Service Configurations")')).toBeVisible();

    // Check delivery charges input, threshold and zipcodes
    const deliveryChargeInput = page.locator('input[type="number"]').first();
    await expect(deliveryChargeInput).toBeVisible();
    await deliveryChargeInput.fill('120');

    // Maintenance button toggle
    const maintBtn = page.locator('button:has-text("Storefront Live")');
    await expect(maintBtn).toBeVisible();
  });

});
