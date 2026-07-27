// Build-time static-render entry point (research.md R1). Renders React page
// components to static HTML via react-dom/server and writes them to the
// exact repo-root paths nginx already serves (research.md R2) — no dist/,
// no infra change (FR-010). Client-side "islands" (research.md R1/R3) are
// bundled separately by Vite and their <script> tags injected here.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'vite';

import { loadProjects } from '../src/content/loadProjects.ts';
import { loadExperience } from '../src/content/loadExperience.ts';
import { buildProjectJsonLd } from '../src/content/projectSeo.ts';
import { ProjectCatalogPage } from '../src/pages/ProjectCatalog.tsx';
import { ProjectDetailPage } from '../src/pages/ProjectDetail.tsx';
import { ExperienceCatalogPage } from '../src/pages/ExperienceCatalog.tsx';
import { ExperienceDetailPage } from '../src/pages/ExperienceDetail.tsx';
import { HomePage } from '../src/pages/Home.tsx';
import { CvHubPage } from '../src/pages/CvHub.tsx';
import { AvailabilityPage } from '../src/pages/Availability.tsx';
import { AccessibilityPage } from '../src/pages/Accessibility.tsx';
import { NotFoundPage } from '../src/pages/NotFound.tsx';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

/** Runs the Vite client build for hydration islands; returns the manifest. */
async function buildIslands() {
  await build({ configFile: resolve(REPO_ROOT, 'vite.config.ts') });
  const manifestPath = resolve(REPO_ROOT, 'assets/site/.vite/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  return manifest;
}

function islandScriptTag(manifest, entryKey) {
  const entry = manifest[entryKey];
  if (!entry) throw new Error(`No manifest entry for "${entryKey}" — check vite.config.ts input`);
  return `<script type="module" src="/assets/site/${entry.file}"></script>`;
}

/** Renders one page element to a static HTML file at `outPath` (repo-relative). */
function renderPage(element, outPath, islandTags) {
  const body = renderToStaticMarkup(element);
  const html = `<!doctype html>\n${body.replace('</body>', `${islandTags.join('')}</body>`)}`;
  const fullPath = resolve(REPO_ROOT, outPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, html);
  return outPath;
}

async function main() {
  const manifest = await buildIslands();
  const themeIsland = islandScriptTag(manifest, 'src/islands/theme.tsx');
  const emailProtectionIsland = islandScriptTag(manifest, 'src/islands/email-protection.ts');
  const cvModalIsland = islandScriptTag(manifest, 'src/islands/cv-modal.ts');
  const catalogFilterIsland = islandScriptTag(manifest, 'src/islands/catalog-filter.ts');

  // Loaded on every page — the protected-email markup in Sidebar/Footer/etc.
  // needs this decoder to become a working mailto: link with JS enabled.
  const commonIslands = [themeIsland, emailProtectionIsland];

  const projects = loadProjects();
  const written = [];

  // Calling these as plain functions (not JSX) is safe here — none of them
  // use hooks themselves (only the client-side ThemePicker island does),
  // so there's no Rules-of-Hooks concern, and it keeps this orchestrator
  // file JSX-free.
  written.push(
    renderPage(ProjectCatalogPage({ projects }), 'projects/index.html', [
      ...commonIslands,
      catalogFilterIsland,
    ])
  );

  for (const p of projects) {
    if (!p.has_detail) continue;
    const slug = p.permalink.replace(/^\/projects\//, '');

    // Per-project OG image: falls back to the site avatar until a screenshot
    // is dropped at images/projects/<slug>.png — no code change needed then.
    const projectImagePath = resolve(REPO_ROOT, 'images', 'projects', `${slug}.png`);
    const ogImage = existsSync(projectImagePath)
      ? `https://agreddy.com/images/projects/${slug}.png`
      : 'https://agreddy.com/images/profile.png';
    const canonicalUrl = `https://agreddy.com${p.permalink}.html`;
    const jsonLd = buildProjectJsonLd(p, canonicalUrl, ogImage);

    written.push(
      renderPage(ProjectDetailPage({ p, ogImage, jsonLd }), `projects/${slug}.html`, commonIslands)
    );
  }

  const experiences = loadExperience();

  written.push(
    renderPage(ExperienceCatalogPage({ entries: experiences }), 'experience/index.html', [
      ...commonIslands,
      catalogFilterIsland,
    ])
  );

  for (const e of experiences) {
    // Unlike projects, generate_site.py writes an experience detail page for
    // every entry regardless of has_detail (that flag is checked for
    // projects but never for experience) — matched here for parity.
    written.push(
      renderPage(
        ExperienceDetailPage({ e }),
        `experience/${e.category}/${e.id}.html`,
        commonIslands
      )
    );
  }

  written.push(renderPage(HomePage(), 'index.html', commonIslands));
  written.push(renderPage(CvHubPage(), 'cv/index.html', [...commonIslands, cvModalIsland]));
  written.push(renderPage(AvailabilityPage(), 'availability/index.html', commonIslands));
  written.push(renderPage(AccessibilityPage(), 'accessibility.html', commonIslands));
  written.push(renderPage(NotFoundPage(), '404.html', commonIslands));

  // Route manifest for scripts/generate-sitemap.mjs (research.md R5) — the
  // sitemap is derived from exactly what this build wrote, never hand-maintained.
  writeFileSync(
    resolve(REPO_ROOT, 'assets/site/route-manifest.json'),
    JSON.stringify(written, null, 2)
  );

  // Read-only JSON mirror of both catalogs at /data/ so agents/tools can
  // consume structured data directly instead of scraping HTML (llms.txt
  // points here).
  mkdirSync(resolve(REPO_ROOT, 'data'), { recursive: true });
  writeFileSync(resolve(REPO_ROOT, 'data/projects.json'), JSON.stringify(projects, null, 2) + '\n');
  writeFileSync(
    resolve(REPO_ROOT, 'data/experience.json'),
    JSON.stringify(experiences, null, 2) + '\n'
  );

  console.log(`[render] wrote ${written.length} file(s):`);
  for (const path of written) console.log(`  - ${path}`);
}

main().catch((err) => {
  console.error('[render] build failed:', err);
  process.exit(1);
});
