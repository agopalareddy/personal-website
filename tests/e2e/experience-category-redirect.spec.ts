import { test, expect } from '@playwright/test';

const CATEGORIES = [
  'awards',
  'education',
  'leadership',
  'presentations',
  'professional',
  'research',
] as const;

test.describe('Experience category folder redirects', () => {
  for (const category of CATEGORIES) {
    test(`/experience/${category}/ redirects to catalog filter`, async ({ page }) => {
      const response = await page.goto(`/experience/${category}/`, {
        waitUntil: 'domcontentloaded',
      });

      // Must not land on a raw nginx 403
      expect(response?.status()).not.toBe(403);
      await expect(page.locator('body')).not.toContainText('403 Forbidden');

      await expect(page).toHaveURL(new RegExp(`/experience/\\?category=${category}$`));
      await expect(page.locator('h1, .page-intro-title').first()).toBeVisible();

      const activeFilter = page.locator(`.filter-btn.active[data-filter="${category}"]`);
      await expect(activeFilter).toBeVisible({ timeout: 10000 });
    });
  }
});
