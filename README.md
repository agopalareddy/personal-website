# Aadarsha Gopala Reddy Personal Website

Static personal website and project archive for [agreddy.com](https://agreddy.com).
The site presents projects, experience, CV and resume documents, and availability
using plain HTML, CSS, and JavaScript.

## Quick Links

- Live site: [https://agreddy.com](https://agreddy.com)
- Repository: [agopalareddy/personal-website](https://github.com/agopalareddy/personal-website)
- Accessibility statement: [ACCESSIBILITY.md](ACCESSIBILITY.md)
- Nginx configuration notes: [infra/nginx/README.md](infra/nginx/README.md)

## What This Repo Contains

- A static website with no runtime application server.
- Shared design tokens and component styles in `assets/css/style.css`.
- Client-side behavior for theme selection, email protection, catalog filtering,
  and PDF previews in `assets/js/`.
- JSON-backed content sources for projects and experience under `scripts/`.
- Generated public pages for project and experience detail views.
- Playwright end-to-end tests under `tests/`.
- Tracked snapshots of the production Nginx configuration under `infra/nginx/`.

## Tech Stack

- HTML5
- CSS custom properties, Grid, and Flexbox
- Vanilla JavaScript
- Python content-generation scripts
- Playwright for browser tests
- Nginx on Google Cloud Compute Engine for production hosting

## Repository Structure

```text
personal-website/
├── index.html                 # Home page
├── projects/                  # Projects catalog and generated detail pages
├── experience/                # Experience catalog and generated detail pages
├── cv/                        # CV and resume document hub
├── availability/              # Public availability page
├── assets/
│   ├── css/                   # Site-wide design system and page styles
│   ├── fonts/                 # Self-hosted font files
│   └── js/                    # Theme, catalogs, modals, and email protection
├── files/                     # Public PDFs and LaTeX source directories
├── images/                    # Site images, icons, and manifest assets
├── scripts/                   # Content databases and generators
├── tests/                     # Playwright test suite
└── infra/nginx/               # Production Nginx config snapshots and deploy script
```

## Local Development

Install development dependencies from the repository root:

```bash
npm install
```

Serve the site locally:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

Use a local server instead of opening files directly so relative paths, PDF
previews, and browser security behavior match production more closely.

## Formatting

Format HTML, CSS, JavaScript, JSON, and Markdown files with Prettier:

```bash
npm run format
```

Husky runs commit hooks that protect commit messages from unwanted AI
co-author trailers.

## Content Workflows

### Projects

Project metadata lives in `scripts/projects_database.json`.

After adding or editing project entries, regenerate the project pages and
catalog data:

```bash
python3 scripts/generate_site.py --projects
```

The generator writes project detail pages into `projects/` and updates the
JSON payload used by `projects/index.html`.

### Experience

Experience metadata lives in `scripts/experience_database.json`.

After editing experience entries, regenerate the experience pages and listing:

```bash
python3 scripts/generate_site.py --experiences
```

The generator writes detail pages into `experience/`, updates the listing page
data, and refreshes the sitemap.

### CV, Resume, and Cover Letter PDFs

Public PDFs are stored in `files/`.

LaTeX source directories:

- `files/cv_tex/`
- `files/resume_tex/`
- `files/cover_tex/`

Build a document from its source directory with:

```bash
latexmk -pdf <document>.tex
```

Clean LaTeX auxiliary files before committing:

```bash
rm -f *.aux *.log *.fls *.fdb_latexmk *.out *.synctex.gz
```

## Testing

Install test dependencies from `tests/` if needed:

```bash
cd tests
npm install
```

Run the site locally from the repository root:

```bash
python3 -m http.server 8000
```

Then run Playwright from `tests/`:

```bash
cd tests
PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:8000 npm test
```

Run one viewport group:

```bash
npm run test:desktop
npm run test:mobile
```

## Deployment

Production is a static checkout at `/opt/personal-website/` on the GCP VM.
Deployments are Git-based; do not copy site files with `scp`.

1. Commit and push to `main`:

   ```bash
   git push origin main
   ```

2. Update the production checkout:

   ```bash
   ssh gcp-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
   ```

There is no build step for the public site. Nginx serves files directly from
the checked-out repository.

After changing CSS, bump the `style.css?v=` query string in HTML files when
browser cache invalidation is needed.

## Nginx and Analytics

The tracked Nginx configuration snapshot is in `infra/nginx/`.

Deploy Nginx config changes with:

```bash
./infra/nginx/deploy.sh
```

GA4 verification is handled by:

```bash
./scripts/verify_ga4.py
```

The verifier expects a service-account key at
`~/.config/gcp/ga-verifier.json`. Keep that key out of Git.

## Security and Privacy Notes

- Public hosting is HTTPS-only with security headers configured in Nginx.
- Email addresses are rendered client-side by `assets/js/email-protection.js`.
- External links should use `rel="noopener"` when opened in a new tab.
- Do not commit `.env` files, private keys, service-account keys, or temporary
  build artifacts.
- Keep public PDFs intentional; anything in `files/` can be served by the web
  server.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
