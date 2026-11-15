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

  test('timeline groups experiences by completion or receipt year', async ({ page }) => {
    const msHeaderYear = await page
      .locator('.experience-card', { hasText: 'M.S. Computer Science' })
      .evaluate((card) => {
        let node = card.previousElementSibling;
        while (node) {
          if (node.classList.contains('timeline-year')) {
            return node.textContent?.trim();
          }
          node = node.previousElementSibling;
        }
        return null;
      });

    expect(msHeaderYear).toBe('2026');
  });

  test('leadership cards include organization context in titles', async ({ page }) => {
    await expect(page.locator('#exp-2025-08-member .project-title a')).toHaveText('Member - GSAAB');
  });

  test('year headers show how many entries each year holds', async ({ page }) => {
    const header = page.locator('#year-2026');
    await expect(header).toHaveText('2026');

    // The count is printed by CSS from data-count, so the heading text stays the year.
    const expected = await page.locator('.experience-card[data-year="2026"]').count();
    await expect(header).toHaveAttribute(
      'data-count',
      `${expected} ${expected === 1 ? 'entry' : 'entries'}`
    );
  });

  test('the whole row is a link to the detail page', async ({ page }) => {
    const row = page.locator('#exp-2025-08-member');
    const box = await row.boundingBox();
    expect(box).not.toBeNull();

    // Click the row's bottom-right corner — well away from the title text.
    await row.click({ position: { x: box!.width - 12, y: box!.height - 8 } });
    await page.waitForURL(/\/experience\/leadership\/2025-08-member\.html$/);
  });

  test('clicking a card navigates to detail page', async ({ page }) => {
    // Click the first card's detail link
    const firstLink = page.locator('.experience-card a').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('/experience/');

    await firstLink.click({ force: true });
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

  test('jump-to-year links follow the filtered list and scroll to a year header', async ({
    page,
  }) => {
    const jumpNav = page.locator('#tocContainer');
    const yearLinks = page.locator('#tocList .toc-year-header');

    // One link per year header in the list, in the same order.
    await expect(jumpNav).toBeVisible();
    const headerYears = await page.locator('.timeline-year').allTextContents();
    expect(headerYears.length).toBeGreaterThan(1);
    await expect(yearLinks).toHaveText(headerYears);

    // Nothing to jump between when no entries match.
    const searchInput = page.locator('#experienceSearch');
    await searchInput.fill('zzzznonexistent');
    await expect(jumpNav).toBeHidden();

    await searchInput.fill('');
    await expect(jumpNav).toBeVisible();

    // Alphabetical order has no year groups, so no jump links either.
    await page.locator('#experienceSort').selectOption('title-asc');
    await expect(page.locator('.timeline-year')).toHaveCount(0);
    await expect(jumpNav).toBeHidden();
    await page.locator('#experienceSort').selectOption('date-desc');

    // Following a link lands on that year's header.
    const lastLink = yearLinks.last();
    const href = await lastLink.getAttribute('href');
    expect(href).toMatch(/^#year-\d{4}$/);
    await lastLink.click();
    expect(page.url()).toContain(href || '');
    await expect(page.locator(href || '')).toBeInViewport();
  });
});
