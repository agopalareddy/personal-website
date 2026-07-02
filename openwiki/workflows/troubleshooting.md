# Common Troubleshooting

## Generated pages have unexpected diffs

After running `generate_site.py`, `git diff` may show whitespace, version string bumps, or minor HTML changes.

**Fix**: Review the diff intentionally. If unintended, `git checkout -- projects/*.html experience/*/**.html` to restore, then re-run with more specific flags.

## Project not showing on listing page

**Cause**: The JS array in `assets/js/projects-catalog.js` may be out of sync with `projects_database.json`.

**Fix**: Add the project entry to the hardcoded array in `projects-catalog.js`, then re-run the generator.

## Theme slider not working on new page

**Cause**: The page is missing `#theme-toggle` or `#theme-toggle-footer` placeholder elements.

**Fix**: Add `<div id="theme-toggle"></div>` in the nav area. The JS programmatically builds the slider.

## CSS changes not reflecting after deploy

**Cause**: Browser caching. The `style.css?v=` version hasn't been bumped.

**Fix**: Update the version in all HTML `<link>` tags. Use `scripts/update_nav.py` or a global find-and-replace.

## GA4 data not appearing

**Cause**: CSP `connect-src` may have been tightened, blocking the GA4 endpoint.

**Fix**: Verify `connect-src` includes GA4 endpoints. Run `./scripts/verify_ga4.py` to smoke test.

## Mobile TOC/filter drawer not closing

**Cause**: Recent fix `c064a2f` addressed cross-toggle interference. Check that `aria-expanded` on the toggle button matches the drawer state.

**Fix**: Ensure toggle buttons have mutually exclusive `aria-expanded` management in the catalog renderer.

## PDF preview opens new tab instead of modal

**Cause**: The CV modal falls back to `window.open()` when `window.innerWidth <= 640` or `<dialog>` is unsupported.

**Fix**: This is intended behavior for mobile. If the issue is desktop, check that `<dialog id="document-modal">` exists in the page HTML.
