import { test, expect } from '@playwright/test';

const KB = 1024;

test.describe('Page weight', () => {
  test('the avatar is a small image, not the original photo', async ({ page, request }) => {
    await page.goto('/');
    const avatar = page.locator('.author-avatar');
    await expect(avatar).toHaveAttribute('src', /\/images\/profile-\d+\.webp$/);

    const srcset = (await avatar.getAttribute('srcset')) ?? '';
    const candidates = srcset.split(',').map((c) => c.trim().split(/\s+/)[0]);
    expect(candidates.length).toBeGreaterThan(1);
    for (const url of candidates) {
      const body = await (await request.get(url)).body();
      expect(body.length, url).toBeLessThan(30 * KB);
    }
  });

  test('the theme script is a few KB, with no UI library in it', async ({ page, request }) => {
    await page.goto('/');
    const src = await page.locator('script[src*="/assets/site/assets/theme-"]').getAttribute('src');
    expect(src).toBeTruthy();
    const body = await (await request.get(src!)).body();
    expect(body.length).toBeLessThan(10 * KB);
  });

  test('link previews use the wide card image', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/images\/og-default\.jpg$/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
  });

  test('stylesheets and scripts are served compressed', async ({ page, request }) => {
    const home = await page.goto('/');
    // Compression is set in the nginx config (infra/nginx/conf.d/compression.conf),
    // so a plain local static server (python -m http.server) can't exercise it.
    const server = (await home?.headerValue('server')) ?? '';
    test.skip(/SimpleHTTP|Python/i.test(server), `local static server ("${server}")`);

    const theme = await page
      .locator('script[src*="/assets/site/assets/"]')
      .first()
      .getAttribute('src');
    for (const url of ['/assets/css/primer/primer.css', '/assets/css/style.css', theme!]) {
      const response = await request.get(url, { headers: { 'Accept-Encoding': 'gzip' } });
      expect(response.status(), url).toBe(200);
      expect(response.headers()['content-encoding'], url).toBe('gzip');
    }
  });
});
