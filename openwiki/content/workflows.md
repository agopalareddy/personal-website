# Content Workflows

The site’s main content is maintained through a mix of hand-authored HTML, JSON data sources, and generator scripts. This page focuses on the workflows that future agents are most likely to touch: projects, experience, CV/source parsing, and document publishing.

## Project workflow

### Source of truth

Project content starts in `scripts/projects_database.json`.

That database includes:

- canonical slug/id
- title and excerpt
- venue / affiliation tags
- publication date
- technologies
- external links such as GitHub, demo, PDF, or presentation
- `has_detail` flags
- generated `content_html` for expanded pages

### Rendering

`assets/js/projects-catalog.js` renders the listing page on the client from the inline JSON payload in `projects/index.html`. `scripts/generate_site.py --projects` writes generated project detail pages and keeps the catalog payload in sync.

This is a dual-source pattern:

- the JSON database is the source of truth for structured project metadata
- the listing page has a runtime renderer that must match the payload shape

### Important caveat

`AGENTS.md` notes that the `/projects/` page historically has two copies of the project list:

1. `scripts/projects_database.json`
2. `assets/js/projects-catalog.js`

That means some additions may require updating both the JSON source and the JS renderer, depending on the page behavior you are changing. The architecture is more fragile here than in the experience flow, so inspect the actual page output after changes.

### Examples of project content domains

The current project set spans multiple themes:

- AI / ML systems and research
- web applications and interactive tools
- data pipelines and optimization work
- coursework or lab-derived technical projects

The content is not just a list of repositories; it serves as evidence of applied engineering depth.

## Experience workflow

### Source of truth

Experience content comes from `scripts/experience_database.json`, which is itself derived from the CV parsing pipeline. The schema contract is documented in `scripts/experience_schema.md`.

The experience database covers:

- education
- professional roles
- research
- leadership
- awards
- presentations

### Rendering

`assets/js/experience-catalog.js` handles the interactive experience listing. It supports:

- category filters
- org and year filters
- keyword search
- chronological sorting
- empty states
- timeline grouping

`scripts/generate_site.py --experiences` generates detail pages into category subdirectories and updates the listing page payload / sitemap.

### Why this workflow exists

The experience section is effectively a structured archive of the author’s academic and professional record. The generator and schema layer exist so that the website can present a rich, sortable record without hand-editing dozens of pages.

This workflow is especially important for future agents because a change to the schema can affect:

- the CV parser
- generated detail pages
- listing page filters and sorts
- tests that assert ordering or labels

## CV and PDF workflow

The repository stores public documents in `files/`, with LaTeX source directories such as:

- `files/cv_tex/`
- `files/resume_tex/`
- `files/cover_tex/`

The README and `AGENTS.md` both describe a manual compilation flow using `latexmk` or `pdflatex`, followed by copying the built PDFs into the served `files/` directory.

This is a deliberately static document workflow: the public PDFs are tracked artifacts, not build-time outputs served from a separate pipeline.

## Navigation workflow

`scripts/update_nav.py` bulk-updates navigation bars across HTML files and preserves the active nav state. This indicates the site uses repeated navigation markup across many pages rather than a single shared HTML include.

If you add, remove, or rename major pages, this script is the correct place to check before editing dozens of HTML files by hand.

## Operational guidance for future agents

When editing content:

1. Update the source JSON or LaTeX first.
2. Regenerate the derived pages.
3. Inspect the listing pages and generated detail pages.
4. Run the relevant tests.
5. Check `git diff` for unintended rewrites.

When changing schema or content shape, keep the generator, the client renderer, and the tests in sync.

## Source map

### Source files

- `README.md`
- `AGENTS.md`
- `scripts/generate_site.py`
- `scripts/cv_parser.py`
- `scripts/experience_database.json`
- `scripts/projects_database.json`
- `scripts/experience_schema.md`
- `scripts/update_nav.py`
- `files/`

### Git evidence

- `bf95bd6 feat: add Presentations category for experience entries`
- `01a435d fix(a11y): resolve skipped heading levels in listings`
- `6084ad6 fix(mobile): tighten TOC gap, refactor projects-catalog to DOM API`
- `c064a2f fix: stop cross-toggle between filter and TOC buttons on mobile`
