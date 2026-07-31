import { test, expect } from '@playwright/test';

test.describe('Search Bar UX Interaction', () => {
  test('should open, close on outside click, remain open on inside interaction, and show no close "X" button', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Load the home page
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000); // Allow complete hydration

    // 2. Identify the Search button and verify the search container is hidden initially
    const searchToggle = page.locator('button[aria-label="Toggle search"]');
    await expect(searchToggle).toBeVisible();

    const searchInput = page.locator('input[placeholder="Search for cakes, categories, or flavors..."]');
    await expect(searchInput).not.toBeVisible();

    // 3. Click the Search icon to open search
    await searchToggle.click();
    await page.waitForTimeout(500); // Wait for transition animation
    await expect(searchInput).toBeVisible();

    // 4. Verify that there is NO "X" (close) icon on the search toggle button
    // It should contain the Search icon, not the X icon.
    const hasXIcon = await searchToggle.locator('svg.lucide-x').count();
    expect(hasXIcon).toBe(0);

    const hasSearchIcon = await searchToggle.locator('svg.lucide-search').count();
    expect(hasSearchIcon).toBeGreaterThan(0);

    // 5. Type into the search input to trigger suggestions
    await searchInput.fill('Chocolate');
    await page.waitForTimeout(1000); // Wait for search debouncing and suggestions to render

    // Verify suggestions dropdown is visible
    const suggestionItem = page.locator('h4:has-text("Chocolate")').first();
    await expect(suggestionItem).toBeVisible();

    // 6. Click inside the search input/container and verify search stays open
    await searchInput.click();
    await page.waitForTimeout(500);
    await expect(searchInput).toBeVisible();

    // 7. Click inside the suggestions list and verify search stays open
    const firstSuggestion = page.locator('div.animate-fade-in div.group').first();
    await expect(firstSuggestion).toBeVisible();
    await firstSuggestion.hover(); // Hover to simulate interacting
    await page.waitForTimeout(500);
    await expect(searchInput).toBeVisible();

    // 8. Click outside the search area (e.g. on the Navbar logo) to close search
    const logoLink = page.locator('a:has-text("The Cake")');
    await logoLink.click();
    await page.waitForTimeout(500); // Wait for close transition animation

    // Verify search container is closed/hidden
    await expect(searchInput).not.toBeVisible();

    // 9. Open it again and verify clicking another outside element closes it too
    await searchToggle.click();
    await page.waitForTimeout(500);
    await expect(searchInput).toBeVisible();

    // Click outside on the body at a coordinate outside the search bar
    await page.mouse.click(10, 500);
    await page.waitForTimeout(500);
    await expect(searchInput).not.toBeVisible();

    console.log('Search Bar UX interactions verified successfully!');
  });
});
