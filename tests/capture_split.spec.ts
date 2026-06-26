import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = 'verification/audit';

if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

test.describe('Final Visual Audit', () => {
    test.setTimeout(180000);

    test('capture menu', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('http://localhost:3001/menu', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'menu_desktop.png') });
    });

    test('capture category', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('http://localhost:3001/shop/birthday-cakes', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'category_desktop_v3.png') });
    });

    test('capture custom', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('http://localhost:3001/custom-cake', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'custom_cake_desktop_v3.png') });
    });

    test('capture home mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(AUDIT_DIR, 'home_mobile_v3.png') });
    });
});
