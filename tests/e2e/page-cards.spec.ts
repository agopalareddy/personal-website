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
  test('documents are list rows whose title links to the PDF', async ({ page }) => {
    await page.goto('/cv/');

    const rows = page.locator('.document-row.catalog-row');
    await expect(rows).toHaveCount(2);

    for (const [index, src] of ['/files/reddy_cv.pdf', '/files/reddy_resume.pdf'].entries()) {
      const row = rows.nth(index);
      const title = row.locator('.project-title a');
      // A real link, so it works without JavaScript and on phones
      await expect(title).toHaveAttribute('href', src);
      await expect(row.locator('.project-title')).toHaveCSS('border-bottom-width', '0px');
      await expect(row.getByRole('link', { name: /in a new tab/ })).toHaveAttribute('href', src);
      await expect(row.getByRole('link', { name: /^Download / })).toHaveAttribute('download', '');
    }
  });

  test('clicking anywhere on a row opens the preview on wide screens', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) <= 640, 'Phones follow the link to the PDF instead');
    await page.goto('/cv/');

    const row = page.locator('.document-row').nth(1);
    const box = await row.boundingBox();
    await row.click({ position: { x: box!.width - 24, y: 12 } });

    const dialog = page.locator('#document-modal');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('#document-modal-title')).toHaveText('Resume');
    expect(new URL(page.url()).pathname).toBe('/cv/');
  });

  test('the row links are not swallowed by the row click', async ({ page }) => {
    await page.goto('/cv/');
    const download = page.waitForEvent('download');
    await page
      .locator('.document-row')
      .first()
      .getByRole('link', { name: /^Download / })
      .click();
    expect((await download).suggestedFilename()).toBe('reddy_cv.pdf');
    await expect(page.locator('#document-modal')).toBeHidden();
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
