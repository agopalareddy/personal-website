import { test, expect } from '@playwright/test';

test.describe('CV PDF preview', () => {
  test.skip(({ isMobile }) => isMobile, 'Preview opens PDF in a new tab on narrow viewports');

  test('Preview button loads the modal without a failure message', async ({ page }) => {
    await page.goto('/cv/');

    const preview = page
      .locator('button.modal-trigger[data-doc-src="/files/reddy_cv.pdf"]')
      .first();
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
