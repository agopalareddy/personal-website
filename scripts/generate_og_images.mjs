// Renders images/projects/<slug>.png OG cards from projects_database.json.
// Run after editing project data: node scripts/generate_og_images.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const BASE_DIR = dirname(SCRIPT_DIR);
const OUT_DIR = join(BASE_DIR, 'images', 'projects');
const WIDTH = 1200;
const HEIGHT = 630;

const projects = JSON.parse(readFileSync(join(SCRIPT_DIR, 'projects_database.json'), 'utf8'));

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function cardHtml(project) {
  const tags = (project.technologies || [])
    .slice(0, 5)
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #e6edf3;
  }
  .eyebrow { font-size: 28px; color: #58a6ff; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 24px; }
  h1 { font-size: 64px; line-height: 1.15; font-weight: 700; margin-bottom: 32px; }
  .tags { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; }
  .tag { font-size: 24px; padding: 8px 20px; border: 1px solid #30363d; border-radius: 999px; color: #c9d1d9; }
  .byline { font-size: 26px; color: #8b949e; }
</style></head>
<body>
  <div class="eyebrow">${escapeHtml(project.category || 'Project')}</div>
  <h1>${escapeHtml(project.title)}</h1>
  <div class="tags">${tags}</div>
  <div class="byline">Aadarsha Gopala Reddy &middot; agreddy.com</div>
</body></html>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
  });

  for (const project of projects) {
    const slug = project.permalink.split('/').pop();
    await page.setContent(cardHtml(project));
    await page.screenshot({ path: join(OUT_DIR, `${slug}.png`) });
    console.log(`✓ ${slug}.png`);
  }

  await browser.close();
}

main();
