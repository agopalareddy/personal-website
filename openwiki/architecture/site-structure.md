# Repository Architecture

This repository is a static personal website with a shared chrome layer and several generated content families. The public site is served directly from the repository checkout; there is no app server or build pipeline for production rendering.

## High-level structure

The repository separates content into a few broad areas:

- **Landing and navigation**: `index.html`, `404.html`, `accessibility.html`
- **Project catalog**: `projects/index.html` plus generated detail pages in `projects/`
- **Experience catalog**: `experience/index.html` plus generated detail pages in `experience/`
- **Document hub**: `cv/` and `files/`
- **Shared assets**: `assets/css/`, `assets/js/`, `assets/fonts/`
- **Content sources and generators**: `scripts/`
- **Tests**: `tests/`
- **Production ops**: `infra/nginx/`

The README’s tree view is accurate at a high level, but the important architectural fact is that the site mixes hand-authored pages with generated detail pages and JS-rendered listing pages.

## Page families

### Homepage and top-level pages

`index.html` is the main portfolio entry point. It uses the same shared nav, sidebar, theme toggle, and card surfaces as the rest of the site. The homepage is optimized for fast scanning and route selection.

`availability/index.html`, `cv/index.html`, and `accessibility.html` are top-level utility pages. They use the same design system but serve different visitor intents.

### Projects

`projects/index.html` is both a catalog and an interaction surface. It contains inline JSON payload data that `assets/js/projects-catalog.js` turns into cards, filters, and sort behavior. Project detail pages are generated into `projects/{slug}.html` by `scripts/generate_site.py` when the project database changes.

Evidence from `scripts/projects_database.json` and the generated file content shows that projects are a curated product of two layers:

- structured source data in JSON
- rendered detail HTML with expanded descriptions and media

### Experience

`experience/index.html` works similarly, but with a more complex data model. It supports multiple categories such as education, professional, research, leadership, presentations, and awards. `assets/js/experience-catalog.js` handles search, filtering, sorting, org/year filtering, and timeline grouping.

The generated detail pages in `experience/<category>/<slug>.html` are produced from the experience database and CV parsing pipeline. The listing page keeps an SSR fallback payload and a noscript fallback so the content remains available before JS runs.

### Shared chrome

Most pages share a chrome pattern that includes:

- primary navigation
- an academic sidebar / author profile block
- footer and document metadata
- theme slider
- content cards and detail panels

The shared chrome is a strong clue that the site is designed as a coherent portfolio system rather than a set of disconnected pages.

## Shared JS modules

### `assets/js/theme.js`

Implements the three-state theme slider: light, device/system, and dark. It writes resolved theme state to document attributes and updates the `theme-color` meta tag.

### `assets/js/status-badge.js`

Auto-mounts a reusable status badge into pages that contain `.academic-sidebar`. Recent commits show this component replaced hardcoded badges on many pages, which reduced duplication and kept the sidebar consistent.

### `assets/js/cursor-glow.js`

Implements the cursor-following spotlight effect for `.card-surface` elements. Recent commits show it was tuned to behave correctly across visible card areas and mobile states.

### Catalog renderers

- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`

These files render the primary listing pages, synchronize client-side behavior with inline JSON payloads, and own filtering/search/sort interactions. They are important extension points because they must stay aligned with the generator output format.

### Smaller feature scripts

- `assets/js/cv-modal.js` — PDF/document preview interaction
- `assets/js/email-protection.js` — email obfuscation/protection

## Generator and data model

`scripts/generate_site.py` is the main site-generation script. It reads `scripts/projects_database.json` and `scripts/experience_database.json`, writes detail pages, updates listing payloads, and regenerates `sitemap.xml`.

`scripts/cv_parser.py` is a separate pipeline that parses the LaTeX CV source into experience data. `scripts/experience_schema.md` documents the schema contract and explains how LaTeX environments map to JSON fields.

This means the experience system is not just a flat content list. It is a generated dataset derived from a document source and then surfaced in both listing and detail forms.

## Architectural invariants

1. **Static first**: production is file-serving only.
2. **Shared chrome everywhere**: pages should look and behave consistently.
3. **Generated content must match client renderers**: changes to schema or metadata need coordination.
4. **Accessibility is part of the architecture**: heading order, keyboard behavior, and ARIA states are enforced by tests and documented guidance.
5. **Mobile is not an afterthought**: recent commits repeatedly adjust TOCs, filter drawers, nav toggles, and card behavior for mobile users.

## Change guidance for future agents

When making cross-cutting changes:

- update generator output and client-side renderers together
- check shared JS modules first, not individual pages
- inspect both listing pages and generated detail pages for regressions
- run nav, listing, and detail tests after touching shared chrome or content schema

When adding a new page family, follow the pattern used by `projects/` and `experience/`: define a source of truth, a renderer, and a test strategy.

## Source map

### Source files

- `README.md`
- `scripts/generate_site.py`
- `scripts/cv_parser.py`
- `scripts/experience_schema.md`
- `assets/js/theme.js`
- `assets/js/status-badge.js`
- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`
- `assets/js/cursor-glow.js`
- `index.html`
- `projects/index.html`
- `experience/index.html`

### Git evidence

- `3216b8a feat: reusable status-badge component, uniform across all pages`
- `6084ad6 fix(mobile): tighten TOC gap, refactor projects-catalog to DOM API`
- `c064a2f fix: stop cross-toggle between filter and TOC buttons on mobile`
- `e45716e fix: collapse mobile 'On this page' TOC when aria-expanded=false`
- `01a435d fix(a11y): resolve skipped heading levels in listings`
- `bf95bd6 feat: add Presentations category for experience entries`
