import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = 'verification/audit';

if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

test.describe('Final Visual Audit', () => {
    test.setTimeout(120000);

    test('capture missing views simple', async ({ page }) => {
        // Desktop Menu
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('http://localhost:3001/menu', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'menu_desktop.png'), fullPage: true });

        // Category Desktop
        await page.goto('http://localhost:3001/shop/birthday-cakes', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'category_desktop_v2.png'), fullPage: true });

        // Custom Cake Desktop
        await page.goto('http://localhost:3001/custom-cake', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'custom_cake_desktop_v2.png'), fullPage: true });

        // Mobile Home
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'home_mobile_v2.png'), fullPage: true });
    });
});
