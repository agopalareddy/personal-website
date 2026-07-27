// Build-time static-render entry point (research.md R1). Renders React page
// components to static HTML via react-dom/server and writes them to the
// exact repo-root paths nginx already serves (research.md R2) — no dist/,
// no infra change (FR-010). Client-side "islands" (research.md R1/R3) are
// bundled separately by Vite and their <script> tags injected here.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";

import { loadProjects } from "../src/content/loadProjects.ts";
import { loadExperience } from "../src/content/loadExperience.ts";
import { ProjectCatalogPage } from "../src/pages/ProjectCatalog.tsx";
import { ProjectDetailPage } from "../src/pages/ProjectDetail.tsx";
import { ExperienceCatalogPage } from "../src/pages/ExperienceCatalog.tsx";
import { ExperienceDetailPage } from "../src/pages/ExperienceDetail.tsx";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** Runs the Vite client build for hydration islands; returns the manifest. */
async function buildIslands() {
  await build({ configFile: resolve(REPO_ROOT, "vite.config.ts") });
  const manifestPath = resolve(REPO_ROOT, "assets/site/.vite/manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
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
  const html = `<!doctype html>\n${body.replace("</body>", `${islandTags.join("")}</body>`)}`;
  const fullPath = resolve(REPO_ROOT, outPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, html);
  return outPath;
}

async function main() {
  const manifest = await buildIslands();
  const themeIsland = islandScriptTag(manifest, "src/islands/theme.tsx");

  const projects = loadProjects();
  const written = [];

  // Calling these as plain functions (not JSX) is safe here — none of them
  // use hooks themselves (only the client-side ThemePicker island does),
  // so there's no Rules-of-Hooks concern, and it keeps this orchestrator
  // file JSX-free.
  written.push(
    renderPage(ProjectCatalogPage({ projects }), "projects/index.html", [themeIsland]),
  );

  for (const p of projects) {
    if (!p.has_detail) continue;
    const slug = p.permalink.replace(/^\/projects\//, "");
    written.push(
      renderPage(ProjectDetailPage({ p }), `projects/${slug}.html`, [themeIsland]),
    );
  }

  const experiences = loadExperience();

  written.push(
    renderPage(ExperienceCatalogPage({ entries: experiences }), "experience/index.html", [themeIsland]),
  );

  for (const e of experiences) {
    // Unlike projects, generate_site.py writes an experience detail page for
    // every entry regardless of has_detail (that flag is checked for
    // projects but never for experience) — matched here for parity.
    written.push(
      renderPage(
        ExperienceDetailPage({ e }),
        `experience/${e.category}/${e.id}.html`,
        [themeIsland],
      ),
    );
  }

  // Route manifest for scripts/generate-sitemap.mjs (research.md R5) — the
  // sitemap is derived from exactly what this build wrote, never hand-maintained.
  writeFileSync(
    resolve(REPO_ROOT, "assets/site/route-manifest.json"),
    JSON.stringify(written, null, 2),
  );

  console.log(`[render] wrote ${written.length} file(s):`);
  for (const path of written) console.log(`  - ${path}`);
}

main().catch((err) => {
  console.error("[render] build failed:", err);
  process.exit(1);
});
