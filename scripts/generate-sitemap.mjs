#!/usr/bin/env node
// Replaces generate_site.py's generate_sitemap() (research.md R5). Writes
// sitemap.xml at the repo root from the build's own route manifest —
// scripts/experience_database.json / projects_database.json stay the single
// source of truth; adding an entry there and rebuilding is the only step
// needed to keep the sitemap current (FR-009, SC-002).
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE_ROOT = "https://agreddy.com";

// Hand-authored pages not yet migrated off scripts/generate_site.py
// (User Story 3, T034-T038/T043) — still real, still served, still belong
// in the sitemap during the mixed-stack transition (FR-013).
const LEGACY_STATIC_PAGES = ["/", "/accessibility.html", "/availability/", "/cv/"];

function pathToUrl(repoRelativePath) {
  if (repoRelativePath.endsWith("/index.html")) {
    return `${SITE_ROOT}/${repoRelativePath.slice(0, -"index.html".length)}`;
  }
  return `${SITE_ROOT}/${repoRelativePath}`;
}

function main() {
  const manifestPath = resolve(REPO_ROOT, "assets/site/route-manifest.json");
  const routes = JSON.parse(readFileSync(manifestPath, "utf-8"));

  const urls = [...LEGACY_STATIC_PAGES.map((p) => `${SITE_ROOT}${p}`), ...routes.map(pathToUrl)];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`),
    "</urlset>",
  ];

  const outPath = resolve(REPO_ROOT, "sitemap.xml");
  writeFileSync(outPath, lines.join("\n") + "\n");
  console.log(`[generate-sitemap] wrote ${urls.length} URLs to ${outPath}`);
}

main();
