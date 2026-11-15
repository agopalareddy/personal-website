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

      // The redirects live in the nginx config (infra/nginx/sites-enabled/showcase),
      // so a plain local static server (python -m http.server) can't exercise them.
      // Skip only when the server says it is one: production strips its Server
      // header, so "is it nginx?" would skip there too and never test anything.
      const server = (await response?.headerValue('server')) ?? '';
      test.skip(
        /SimpleHTTP|Python/i.test(server),
        `needs the nginx redirects; this is a plain file server ("${server}")`
      );

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
