import { test, expect } from '@playwright/test';

test.describe('Homepage smoke test', () => {
  test('loads the homepage and title contains Aadarsha', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Aadarsha/);
    await expect(page.locator('body')).toHaveCSS('opacity', '1');
  });
});
