import { test, expect } from '@playwright/test';

test('each CV page row shows a page-1 thumbnail, its sections and page count', async ({ page }) => {
  await page.goto('/cv/');
  const rows = page.locator('.document-row');
  await expect(rows).toHaveCount(2);
  for (const row of await rows.all()) {
    const thumb = row.locator('img.document-thumb');
    await thumb.scrollIntoViewIfNeeded();
    await expect(thumb).toHaveJSProperty('complete', true);
    expect(await thumb.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(row.locator('.document-sections')).toContainText('·');
    await expect(row.locator('.row-tech')).toHaveText(/PDF · \d+ pages?/);
  }
});

test.describe('CV PDF preview', () => {
  // cv-modal.ts opens the PDF in a new tab instead of the dialog at <= 640px.
  test.skip(
    ({ viewport }) => (viewport?.width ?? 1280) <= 640,
    'Preview opens the PDF in a new tab on narrow viewports'
  );

  test('Preview button loads the modal without a failure message', async ({ page }) => {
    await page.goto('/cv/');

    const preview = page.locator('.modal-trigger[data-doc-src="/files/reddy_cv.pdf"]').first();
    await expect(preview).toBeVisible();
    await preview.click();

    const dialog = page.locator('#document-modal');
    await expect(dialog).toBeVisible();

    // Either canvases render, or we surface an explicit failure link.
    // The MIME/worker bug produced the failure text — assert it stays gone.
    await expect(dialog.locator('.pdf-error-fallback')).toHaveCount(0, { timeout: 15000 });
    await expect(dialog.locator('canvas.pdf-page').first()).toBeVisible({ timeout: 15000 });
  });
});
