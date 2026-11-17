import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// The Accessibility page promises 4.5:1 for body text in every colour mode.
// Dark dimmed needs help to get there (see the unlayered block at the top of
// assets/css/style.css), so every theme is checked rather than assumed.

const THEMES = ['light', 'light_high_contrast', 'dark', 'dark_dimmed', 'dark_high_contrast'];

// One page of each kind: links in prose, category labels of every colour,
// detail-page links, and the availability status badge.
const PAGES = [
  '/',
  '/experience/',
  '/projects/',
  '/projects/connect-4-ai.html',
  '/availability/',
  '/accessibility.html',
];

test.describe('Colour contrast', () => {
  for (const theme of THEMES) {
    test(`text meets WCAG AA contrast in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('color-scheme', value), theme);

      for (const url of PAGES) {
        await page.goto(url);
        // The booking calendar on Availability is Google's embed. Its colours are
        // not ours to set, and it only loads when Google is reachable.
        const results = await new AxeBuilder({ page })
          .exclude('iframe')
          .withRules(['color-contrast'])
          .analyze();
        const failures = results.violations.flatMap((violation) =>
          violation.nodes.map((node) => `${node.target.join(' ')}: ${node.failureSummary}`)
        );
        expect(failures, `${url} in ${theme}`).toEqual([]);
      }
    });
  }
});
