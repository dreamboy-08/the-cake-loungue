import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('measure performance and payload', async ({ page }) => {
  const images: string[] = [];
  let totalTransferSize = 0;

  page.on('request', request => {
    if (request.resourceType() === 'image') {
      images.push(request.url());
    }
  });

  page.on('response', response => {
    if (response.request().resourceType() === 'image') {
      const size = response.headers()['content-length'];
      if (size) {
        totalTransferSize += parseInt(size, 10);
      }
    }
  });

  console.log('--- Home Page ---');
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000); // Wait for lazy images if any

  const lcpHome = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 5000);
    });
  });

  console.log(`Home LCP: ${lcpHome}ms`);
  console.log(`Home Image Count: ${images.length}`);
  console.log(`Home Total Image Payload: ${(totalTransferSize / 1024).toFixed(2)} KB`);

  // Reset for Menu Page
  images.length = 0;
  totalTransferSize = 0;

  console.log('\n--- Menu Page ---');
  await page.goto('http://localhost:3001/menu');
  await page.waitForTimeout(2000);

  const lcpMenu = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 5000);
    });
  });

  console.log(`Menu LCP: ${lcpMenu}ms`);
  console.log(`Menu Image Count: ${images.length}`);
  console.log(`Menu Total Image Payload: ${(totalTransferSize / 1024).toFixed(2)} KB`);
});
