import { test, expect } from '@playwright/test';

test.describe('Experience Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experience/');
    // Wait for JS-rendered cards to appear
    await expect(page.locator('.experience-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('loads and renders 30+ cards', async ({ page }) => {
    const cards = page.locator('.experience-card');
    await expect(cards).toHaveCount(await cards.count());
    expect(await cards.count()).toBeGreaterThanOrEqual(30);
  });

  test('category filter narrows results', async ({ page }) => {
    const allCards = page.locator('.experience-card');
    const initialCount = await allCards.count();

    // Click "Education" filter
    const eduFilter = page.locator('.filter-btn[data-filter="education"]');
    await eduFilter.click();

    // Card count should drop
    const filteredCards = page.locator('.experience-card');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);

    // All visible cards should have the education category badge
    for (let i = 0; i < filteredCount; i++) {
      const badge = filteredCards.nth(i).locator('.card-category');
      await expect(badge).toContainText(/Education/i);
    }
  });

  test('search filters by text', async ({ page }) => {
    const searchInput = page.locator('#experienceSearch');
    await searchInput.fill('WashU');

    // Wait for results to update
    await page.waitForTimeout(300);

    const cards = page.locator('.experience-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // All visible cards should reference WashU in their text content
    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).textContent();
      expect(text?.toLowerCase()).toMatch(/wash|washington/i);
    }
  });

  test('sort dropdown reorders cards (date-asc)', async ({ page }) => {
    // Select "Oldest First"
    await page.locator('#experienceSort').selectOption('date-asc');
    await page.waitForTimeout(300);

    const cards = page.locator('.experience-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Extract date strings from card-venue spans
    const dates: string[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const venue = await cards.nth(i).locator('.card-venue').textContent();
      dates.push(venue || '');
    }

    // First card's year should be <= last card's year (ascending order)
    const firstYear = parseInt(dates[0].match(/\d{4}/)?.[0] || '0');
    const lastYear = parseInt(dates[dates.length - 1].match(/\d{4}/)?.[0] || '9999');
    expect(firstYear).toBeLessThanOrEqual(lastYear);
  });

  test('clicking a card navigates to detail page', async ({ page }) => {
    // Click the first card's detail link
    const firstLink = page.locator('.experience-card a').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('/experience/');

    await firstLink.click();
    await page.waitForLoadState('domcontentloaded');

    // URL should have changed to a detail page
    expect(page.url()).toContain('/experience/');
    // Detail page should have an h1
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('empty state appears when no matches', async ({ page }) => {
    const searchInput = page.locator('#experienceSearch');
    await searchInput.fill('zzzznonexistent');
    await page.waitForTimeout(300);

    // No cards visible
    await expect(page.locator('.experience-card')).toHaveCount(0);

    // Empty state should be visible
    const emptyState = page.locator('#emptyState');
    await expect(emptyState).toBeVisible();
  });

  test('keyboard navigation: Tab through filter pills, Enter to activate, aria-pressed toggles', async ({
    page,
  }) => {
    // Focus the first filter pill (should be "All" with active class)
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    await expect(allFilter).toHaveAttribute('aria-pressed', 'true');

    // Tab to the next filter (Education) and press Enter
    const eduFilter = page.locator('.filter-btn[data-filter="education"]');
    await eduFilter.focus();
    await page.keyboard.press('Enter');

    // Education should now be pressed
    await expect(eduFilter).toHaveAttribute('aria-pressed', 'true');
    // All should no longer be pressed
    await expect(allFilter).toHaveAttribute('aria-pressed', 'false');
  });

  test('aria-pressed updates on filter activation/deactivation through click', async ({ page }) => {
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    const researchFilter = page.locator('.filter-btn[data-filter="research"]');

    // Initially "All" is active
    await expect(allFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(researchFilter).toHaveAttribute('aria-pressed', 'false');

    // Click Research
    await researchFilter.click();
    await expect(researchFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(allFilter).toHaveAttribute('aria-pressed', 'false');

    // Click All again to toggle back
    await allFilter.click();
    await expect(allFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(researchFilter).toHaveAttribute('aria-pressed', 'false');
  });
});
