import { test, expect } from '@playwright/test';

test.describe('Theme Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme picker according to viewport size', async ({ page, viewport }) => {
    const isMobile = viewport && viewport.width < 768;
    const headerPicker = page.locator('#theme-toggle .theme-picker');
    const footerPicker = page.locator('#theme-toggle-footer .theme-picker');

    if (isMobile) {
      await expect(footerPicker).toBeVisible();
      await expect(headerPicker).toBeHidden();
    } else {
      await expect(headerPicker).toBeVisible();
      await expect(footerPicker).toBeHidden();
    }
  });

  test('should toggle color-scheme and light/dark theme attributes when selecting options', async ({ page, viewport }) => {
    const isMobile = viewport && viewport.width < 768;
    const picker = page.locator(isMobile ? '#theme-toggle-footer .theme-picker' : '#theme-toggle .theme-picker');
    const summary = picker.locator('summary');
    
    // Open picker
    await summary.click();
    await expect(picker).toHaveAttribute('open', '');

    // Select light theme option
    const lightOption = picker.locator('button[data-theme-value="light"]');
    await lightOption.click();

    // Expect details to close
    await expect(picker).not.toHaveAttribute('open');

    // Assert attributes on <html>
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-color-mode', 'light');
    await expect(html).toHaveAttribute('data-light-theme', 'light');

    // Assert localStorage value
    const localStorageVal = await page.evaluate(() => localStorage.getItem('color-scheme'));
    expect(localStorageVal).toBe('light');
  });

  test('should support keyboard navigation (Escape key closes picker)', async ({ page, viewport }) => {
    const isMobile = viewport && viewport.width < 768;
    const picker = page.locator(isMobile ? '#theme-toggle-footer .theme-picker' : '#theme-toggle .theme-picker');
    const summary = picker.locator('summary');

    // Open
    await summary.click();
    await expect(picker).toHaveAttribute('open', '');

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(picker).not.toHaveAttribute('open');
  });

  test('should migrate legacy theme keys', async ({ page }) => {
    // Set legacy localStorage theme key and reload
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      localStorage.removeItem('color-scheme');
    });
    
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-color-mode', 'dark');
    await expect(html).toHaveAttribute('data-dark-theme', 'dark');

    // Assert legacy key is deleted and migrated
    const migrated = await page.evaluate(() => localStorage.getItem('color-scheme'));
    const legacy = await page.evaluate(() => localStorage.getItem('theme'));
    expect(migrated).toBe('dark');
    expect(legacy).toBeNull();
  });
});
