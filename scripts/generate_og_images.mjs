// Renders images/projects/<slug>.png OG cards from projects_database.json,
// plus images/og-default.jpg, the site-wide card.
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

/** The site-wide card: used by every page that has no card of its own. */
function siteCardHtml() {
  const avatar = readFileSync(join(BASE_DIR, 'images', 'profile-640.jpg')).toString('base64');
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    display: flex; align-items: center; gap: 64px;
    padding: 80px; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #e6edf3;
  }
  img { width: 300px; height: 300px; border-radius: 50%; border: 2px solid #30363d; flex: none; }
  h1 { font-size: 64px; line-height: 1.15; font-weight: 700; margin-bottom: 24px; }
  .role { font-size: 32px; line-height: 1.35; color: #c9d1d9; margin-bottom: 32px; }
  .byline { font-size: 26px; color: #58a6ff; font-weight: 600; }
</style></head>
<body>
  <img src="data:image/jpeg;base64,${avatar}" alt="">
  <div>
    <h1>Aadarsha Gopala Reddy</h1>
    <div class="role">IT Training Specialist, University of Florida<br>M.S. Computer Science, WashU</div>
    <div class="byline">agreddy.com</div>
  </div>
</body></html>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  // Software rendering: the cards are flat, and GPU capture fails in sandboxes.
  const browser = await chromium.launch({ args: ['--disable-gpu'] });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
  });

  for (const project of projects) {
    const slug = project.permalink.split('/').pop();
    await page.setContent(cardHtml(project));
    await page.screenshot({ path: join(OUT_DIR, `${slug}.png`) });
    console.log(`✓ ${slug}.png`);
  }

  await page.setContent(siteCardHtml());
  // JPEG: the card holds a photo, which PNG stores at about five times the size.
  await page.screenshot({
    path: join(BASE_DIR, 'images', 'og-default.jpg'),
    type: 'jpeg',
    quality: 88,
  });
  console.log('✓ og-default.jpg');

  await browser.close();
}

main();
