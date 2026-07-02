# Deployment

The site is a fully static HTML/CSS/JS checkout — no build step, no application server. Nginx serves files directly from disk on a Google Cloud Compute Engine VM.

## Deployment workflow

```bash
# 1. Commit and push to main
git push origin main

# 2. Update production checkout
ssh gcp-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
```

SSH alias `gcp-showcase` is configured in `~/.ssh/config`.

**Important**: Do not `scp` site files. Deployment is Git-based only.

## CSS cache invalidation

After changing `assets/css/style.css`, bump the version query string in every HTML file's `<link rel="stylesheet">`:

```html
<link rel="stylesheet" href="/assets/css/style.css?v=1.7.16" />
```

Without this, browsers may serve stale CSS. The generator and `update_nav.py` can help propagate the change, but verify it reached all pages.

## LaTeX documents

CV, resume, and cover letter are compiled from LaTeX and tracked in `files/`:

```bash
cd files/cv_tex
pdflatex reddy_cv.tex && pdflatex reddy_cv.tex
rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz
cp files/cv_tex/reddy_cv.pdf files/reddy_cv.pdf
```

Compile output must be flattened to `files/` for the web server to serve it.

## File ownership

On the GCP VM, PDFs uploaded via other means may have wrong ownership:

```bash
ssh gcp-showcase "sudo chown adurs:adurs /opt/personal-website/files/<name>.pdf"
```

## Source map

- `README.md` — deployment section
- `AGENTS.md` — deploy commands
- `infra/nginx/README.md` — nginx deploy details
- `scripts/verify_ga4.py` — post-deployment smoke test
