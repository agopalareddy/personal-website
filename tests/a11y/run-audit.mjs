#!/usr/bin/env node
/**
 * Runs axe-core accessibility audits via Playwright.
 * Usage: node tests/a11y/run-audit.mjs <url> <output-json-path>
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'fs';

const url = process.argv[2];
const outputPath = process.argv[3];

if (!url || !outputPath) {
  console.error('Usage: node run-audit.mjs <url> <output-json-path>');
  process.exit(1);
}

console.log(`Auditing: ${url}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved results to: ${outputPath}`);

  const violations = results.violations;
  if (violations.length === 0) {
    console.log('✅ 0 violations found!');
  } else {
    console.log(`❌ ${violations.length} violation(s) found:`);
    violations.forEach((v, i) => {
      console.log(`  ${i + 1}. [${v.id}] ${v.help} — ${v.nodes.length} node(s)`);
      v.nodes.forEach((n, j) => {
        console.log(`     ${j + 1}. ${n.target.join(' ')}`);
        if (n.failureSummary) {
          console.log(`        ${n.failureSummary}`);
        }
      });
    });
  }

  process.exit(violations.length > 0 ? 1 : 0);
} finally {
  await browser.close();
}
