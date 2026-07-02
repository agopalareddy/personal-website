# Catalog Rendering Engines

Both the projects and experience listing pages use client-side JavaScript renderers that transform inline JSON payloads into interactive card grids.

## Project Catalog

Source: `assets/js/projects-catalog.js` (~33 KB)

### Data flow

1. `scripts/projects_database.json` is the source of truth.
2. `scripts/generate_site.py --projects` writes generated detail pages and updates the JSON payload inside `<script type="application/json" class="projects-data">` in `projects/index.html`.
3. `projects-catalog.js` reads this inline JSON and renders cards with filtering, sorting, and search.

### Features

- **Filter**: Category filter buttons with `aria-pressed` state
- **Search**: Keyword search against title, excerpt, technologies
- **Sort**: Date descending/ascending
- **Empty state**: Shown when filters match zero projects
- **XSS protection**: `textContent` assignment, HTML-escaping helper

### Dual-source caveat

Historically, `AGENTS.md` warns of two copies of the project list:

1. `scripts/projects_database.json`
2. The hardcoded `const projects = [...]` array at the top of `projects-catalog.js`

Check whether both need updating when adding or modifying a project entry.

## Experience Catalog

Source: `assets/js/experience-catalog.js` (~24 KB)

### Data flow

1. CV LaTeX → `cv_parser.py` → `scripts/experience_database.json`
2. `generate_site.py --experiences` writes detail pages and updates the `experiences` variable in `experience/index.html`
3. `experience-catalog.js` renders from the `experiences` global

### Features

- **Category filters** (Education, Professional, Research, Leadership, Awards, Presentations)
- **Org filter**: Dropdown populated from experience entries
- **Year filter**: Dropdown populated from experience entries
- **Sort**: Date descending/ascending
- **Search**: Keyword search
- **Timeline grouping**: Cards grouped by year with timeline dots
- **Empty state**: Shown when filters match zero entries
- **SSR fallback**: The listing page has `<noscript>` and `<script.experiences-data>` that are removed once JS renders

### Category colors

Each experience category has a distinct timeline dot color (defined in CSS, driven by a `data-category` attribute).

### Change guidance

- Both catalog scripts rely on the inline JSON/JS payload matching the expected schema.
- If you change the schema in `projects_database.json` or `experience_database.json`, update both the generator and the JS renderer.
- After changes, run the Playwright listing tests for both desktop and mobile.
- Recent fix: `6084ad6` refactored projects-catalog to DOM API (replaced innerHTML with createElement).

## Source map

- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`
- `scripts/projects_database.json`
- `scripts/experience_database.json`
- `scripts/generate_site.py`
- Git: `6084ad6`, `c064a2f`, `bf95bd6`
