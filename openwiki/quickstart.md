# Quickstart

Aadarsha Gopala Reddy’s personal website is a static portfolio and academic archive for `agreddy.com`. It is built with plain HTML, CSS, and vanilla JavaScript, with Python scripts generating the project and experience detail pages.

## What this repository is for

The site serves four primary needs:

1. Present projects with detailed case-study pages.
2. Present work experience, research, leadership, education, and awards.
3. Publish downloadable documents such as the CV and resume.
4. Provide a polished, accessible, mobile-friendly public profile for recruiters and academic contacts.

The repository is intentionally static: there is no application server or backend runtime for the public site. Pages are served directly by Nginx in production.

## Start here

- [Repository architecture](architecture/site-structure.md)
- [Design system: tokens & components](design-system/design-tokens.md)
- [Design system: layout components](design-system/layout-components.md)
- [Interactive components: theme & cursor glow](interactive-components/theme-and-glow.md)
- [Interactive components: catalog renderers](interactive-components/catalog-renderers.md)
- [Interactive components: small components](interactive-components/small-components.md)
- [Content generation pipeline](content-pipeline/generator.md)
- [Content data sources & schemas](content-pipeline/data-sources.md)
- [Navigation updater](content-pipeline/navigation-updater.md)
- [UI, theming, and accessibility](ui-and-accessibility.md)
- [Production operations: deployment](operations/deployment.md)
- [Production operations: nginx & analytics](operations/nginx-and-analytics.md)
- [E2E testing](testing/e2e-tests.md)
- [Accessibility testing](testing/accessibility.md)
- [Workflow: editing content](workflows/content-editing.md)
- [Workflow: changing shared UI](workflows/ui-changes.md)
- [Troubleshooting](workflows/troubleshooting.md)
- [Testing and deployment overview](testing-and-deployment.md)

## Key source files

- `README.md` — concise repository overview and local workflow notes
- `PRODUCT.md` — product intent, audience, and brand constraints
- `DESIGN.md` — design system and component rules
- `ACCESSIBILITY.md` — accessibility statement and validation notes
- `AGENTS.md` — operational guidance for future agents
- `scripts/generate_site.py` — generator for project/experience detail pages and sitemap
- `scripts/update_nav.py` — bulk navigation updater
- `tests/` — Playwright and a11y checks
- `infra/nginx/` — production Nginx configuration snapshots

## Major domains

### Public site

The public site is a multi-page static portfolio with these major areas:

- `index.html` — homepage
- `projects/` — project catalog plus generated project detail pages
- `experience/` — experience catalog plus generated detail pages
- `cv/` — CV and resume hub
- `availability/` — availability page
- `accessibility.html` — accessibility statement

### Shared UI and behavior

Reusable assets live under `assets/`:

- `assets/css/style.css` — design tokens, layout rules, and shared components
- `assets/js/theme.js` — light/device/dark theme switcher
- `assets/js/status-badge.js` — reusable sidebar status badge
- `assets/js/cursor-glow.js` — hover spotlight behavior
- `assets/js/projects-catalog.js` and `assets/js/experience-catalog.js` — client-side listing renderers and filters
- `assets/js/email-protection.js` and `assets/js/cv-modal.js` — small feature scripts

### Content generation

The site uses JSON-backed content and generator scripts:

- `scripts/projects_database.json` — project content source
- `scripts/experience_database.json` — experience content source
- `scripts/generate_site.py` — writes detail pages and updates listing payloads
- `scripts/cv_parser.py` — parses LaTeX CV content into structured experience data

### Operations and deployment

- `infra/nginx/` stores tracked nginx config snapshots for the production VM.
- `scripts/verify_ga4.py` checks GA4 connectivity after CSP or deployment changes.
- `tests/` contains browser tests and accessibility baselines.

## How the site is built

The site is not compiled into an app bundle. The workflow is:

1. Edit HTML/CSS/JS/content sources.
2. Regenerate project or experience pages when the underlying JSON or CV source changes.
3. Run tests locally with Playwright.
4. Deploy by updating the production checkout on the GCP VM.

The generator and JS renderers are closely linked. If you change the data schema or filter behavior, you usually need to update both the Python generator and the client-side catalog scripts.

## What changed recently

Recent commits show repeated work on shared UI systems and responsive behavior:

- reusable status badge component
- theme-aware palette updates
- cursor glow and card-surface effects
- mobile TOC / filter panel behavior
- accessibility fixes for headings and navigation

That history matters because many pages are shared templates or generator outputs, so one small component change can affect most of the site.

## Next page suggestions

If you are changing the site:

- start with [architecture/site-structure.md](architecture/site-structure.md) to understand the page families
- read [content/workflows.md](content/workflows.md) before editing any project or experience entry
- read [ui-and-accessibility.md](ui-and-accessibility.md) before touching shared styling or JS
- read [testing-and-deployment.md](testing-and-deployment.md) before shipping changes

## Source map

### Source files

- `README.md`
- `PRODUCT.md`
- `DESIGN.md`
- `ACCESSIBILITY.md`
- `AGENTS.md`
- `package.json`
- `tests/package.json`
- `scripts/generate_site.py`
- `scripts/update_nav.py`
- `scripts/cv_parser.py`

### Git evidence

- `3216b8a feat: reusable status-badge component, uniform across all pages`
- `6084ad6 fix(mobile): tighten TOC gap, refactor projects-catalog to DOM API`
- `4fe4c69 fix(theme): use fa-desktop instead of fa-display`
- `c064a2f fix: stop cross-toggle between filter and TOC buttons on mobile`
- `01a435d fix(a11y): resolve skipped heading levels in listings`
