import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('actions sit in the first screen with one primary button', async ({ page }) => {
    const actions = page.locator('.home-actions');
    await expect(actions.locator('.btn-primary')).toHaveCount(1);
    await expect(actions.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', /\.pdf$/);
    await expect(actions.getByRole('link', { name: /Book a meeting/ })).toBeVisible();
    await expect(page.locator('#main-content .btn-primary')).toHaveCount(1);
  });

  test('"Email me" becomes a mailto link without the address being in the HTML', async ({
    page,
    request,
  }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toContain('mailto:');

    const email = page.locator('.home-actions .protected-email');
    await expect(email).toHaveAttribute('href', /^mailto:/);
  });

  test('four featured projects, each card linking to its page', async ({ page }) => {
    const pins = page.locator('.home-pin');
    await expect(pins).toHaveCount(4);

    const first = pins.first();
    const href = await first.locator('.home-pin-title a').getAttribute('href');
    expect(href).toBeTruthy();

    // The whole card is the link target, not just the title text
    const box = await first.boundingBox();
    await first.click({ position: { x: box!.width - 8, y: box!.height - 8 } });
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  });

  test('skills show the first areas and expand to all of them', async ({ page }) => {
    const groups = page.locator('.home-skill-group');
    const toggle = page.locator('.home-skills-toggle');

    await expect(groups).toHaveCount(8);
    await expect(groups.locator('visible=true')).toHaveCount(4);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveText(/^Show all \d+$/);

    await toggle.click();
    await expect(groups.locator('visible=true')).toHaveCount(8);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveText('Show fewer');

    await toggle.click();
    await expect(groups.locator('visible=true')).toHaveCount(4);
  });

  test('phones show the profile as one compact row with icon links', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only layout');

    const card = page.locator('.author-avatar-wrapper');
    const box = await card.boundingBox();
    expect(box!.height).toBeLessThanOrEqual(130);

    // Icon-only links keep their names for assistive tech and stay tappable
    const links = card.locator('.author-links a');
    await expect(links).toHaveCount(3);
    await expect(card.getByRole('link', { name: /LinkedIn/ })).toBeVisible();
    await expect(card.getByRole('link', { name: /GitHub/ })).toBeVisible();
    for (const link of await links.all()) {
      const b = await link.boundingBox();
      expect(b!.width).toBeGreaterThanOrEqual(44);
      expect(b!.height).toBeGreaterThanOrEqual(44);
    }
    await expect(card.locator('.author-links a.protected-email svg')).toHaveCount(1);
  });
});
