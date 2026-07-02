# Site Generator Pipeline

`scripts/generate_site.py` is the central content generation script. It reads JSON databases and writes HTML output for both projects and experience sections.

## Source: `scripts/generate_site.py` (~51 KB)

### Capabilities

| Flag            | What it generates                                   |
| --------------- | --------------------------------------------------- |
| `--experiences` | Detail pages in `experience/{category}/{slug}.html` |
| `--projects`    | Detail pages in `projects/{slug}.html`              |
| (always runs)   | `sitemap.xml`                                       |

Both flags update the inline JSON/JS payload in the corresponding listing page (`projects/index.html`, `experience/index.html`).

### Experience generation

1. Reads `scripts/experience_database.json`
2. For each entry, writes a detail HTML page using shared chrome from `scripts.chrome`
3. Runs `sync_experience_listing_page()` to:
   - Replace the `<script type="application/json" class="experiences-data">` payload
   - Replace the `<noscript>` fallback cards
   - Preserve hand-authored chrome (TOC sidebar, filter controls, etc.)

### Project generation

1. Reads `scripts/projects_database.json`
2. For entries with `has_detail: True`, writes a detail HTML page
3. Runs `update_project_catalog_array()` to regex-replace the JSON array inside `<script type="application/json" class="projects-data">` in `projects/index.html`

### Sitemap

Generates `sitemap.xml` covering all public pages, referenced by `robots.txt`.

### Shared chrome module

Source: `scripts/chrome.py`

Provides pure functions (no I/O, no side effects) for rendering the four chrome regions:

- `render_head()` — meta tags, favicons, stylesheets, OG/Twitter cards
- `render_nav()` — sticky navigation with active page detection
- `render_sidebar()` — academic sidebar with avatar, bio, links
- `render_footer()` — copyright, theme toggle placeholder

Also exports `NAV_ITEMS` — a tuple of `(page_id, href, label, icon_html)` — that defines global navigation.

### Change guidance

- **⚠️ Never edit generated HTML pages directly.** All `experience/` and `projects/` detail
  pages are regenerated from JSON databases and will silently overwrite manual edits. Always
  update `scripts/experience_database.json` or `scripts/projects_database.json` first, then
  regenerate. The single exception is the listing pages (`experience/index.html`,
  `projects/index.html`) which contain hand-authored TOC/filter chrome that the generator
  must preserve — changes to those pages' body content still go through the JSON databases.
- Version bumps for `style.css`, `font-awesome`, `theme.js`, and `status-badge.js` must
  happen in `scripts/chrome.py` — not in individual HTML files.
- After running the generator, always `git diff` to catch unintended rewrites (e.g. whitespace, version bumps).
- The generator must be run whenever the JSON databases change.
- If you change the HTML template in `chrome.py` or the generator, regenerate all pages and check for regressions.

## CV Parser

Source: `scripts/cv_parser.py` (~44 KB)

Reads LaTeX CV source and outputs structured JSON.

### Input

LaTeX file with custom environments defined in `reddy_cv.sty`. Environments include:

| Environment         | Args | Content                                  |
| ------------------- | ---- | ---------------------------------------- |
| `educationentry`    | 3    | Degree, Institution, Date                |
| `researchentry`     | 5    | Title, Org, Location, Dates              |
| `experienceentry`   | 4    | Position, Org, Location, Dates           |
| `leadershipentry`   | 2    | Org, Location (+ nested `positionentry`) |
| `presentationentry` | 4    | Date, Title, Venue, Univ                 |
| `honorentry`        | 2    | Date, Honor Name                         |

### Schema contract

`scripts/experience_schema.md` documents every LaTeX environment, its arguments, how it maps to JSON, and which fields are optional. **Read this file before modifying the parser.**

### Output

Writes `scripts/experience_database.json` — the input for `generate_site.py --experiences`.

### Why two pipelines?

1. CV parser: LaTeX → structured JSON (transforms one format to another)
2. Site generator: JSON → HTML pages (surfaces content on the web)

This separation means the CV can remain the source of truth while the website can have content that isn't on the CV (e.g. extra project descriptions).

## Navigation Updater

Source: `scripts/update_nav.py` (~7 KB)

Bulk-updates navigation bars across all HTML files. Preserves the active nav state.

Use this when adding, removing, or renaming top-level pages — it saves editing every HTML file by hand.

## Source map

- `scripts/generate_site.py`
- `scripts/chrome.py`
- `scripts/cv_parser.py`
- `scripts/update_nav.py`
- `scripts/experience_schema.md`
- `scripts/projects_database.json`
- `scripts/experience_database.json`
- Git: `bf95bd6 feat: add Presentations category`
