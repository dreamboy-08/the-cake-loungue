import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Premium Storefront Visual QA Screenshot Capture', () => {
  const outputDir = path.join(process.cwd(), 'public', 'qa-screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    test(`Capture views for ${vp.name}`, async ({ page }) => {
      // Increase timeout for this visual capture test
      test.setTimeout(120000);

      // Set viewport
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Home Page
      await page.goto('http://localhost:3000/?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `home_${vp.name}.png`), fullPage: true });

      // 2. Menu / Product Listing
      await page.goto('http://localhost:3000/menu?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `menu_${vp.name}.png`), fullPage: true });

      // 3. Category Page (Birthday Cakes)
      await page.goto('http://localhost:3000/menu?category=birthday-cakes&bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `category_${vp.name}.png`), fullPage: true });

      // 4. Product Detail (Royal Raspberry Birthday Cake - ID 1)
      await page.goto('http://localhost:3000/shop/1?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `product_detail_${vp.name}.png`), fullPage: true });

      // 5. Wishlist
      await page.goto('http://localhost:3000/wishlist?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `wishlist_${vp.name}.png`), fullPage: true });

      // 6. Profile
      await page.goto('http://localhost:3000/profile?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `profile_${vp.name}.png`), fullPage: true });

      // 7. Orders
      await page.goto('http://localhost:3000/orders?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `orders_${vp.name}.png`), fullPage: true });

      // 8. Checkout
      await page.goto('http://localhost:3000/checkout?bypass=true');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, `checkout_${vp.name}.png`), fullPage: true });

      // 9. Search Bar Overlay (Interacted)
      await page.goto('http://localhost:3000/?bypass=true');
      await page.waitForTimeout(500);
      const searchTrigger = page.locator('button[aria-label="Toggle search"]');
      if (await searchTrigger.isVisible()) {
        await searchTrigger.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outputDir, `search_opened_${vp.name}.png`) });
      }

      // 10. Cart Drawer Overlay (Interacted)
      await page.goto('http://localhost:3000/?bypass=true');
      await page.waitForTimeout(500);
      const cartTrigger = page.locator('button[aria-label="View Cart"]');
      if (await cartTrigger.isVisible()) {
        await cartTrigger.click({ force: true });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outputDir, `cart_opened_${vp.name}.png`) });
      }

      // 11. Mobile Navigation Menu Overlay (Mobile only)
      if (vp.name === 'mobile') {
        await page.goto('http://localhost:3000/?bypass=true');
        await page.waitForTimeout(500);
        const menuTrigger = page.locator('button[aria-label="Open menu"]');
        if (await menuTrigger.isVisible()) {
          await menuTrigger.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(outputDir, `mobile_menu_opened.png`) });
        }
      }
    });
  }
});
