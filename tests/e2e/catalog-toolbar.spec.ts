import { test, expect } from '@playwright/test';

const visibleCards = '.project-card:visible';

test.describe('Catalog toolbar', () => {
  test('a link with filters this page does not offer still shows results', async ({ page }) => {
    await page.goto('/projects/?q=python&year=1999&group=nope&sort=sideways');

    // Unknown values are dropped from the address, not applied
    await expect(page).toHaveURL(/\/projects\/\?q=python$/);
    await expect(page.locator('#venueFilter')).toHaveValue('all');
    await expect(page.locator('#projectSort')).toHaveValue('date-desc');

    const shown = await page.locator(visibleCards).count();
    expect(shown).toBeGreaterThan(0);
    await expect(page.locator('#resultsCount')).toContainText(String(shown));
  });

  test('years are reached by jumping, not by a filter', async ({ page }) => {
    await page.goto('/projects/');
    await expect(page.locator('[data-role="year-filter"]')).toHaveCount(0);
    expect(await page.locator('#tocList .toc-year-header').count()).toBeGreaterThan(1);
  });

  test('tab counts follow the search', async ({ page }) => {
    await page.goto('/projects/');
    const tabCount = (filter: string) =>
      page.locator(`.filter-btn[data-filter="${filter}"] .filter-count`);
    const total = Number(await tabCount('all').textContent());

    await page.locator('#projectSearch').fill('python');
    const shown = await page.locator(visibleCards).count();
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(total);
    await expect(tabCount('all')).toHaveText(String(shown));

    // The category tabs add up to "All"
    const counts = await page
      .locator('.filter-btn:not([data-filter="all"]) .filter-count')
      .allTextContents();
    expect(counts.map(Number).reduce((a, b) => a + b, 0)).toBe(shown);

    // A tab's count is what picking it shows
    const firstCategory = page.locator('.filter-btn:not([data-filter="all"])').first();
    const expected = Number(await firstCategory.locator('.filter-count').textContent());
    await firstCategory.click();
    await expect(page.locator(visibleCards)).toHaveCount(expected);

    await page.locator('#projectSearch').fill('');
    await expect(tabCount('all')).toHaveText(String(total));
  });

  test('on phones the tab strip fades at the edge that has more tabs', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only layout');

    await page.goto('/experience/');
    const strip = page.locator('.catalog-tabs');
    await expect(strip).toHaveAttribute('data-fade', 'end');

    // Opening on the last tab scrolls the strip to it
    await page.goto('/experience/?category=awards');
    await expect(strip).toHaveAttribute('data-fade', 'start');
    const stripBox = (await strip.boundingBox())!;
    const tabBox = (await page.locator('.filter-btn.active').boundingBox())!;
    expect(tabBox.x).toBeGreaterThanOrEqual(stripBox.x);
    expect(tabBox.x + tabBox.width).toBeLessThanOrEqual(stripBox.x + stripBox.width + 1);
  });

  test('on a 320px screen nothing in the toolbar or tab bar is cut off', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only layout');

    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/projects/');

    // Each dropdown gets a full line, wide enough for its label
    const group = (await page.locator('#venueFilter').boundingBox())!;
    const sort = (await page.locator('#projectSort').boundingBox())!;
    expect(sort.y).toBeGreaterThan(group.y + group.height - 1);
    expect(group.width).toBeGreaterThan(250);

    // All five tabs of the bottom bar fit without scrolling
    const nav = page.locator('.nav-links');
    expect(await nav.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0);
    const last = (await nav.locator('.nav-link').last().boundingBox())!;
    expect(last.x + last.width).toBeLessThanOrEqual(320);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(0);
  });
});
