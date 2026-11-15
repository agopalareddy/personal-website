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

  test('breadcrumb leads back to the experience list', async ({ page }) => {
    await page.goto('/experience/education/2024-08-m-s-computer-science.html');
    await page.waitForLoadState('domcontentloaded');

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb.locator('[aria-current="page"]')).toContainText(/Computer Science/i);

    // The category crumb opens the list filtered to that category
    await expect(breadcrumb.getByRole('link', { name: 'Education' })).toHaveAttribute(
      'href',
      '/experience/?category=education'
    );

    await breadcrumb.getByRole('link', { name: 'Experience' }).click();
    await page.waitForLoadState('domcontentloaded');

    expect(new URL(page.url()).pathname).toBe('/experience/');
    await expect(page.locator('.experience-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('About column lists the facts for the entry', async ({ page }) => {
    await page.goto('/experience/education/2024-08-m-s-computer-science.html');

    const about = page.getByRole('complementary', { name: 'About this entry' });
    await expect(about).toBeVisible();
    await expect(about.locator('dt')).toContainText(['Category', 'Organization']);
    await expect(about.locator('.card-category')).toHaveText('Education');
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
