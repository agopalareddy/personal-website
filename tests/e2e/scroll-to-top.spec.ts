import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const nextFrame = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())))
  );

/**
 * Scroll far down the page, then back up a little. On wide screens the button
 * shows as soon as the page is scrolled past its threshold; on phones it only
 * shows while scrolling up, so the second step is what reveals it there.
 */
async function scrollDownThenUp(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 9999, behavior: 'instant' }));
  await nextFrame(page);
  await page.evaluate(() => window.scrollBy({ top: -120, behavior: 'instant' }));
}

// Long enough to scroll at both configured viewports (desktop 1280x720, mobile 375x667).
const SCROLLABLE_PAGE = '/experience/';
// Short enough to fit a normal viewport with no scrolling.
const SHORT_PAGE = '/404.html';

test.describe('Scroll to top button', () => {
  test('hidden at top of a scrollable page, appears on scroll, returns to top on click, hides again', async ({
    page,
  }) => {
    await page.goto(SCROLLABLE_PAGE);
    const button = page.locator('#scroll-to-top');

    await expect(button).not.toHaveClass(/is-visible/);

    await scrollDownThenUp(page);
    await expect(button).toHaveClass(/is-visible/);

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
    await expect(button).not.toHaveClass(/is-visible/);
  });

  test('on phones it stays hidden while scrolling down and shows when scrolling back up', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only behavior');

    await page.goto(SCROLLABLE_PAGE);
    const button = page.locator('#scroll-to-top');

    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    await nextFrame(page);
    await expect(button).not.toHaveClass(/is-visible/);

    await page.evaluate(() => window.scrollBy({ top: -120, behavior: 'instant' }));
    await expect(button).toHaveClass(/is-visible/);

    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }));
    await expect(button).not.toHaveClass(/is-visible/);
  });

  test('is keyboard-operable with a visible focus outline', async ({ page }) => {
    await page.goto(SCROLLABLE_PAGE);
    const button = page.locator('#scroll-to-top');

    await scrollDownThenUp(page);
    await expect(button).toHaveClass(/is-visible/);

    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');

    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
  });

  test('never shows on a page that does not scroll', async ({ page }) => {
    await page.goto(SHORT_PAGE);

    const isScrollable = await page.evaluate(
      () => document.documentElement.scrollHeight > document.documentElement.clientHeight + 1
    );
    test.skip(
      isScrollable,
      `${SHORT_PAGE} is scrollable at this viewport — pick a shorter fixture`
    );

    const button = page.locator('#scroll-to-top');
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
    await expect(button).not.toHaveClass(/is-visible/);
  });

  test('becomes available once a resize makes the page scrollable', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 2000 });
    await page.goto(SHORT_PAGE);

    const button = page.locator('#scroll-to-top');
    await expect(button).not.toHaveClass(/is-visible/);

    // Short enough that the fixture's ~567px content clears both the
    // scrollability check and the show/hide scroll threshold.
    await page.setViewportSize({ width: 1280, height: 100 });
    await scrollDownThenUp(page);
    await expect(button).toHaveClass(/is-visible/);
  });

  test('does not overlap site navigation chrome', async ({ page, viewport }) => {
    await page.goto(SCROLLABLE_PAGE);
    const button = page.locator('#scroll-to-top');
    // The nav row: a top bar on wide screens, a bottom tab bar on phones.
    const nav = page.locator('.top-header .top-bar');

    await scrollDownThenUp(page);
    await expect(button).toHaveClass(/is-visible/);

    const buttonBox = await button.boundingBox();
    const navBox = await nav.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(navBox).not.toBeNull();

    if (buttonBox && navBox) {
      const overlaps =
        buttonBox.x < navBox.x + navBox.width &&
        buttonBox.x + buttonBox.width > navBox.x &&
        buttonBox.y < navBox.y + navBox.height &&
        buttonBox.y + buttonBox.height > navBox.y;
      expect(
        overlaps,
        `button overlaps nav at viewport ${viewport?.width}x${viewport?.height}`
      ).toBe(false);
    }
  });

  test('has no axe-core violations in either visibility state', async ({ page }) => {
    await page.goto(SCROLLABLE_PAGE);

    const hiddenResults = await new AxeBuilder({ page })
      .include('#scroll-to-top')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(hiddenResults.violations).toEqual([]);

    await scrollDownThenUp(page);
    await page.locator('#scroll-to-top').waitFor({ state: 'visible' });

    const visibleResults = await new AxeBuilder({ page })
      .include('#scroll-to-top')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(visibleResults.violations).toEqual([]);
  });
});
