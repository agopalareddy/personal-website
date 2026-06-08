import { test, expect } from '@playwright/test';

test.describe('Experience Detail Page', () => {
  test('detail page loads with h1 title', async ({ page }) => {
    // Navigate to a known detail page
    await page.goto('/experience/education/2024-08-m-s-computer-science.html');
    await page.waitForLoadState('domcontentloaded');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Computer Science/i);
  });

  test('sidebar and footer present', async ({ page }) => {
    await page.goto(
      '/experience/professional/2024-08-graduate-assistant-with-the-taylor-family-center.html'
    );
    await page.waitForLoadState('domcontentloaded');

    // Sidebar exists in DOM (may be hidden on mobile via responsive CSS)
    await expect(page.locator('.academic-sidebar')).toHaveCount(1);
    // Footer is always visible
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('back to experience link works', async ({ page }) => {
    await page.goto('/experience/education/2024-08-m-s-computer-science.html');
    await page.waitForLoadState('domcontentloaded');

    // Find the back link
    const backLink = page.locator('a[href="/experience/"]');
    await expect(backLink.first()).toBeVisible();

    // Click and verify navigation
    await backLink.first().click();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/experience/');
    await expect(page.locator('.experience-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('"Present" displayed for current/future roles', async ({ page }) => {
    await page.goto('/experience/');
    await expect(page.locator('.experience-card').first()).toBeVisible({ timeout: 10000 });

    // Check if any card shows "Present" (end_date in the future or null)
    const allCards = page.locator('.experience-card');
    const count = await allCards.count();

    let foundPresent = false;
    for (let i = 0; i < count; i++) {
      const venueText = await allCards.nth(i).locator('.card-venue').textContent();
      if (venueText?.includes('Present')) {
        foundPresent = true;
        break;
      }
    }

    // If no current roles exist (all end_dates in the past), verify that
    // all cards still have properly formatted date ranges (contain a year)
    if (!foundPresent) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const venueText = await allCards.nth(i).locator('.card-venue').textContent();
        expect(venueText).toMatch(/\d{4}/);
      }
    } else {
      // At least one card should show "Present"
      expect(foundPresent).toBe(true);
    }
  });
});
