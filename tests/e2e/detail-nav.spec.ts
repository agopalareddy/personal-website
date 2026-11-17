import { test, expect } from '@playwright/test';

const THESIS_PROJECT = '/projects/ms-thesis.html';
const THESIS_RESEARCH =
  '/experience/research/2025-08-toward-vehicle-agnostic-driving-signatures-for.html';

test.describe('Detail page links', () => {
  test('a project and the experience entries about it link to each other', async ({ page }) => {
    await page.goto(THESIS_PROJECT);
    const related = page.locator('.detail-related');
    await expect(related.getByRole('heading', { name: 'Related' })).toBeVisible();
    await expect(related.locator(`a[href="${THESIS_RESEARCH}"]`)).toHaveCount(1);

    await page.goto(THESIS_RESEARCH);
    await expect(page.locator(`.detail-related a[href="${THESIS_PROJECT}"]`)).toHaveCount(1);
  });

  test('newer and older links step through the list', async ({ page }) => {
    await page.goto('/projects/connect-4-ai.html');
    const pager = page.getByRole('navigation', { name: 'More projects' });
    await expect(pager.locator('a')).toHaveCount(2);
    await expect(pager.locator('a').first()).toContainText('Newer');

    const older = pager.locator('.detail-pager-link--older');
    await expect(older).toContainText('Older');
    const href = await older.getAttribute('href');
    expect(href).toMatch(/^\/projects\/[a-z0-9-]+\.html$/);

    // Going older and then newer returns to where we started
    await older.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await page
      .getByRole('navigation', { name: 'More projects' })
      .locator('a', { hasText: 'Newer' })
      .click();
    await expect(page).toHaveURL(/\/projects\/connect-4-ai\.html$/);
  });

  test('the newest entry in a list has no "Newer" link', async ({ page }) => {
    await page.goto('/experience/professional/2026-12-it-training-specialist.html');
    const pager = page.getByRole('navigation', { name: 'More in Professional' });
    await expect(pager.locator('a')).toHaveCount(1);
    await expect(pager.locator('a')).toContainText('Older');
  });

  test('a project figure loads, with alt text and a caption', async ({ page }) => {
    await page.goto('/projects/connect-4-ai.html');
    const img = page.locator('.detail-figure img');
    await expect(img).toHaveAttribute('alt', /.{20,}/);
    await expect(img).toHaveAttribute('width', /^\d+$/);
    await expect(img).toHaveAttribute('height', /^\d+$/);
    await expect(img).toHaveJSProperty('complete', true);
    expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.detail-figure figcaption')).not.toBeEmpty();
  });

  test('a pipeline figure is text in stages, not an image', async ({ page }) => {
    await page.goto('/projects/ms-thesis.html');
    const figure = page.locator('.detail-figure');
    await expect(figure.locator('img')).toHaveCount(0);
    await expect(figure.locator('.pipeline-stage')).toHaveCount(3);
    await expect(figure.locator('figcaption')).not.toBeEmpty();
    // Readable on a phone: steps keep the body's small size
    const size = await figure
      .locator('.pipeline-steps li')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(14);
  });

  test('the lead facts show once: under the title on phones, in the About column otherwise', async ({
    page,
    viewport,
  }) => {
    const isPhone = (viewport?.width ?? 1280) < 768;
    await page.goto(THESIS_PROJECT);

    const strip = page.locator('.detail-meta');
    const columnLead = page.locator('.detail-about-item--lead');
    expect(await columnLead.count()).toBeGreaterThan(0);

    if (isPhone) {
      await expect(strip).toBeVisible();
      await expect(columnLead.first()).toBeHidden();
      // The paper link is above the prose, not below it
      const link = (await strip.getByRole('link', { name: /Paper/ }).boundingBox())!;
      const prose = (await page.locator('.detail-main').boundingBox())!;
      expect(link.y).toBeLessThan(prose.y);
      expect(link.height).toBeGreaterThanOrEqual(44);
    } else {
      await expect(strip).toBeHidden();
      await expect(columnLead.first()).toBeVisible();
    }
    await expect(page.locator('.card-category:visible')).toHaveCount(1);
  });

  test('a long title drops a size on phones', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only layout');

    const titleSize = async (url: string) => {
      await page.goto(url);
      return page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    };
    const long = await titleSize(THESIS_PROJECT);
    const short = await titleSize('/projects/connect-4-ai.html');
    expect(long).toBeLessThan(short);
  });
});
