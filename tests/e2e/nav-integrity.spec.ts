import { test, expect } from '@playwright/test';

/** The 5 primary nav links that should appear on every page */
const NAV_ITEMS = [
  { text: 'Home', href: '/' },
  { text: 'Experience', href: '/experience/' },
  { text: 'Projects', href: '/projects/' },
  { text: 'CV/Resume', href: '/cv/' },
  { text: 'Availability', href: '/availability/' },
];

test.describe('Navigation Integrity', () => {
  test('Experience link in nav on homepage', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav.nav-links');
    const experienceLink = nav.locator('a[href="/experience/"]');
    await expect(experienceLink).toBeVisible();
    await expect(experienceLink).toContainText('Experience');
  });

  test('Experience link in nav on projects page', async ({ page }) => {
    await page.goto('/projects/');
    const nav = page.locator('nav.nav-links');
    const experienceLink = nav.locator('a[href="/experience/"]');
    await expect(experienceLink).toBeVisible();
    await expect(experienceLink).toContainText('Experience');
  });

  test('Experience link in nav on CV page', async ({ page }) => {
    await page.goto('/cv/');
    const nav = page.locator('nav.nav-links');
    const experienceLink = nav.locator('a[href="/experience/"]');
    await expect(experienceLink).toBeVisible();
    await expect(experienceLink).toContainText('Experience');
  });

  test('all 5 nav items present on every page type', async ({ page }) => {
    const pagesToCheck = ['/', '/experience/', '/projects/', '/cv/', '/availability/'];

    for (const path of pagesToCheck) {
      await page.goto(path);
      const nav = page.locator('nav.nav-links');

      for (const item of NAV_ITEMS) {
        const link = nav.locator(`a[href="${item.href}"]`);
        await expect(link, `Missing nav link "${item.text}" on ${path}`).toBeVisible();
        await expect(link, `Nav link "${item.text}" wrong text on ${path}`).toContainText(
          item.text
        );
      }
    }
  });
});
