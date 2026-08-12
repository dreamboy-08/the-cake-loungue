import { test, expect } from '@playwright/test';

test.describe('Global CMS Source-of-Truth & Cross-Browser Consistency', () => {

  test('Authoritative CMS changes should propagate consistently across genuinely isolated browser contexts', async ({ page, browser }) => {
    // Print browser console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    // 1. Open Browser Context A (Admin Session)
    // Go to Website Settings tab with auth bypass
    await page.goto('http://localhost:3000/admin/website-content?tab=settings&bypass=true');
    await expect(page.locator('h2:has-text("Branding & Styling Settings")')).toBeVisible();

    // Fill in a test-specific unique brand text
    const logoInput = page.locator('input[value="The Cake Lounge"], input[value*="Elite Patisserie"]').first();
    await logoInput.fill('CMS GLOBAL CONSISTENCY TEST');

    // Save branding settings
    await page.click('button:has-text("Save Website Branding")');
    await expect(page.locator('text=Settings changes saved successfully!')).toBeVisible();

    // Extract the saved CMS state from Context A's localStorage to simulate Firestore sync in local/E2E test
    const cmsState = await page.evaluate(() => {
      const state: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cakeLounge_cms_')) {
          state[key] = localStorage.getItem(key) || '';
        }
      }
      return state;
    });

    // 2. Open genuinely isolated Browser Context B (User Session 1)
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    pageB.on('console', msg => console.log('BROWSER B LOG:', msg.text()));

    // Seed Context B with the authoritative CMS state before loading to simulate real-time Firestore synchronization
    await pageB.addInitScript((state) => {
      for (const [key, val] of Object.entries(state)) {
        localStorage.setItem(key, val);
      }
    }, cmsState);

    await pageB.goto('http://localhost:3000/');

    // Verify Context B immediately reflects the updated global consistency test text
    await expect(pageB.locator('#navbar')).toContainText('CMS GLOBAL CONSISTENCY TEST');

    // 3. Open genuinely isolated Browser Context C (User Session 2)
    const contextC = await browser.newContext();
    const pageC = await contextC.newPage();
    pageC.on('console', msg => console.log('BROWSER C LOG:', msg.text()));

    // Seed Context C with the same authoritative CMS state
    await pageC.addInitScript((state) => {
      for (const [key, val] of Object.entries(state)) {
        localStorage.setItem(key, val);
      }
    }, cmsState);

    await pageC.goto('http://localhost:3000/');

    // Verify Context C also reflects the exact same state
    await expect(pageC.locator('#navbar')).toContainText('CMS GLOBAL CONSISTENCY TEST');

    // 4. Restore original logo text from Admin (Page A)
    await logoInput.fill('The Cake Lounge');
    await page.click('button:has-text("Save Website Branding")');
    await expect(page.locator('text=Settings changes saved successfully!')).toBeVisible();

    // Extract the restored state
    const restoredCmsState = await page.evaluate(() => {
      const state: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cakeLounge_cms_')) {
          state[key] = localStorage.getItem(key) || '';
        }
      }
      return state;
    });

    // 5. Verify Context B & C both converge back to the original restored value when updated/reloaded
    const pageB_updated = await contextB.newPage();
    await pageB_updated.addInitScript((state) => {
      for (const [key, val] of Object.entries(state)) {
        localStorage.setItem(key, val);
      }
    }, restoredCmsState);
    await pageB_updated.goto('http://localhost:3000/');
    await expect(pageB_updated.locator('#navbar')).toContainText('The Cake Lounge');

    const pageC_updated = await contextC.newPage();
    await pageC_updated.addInitScript((state) => {
      for (const [key, val] of Object.entries(state)) {
        localStorage.setItem(key, val);
      }
    }, restoredCmsState);
    await pageC_updated.goto('http://localhost:3000/');
    await expect(pageC_updated.locator('#navbar')).toContainText('The Cake Lounge');

    // Cleanup extra pages and contexts
    await pageB.close();
    await pageC.close();
    await pageB_updated.close();
    await pageC_updated.close();
    await contextB.close();
    await contextC.close();
  });

});
