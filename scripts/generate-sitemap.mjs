#!/usr/bin/env node
// Replaces generate_site.py's generate_sitemap() (research.md R5). Writes
// sitemap.xml at the repo root from the build's own route manifest —
// scripts/experience_database.json / projects_database.json stay the single
// source of truth; adding an entry there and rebuilding is the only step
// needed to keep the sitemap current (FR-009, SC-002).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE_ROOT = 'https://agreddy.com';

// nginx's error_page 404 target — a real route, deliberately excluded from
// the sitemap (search engines shouldn't index the error page), matching the
// original SITEMAP_STATIC_PAGES list which never included it either.
const EXCLUDED_FROM_SITEMAP = new Set(['404.html']);

function pathToUrl(repoRelativePath) {
  if (repoRelativePath === 'index.html' || repoRelativePath.endsWith('/index.html')) {
    return `${SITE_ROOT}/${repoRelativePath.slice(0, -'index.html'.length)}`;
  }
  return `${SITE_ROOT}/${repoRelativePath}`;
}

function main() {
  const manifestPath = resolve(REPO_ROOT, 'assets/site/route-manifest.json');
  const routes = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const urls = routes.filter((route) => !EXCLUDED_FROM_SITEMAP.has(route)).map(pathToUrl);

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`),
    '</urlset>',
  ];

  const outPath = resolve(REPO_ROOT, 'sitemap.xml');
  writeFileSync(outPath, lines.join('\n') + '\n');
  console.log(`[generate-sitemap] wrote ${urls.length} URLs to ${outPath}`);
}

main();
