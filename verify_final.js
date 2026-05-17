const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://localhost:5500'; // Assuming local server
  const pages = ['index.html', 'menu.html', 'custom-cake.html', 'checkout.html'];
  const viewports = [
    { name: 'desktop', width: 1200, height: 800 },
    { name: 'mobile', width: 375, height: 667 }
  ];

  const outputDir = path.join(__dirname, 'verification_final');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const pageName of pages) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `file://${path.join(__dirname, pageName)}`;
      await page.goto(url);

      // Wait for content
      await page.waitForTimeout(1000);

      const screenshotPath = path.join(outputDir, `${pageName.replace('.html', '')}_${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: vp.name === 'desktop' });
      console.log(`Saved ${screenshotPath}`);

      if (vp.name === 'mobile') {
        // Check for horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        if (overflow) {
          console.error(`ERROR: Horizontal overflow detected on ${pageName} at ${vp.width}px`);
        } else {
          console.log(`SUCCESS: No horizontal overflow on ${pageName} at ${vp.width}px`);
        }

        // Check for hamburger menu
        const hamburger = await page.locator('.hamburger').isVisible();
        console.log(`Hamburger visible on ${pageName} mobile: ${hamburger}`);
      }
    }
  }

  await browser.close();
})();
