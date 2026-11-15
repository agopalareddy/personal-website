import { test, expect } from '@playwright/test';

test.describe('Availability page', () => {
  test('calendar sits in a card whose header carries the one primary button', async ({ page }) => {
    await page.goto('/availability/');

    const card = page.getByRole('region', { name: /Week view/ });
    await expect(card).toBeVisible();
    const frame = card.locator('iframe[title="Weekly availability calendar"]');
    await expect(frame).toHaveAttribute('src', /mode=WEEK/);
    // No pinned zone: the embed then shows times in the visitor's time zone,
    // which is what the card header promises.
    await expect(frame).not.toHaveAttribute('src', /ctz=/);
    await expect(card).toContainText('Your local time');

    const book = card.getByRole('link', { name: /Book a meeting/ });
    await expect(book).toHaveClass(/btn-primary/);
    await expect(page.locator('#main-content .btn-primary')).toHaveCount(1);
  });
});

test.describe('CV page', () => {
  test('each card has one primary action and no rule under its title', async ({
    page,
    viewport,
  }) => {
    await page.goto('/cv/');

    const cards = page.locator('.document-row');
    await expect(cards).toHaveCount(2);

    for (const card of await cards.all()) {
      await expect(card.locator('.btn-primary')).toHaveCount(1);
      await expect(card.locator('.document-row-title')).toHaveCSS('border-bottom-width', '0px');
      await expect(card.locator('.document-row-actions')).toHaveCSS('border-top-width', '0px');
      await expect(card.getByRole('link', { name: /Open .* PDF/ })).toBeVisible();

      // Phones open the PDF in a new tab either way, so Preview is dropped there
      const preview = card.getByRole('button', { name: 'Preview' });
      if ((viewport?.width ?? 1280) <= 640) {
        await expect(preview).toBeHidden();
      } else {
        await expect(preview).toBeVisible();
      }
    }
  });
});

test.describe('Project detail page', () => {
  test('breadcrumb, title and About column', async ({ page }) => {
    await page.goto('/projects/ms-thesis.html');

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/projects/'
    );
    await expect(page.locator('h1')).toHaveCount(1);

    const about = page.getByRole('complementary', { name: 'About this project' });
    await expect(about.locator('dt')).toContainText(['Category', 'Dates', 'Built with']);
  });
});
