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

    const email = page.locator('.protected-email', { hasText: 'Email me' });
    await expect(email).toHaveCount(1);
    await expect(email).toHaveAttribute('href', /^mailto:/);
  });

  test('the tab title is the name alone', async ({ page }) => {
    await expect(page).toHaveTitle('Aadarsha Gopala Reddy');
  });

  test('the first heading on the page is the h1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    const first = page.locator('h1, h2, h3, h4, h5, h6').first();
    expect(await first.evaluate((el) => el.tagName)).toBe('H1');
  });

  test('phones show both buttons in the first screen, and the name once', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) >= 768, 'Phone-only layout');

    for (const name of ['Resume', /Book a meeting/]) {
      const box = await page.locator('.home-actions').getByRole('link', { name }).boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
    }

    // The profile card gives the name; the greeting stays for assistive tech only
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveText(/Aadarsha/);
    const size = await h1.boundingBox();
    expect(size!.width).toBeLessThanOrEqual(1);
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

  test('skill links search whole words and find something', async ({ page }) => {
    // Every link is a search of one list; all but SQL search whole words
    for (const href of await page
      .locator('.home-skill-list a')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(href).toMatch(/^\/(projects|experience)\/\?q=(%22[^%]|sql$)/);
    }

    // "Java" opens the Java projects, not every JavaScript one
    await page.getByRole('link', { name: 'Java', exact: true }).click();
    const rows = page.locator('#projectGrid .catalog-row:visible');
    await expect(rows.first()).toBeVisible();
    const searched = await rows.evaluateAll((rs) =>
      rs.map((r) => (r as HTMLElement).dataset.search)
    );
    for (const text of searched) expect(text).toMatch(/(^|[^a-z0-9])java([^a-z0-9]|$)/);
  });

  test('skills show the first areas and expand to all of them', async ({ page }) => {
    const groups = page.locator('.home-skill-group');
    const toggle = page.locator('.home-skills-toggle');

    await expect(groups).toHaveCount(8);
    await expect(groups.locator('visible=true')).toHaveCount(4);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Unanchored: the committed HTML is formatted, so the label has whitespace around it
    await expect(toggle).toHaveText(/Show all \d+/);

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
