# Adding or Editing Content

## Projects

1. **Edit source**: Edit `scripts/projects_database.json`
2. **Regenerate**: `python3 scripts/generate_site.py --projects`
3. **Inspect diff**: `git diff` — revert unintended detail-page rewrites
4. **Check JS renderer**: If the project doesn't appear on the listing page, verify the JS array in `assets/js/projects-catalog.js` matches (dual-source caveat)
5. **Test**: Run smoke tests and visually verify the listing page

## Experience (CV-driven)

1. **Edit LaTeX CV**: `files/cv_tex/reddy_cv.tex`
2. **Recompile**: `cd files/cv_tex && pdflatex reddy_cv.tex && pdflatex reddy_cv.tex`
3. **Parse**: Run `cv_parser.py` (check if it's invoked via generate or separately)
4. **Regenerate**: `python3 scripts/generate_site.py --experiences`
5. **Inspect diff**: Verify `experience/index.html` and detail pages
6. **Test**: Run experience listing and detail Playwright tests

## Adding a new page family

Follow the pattern established by `projects/` and `experience/`:

1. Create a JSON data source
2. Add a generator command to `generate_site.py`
3. Create a JS catalog renderer (if the listing needs interactivity)
4. Add nav entry in `scripts/chrome.py`
5. Run `scripts/update_nav.py`
6. Add test specs
7. Update `sitemap.xml` (handled by generator)

## Common pitfalls

- **Generator rewrites**: `generate_site.py --projects` overwrites project detail pages. After running, `git diff` and revert any unintended changes (e.g. whitespace, version bumps).
- **Dual project lists**: Some changes require updating both `projects_database.json` and the JS array in `projects-catalog.js`.
- **SSR fallback**: The experience listing has a `<noscript>` fallback card set. The generator updates it, but verify it matches the JS-rendered output.
