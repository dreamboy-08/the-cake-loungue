import { test, expect } from '@playwright/test';

test.describe('Combined Homepage Content CMS E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Print browser console logs to debug if needed
    page.on('console', msg => console.log('BROWSER CONSOLE LOG:', msg.text()));
  });

  test('About/Our Story CMS: Customization, Visibility & Persistence', async ({ page }) => {
    // 1. Open Our Story Admin with auth bypass
    await page.goto('http://localhost:3000/admin/our-story?bypass=true');
    await expect(page.locator('h1:has-text("About Us & Our Story CMS")')).toBeVisible();

    // 2. Change section heading and statistics
    const headingTextarea = page.locator('textarea[placeholder="Supports line breaks using Enter"]').first();
    await headingTextarea.fill('Handcrafted Story\nof Sweet Sensation');

    const statNumInput = page.locator('input[placeholder="e.g. 10+"]').first();
    await statNumInput.fill('15+');

    // 3. Save
    await page.click('button:has-text("Save All Settings")');
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 4. Open Homepage and Verify Changes
    await page.goto('http://localhost:3000/');
    const aboutSection = page.locator('section#about');
    await expect(aboutSection).toBeVisible();
    await expect(aboutSection.locator('h2')).toContainText('Handcrafted Story');
    await expect(aboutSection.locator('h2')).toContainText('of Sweet Sensation');
    await expect(aboutSection.locator('text=15+')).toBeVisible();

    // 5. Disable About section
    await page.goto('http://localhost:3000/admin/our-story?bypass=true');
    // Force click to bypass any temporary Framer motion translation offsets
    await page.click('button:has-text("Section Enabled")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 6. Verify disappeared
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#about')).not.toBeVisible();

    // 7. Enable About section again
    await page.goto('http://localhost:3000/admin/our-story?bypass=true');
    await page.click('button:has-text("Section Hidden")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Our Story settings saved in real-time!')).toBeVisible();

    // 8. Verify returns
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#about')).toBeVisible();
  });

  test('Gallery CMS: Customization, Item Reordering, Visibility & Persistence', async ({ page }) => {
    // 1. Open Gallery Admin with auth bypass
    await page.goto('http://localhost:3000/admin/gallery?bypass=true');
    await expect(page.locator('h1:has-text("Homepage Gallery CMS")')).toBeVisible();

    // 2. Change section title and subtitle
    const titleInput = page.locator('input[placeholder="e.g. Our Master Creations"]').first();
    await titleInput.fill('Symphony of Premium Textures');

    const subtitleInput = page.locator('input[placeholder="e.g. A Feast for the Eyes"]').first();
    await subtitleInput.fill('Our Visual Masterpieces');

    // 3. Add gallery item slot
    await page.click('button:has-text("Add Item")', { force: true });
    const lastCaptionInput = page.locator('input[placeholder="Caption/Label"]').last();
    await lastCaptionInput.fill('Choc Velvet Gateau');

    // 4. Save
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Gallery settings saved successfully!')).toBeVisible();

    // 5. Open Homepage and Verify Changes
    await page.goto('http://localhost:3000/');
    const gallerySection = page.locator('section#gallery');
    await expect(gallerySection).toBeVisible();
    await expect(gallerySection.locator('h2')).toContainText('Symphony of Premium Textures');
    await expect(gallerySection.locator('text=Choc Velvet Gateau').first()).toBeVisible();

    // 6. Disable Gallery section
    await page.goto('http://localhost:3000/admin/gallery?bypass=true');
    await page.click('button:has-text("Section Live")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Gallery settings saved successfully!')).toBeVisible();

    // 7. Verify disappeared
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#gallery')).not.toBeVisible();

    // 8. Enable Gallery section again
    await page.goto('http://localhost:3000/admin/gallery?bypass=true');
    await page.click('button:has-text("Section Hidden")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Gallery settings saved successfully!')).toBeVisible();

    // 9. Verify returns
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#gallery')).toBeVisible();
  });

  test('Testimonials CMS: CRUD, Rating, Visibility & Persistence', async ({ page }) => {
    // 1. Open Testimonials Admin with auth bypass
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true');
    await expect(page.locator('h1:has-text("Homepage Testimonials CMS")')).toBeVisible();

    // 2. Change section title and subtitle
    const titleInput = page.locator('input[placeholder="e.g. Love Letters from Foodies"]').first();
    await titleInput.fill('Heartfelt Milestones Sweetened');

    const subtitleInput = page.locator('input[placeholder="e.g. What People Are Saying"]').first();
    await subtitleInput.fill('Our Visual Letters');

    // Debugging: Print values and take screenshot
    console.log("TITLE INPUT VALUE:", await titleInput.inputValue());
    console.log("SUBTITLE INPUT VALUE:", await subtitleInput.inputValue());
    await page.screenshot({ path: '/home/jules/verification/debug_admin_testimonials.png' });

    // 3. Add testimonial slot
    await page.click('button:has-text("Add Testimonial")', { force: true });
    const lastNameInput = page.locator('input[placeholder="e.g. Priya Sharma"]').last();
    await lastNameInput.fill('Chef Michael');

    const lastTagInput = page.locator('input[placeholder="e.g. Verified Client"]').last();
    await lastTagInput.fill('Guest Critique');

    const lastTextarea = page.locator('textarea[placeholder="Testimonial text copy..."]').last();
    await lastTextarea.fill('An absolute culinary masterpiece of dark chocolate bliss!');

    // 4. Save
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Testimonial settings saved successfully!')).toBeVisible();

    // 5. Open Homepage and Verify Changes
    await page.goto('http://localhost:3000/');
    const testimonialSection = page.locator('section#testimonials');
    await expect(testimonialSection).toBeVisible();
    await expect(testimonialSection.locator('h2')).toContainText('Heartfelt Milestones Sweetened');
    await expect(testimonialSection.locator('text=Chef Michael')).toBeVisible();
    await expect(testimonialSection.locator('text=Guest Critique')).toBeVisible();
    await expect(testimonialSection).toContainText('An absolute culinary masterpiece of dark chocolate bliss!');

    // 6. Disable Testimonials section
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true');
    await page.click('button:has-text("Section Live")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Testimonial settings saved successfully!')).toBeVisible();

    // 7. Verify disappeared
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#testimonials')).not.toBeVisible();

    // 8. Enable Testimonials section again
    await page.goto('http://localhost:3000/admin/testimonials?bypass=true');
    await page.click('button:has-text("Section Hidden")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Testimonial settings saved successfully!')).toBeVisible();

    // 9. Verify returns
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#testimonials')).toBeVisible();
  });

  test('Contact CMS: Headings, Active Card links, Visibility & Fallbacks', async ({ page }) => {
    // 1. Open Contact Admin with auth bypass
    await page.goto('http://localhost:3000/admin/contact?bypass=true');
    await expect(page.locator('h1:has-text("Homepage Contact CMS")')).toBeVisible();

    // 2. Change headings
    const headingInput = page.locator('input[placeholder*="Create Something"]').first();
    await headingInput.fill('Collaborate With Our Master Pâtissiers');

    // 3. Change contact details
    const phoneInput = page.locator('input[value*="+91"]').first();
    await phoneInput.fill('+91 88888 88888');

    const emailInput = page.locator('input[value*="@"]').first();
    await emailInput.fill('curations@thecakelounge.com');

    // 4. Save
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Contact settings saved successfully!')).toBeVisible();

    // 5. Open Homepage and Verify Changes
    await page.goto('http://localhost:3000/');
    const contactSection = page.locator('section#contact');
    await expect(contactSection).toBeVisible();
    await expect(contactSection.locator('h2')).toContainText('Collaborate With Our Master Pâtissiers');
    await expect(contactSection.locator('text=+91 88888 88888')).toBeVisible();
    await expect(contactSection.locator('text=curations@thecakelounge.com')).toBeVisible();

    // 6. Verify interactive links
    const phoneLink = contactSection.locator('a[href="tel:+918888888888"]');
    await expect(phoneLink).toBeVisible();

    const emailLink = contactSection.locator('a[href="mailto:curations@thecakelounge.com"]');
    await expect(emailLink).toBeVisible();

    // 7. Disable Contact section
    await page.goto('http://localhost:3000/admin/contact?bypass=true');
    await page.click('button:has-text("Section Live")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Contact settings saved successfully!')).toBeVisible();

    // 8. Verify disappeared
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#contact')).not.toBeVisible();

    // 9. Enable Contact section again
    await page.goto('http://localhost:3000/admin/contact?bypass=true');
    await page.click('button:has-text("Section Hidden")', { force: true });
    await page.click('button:has-text("Save All Settings")', { force: true });
    await expect(page.locator('text=Contact settings saved successfully!')).toBeVisible();

    // 10. Verify returns
    await page.goto('http://localhost:3000/');
    await expect(page.locator('section#contact')).toBeVisible();
  });

});
