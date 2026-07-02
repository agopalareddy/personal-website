# Navigation Updater

`scripts/update_nav.py` is a bulk HTML rewriting script that updates every page's navigation bar in one pass. It is essential because the site does not use server-side includes or a template engine — navigation markup is duplicated across every HTML file.

## When to use

- Adding a new top-level page
- Renaming or removing an existing page
- Changing nav link labels or icons
- Updating the nav item order

## How it works

1. Discovers HTML files across the repository (excluding `node_modules/`, `tests/`, generated files)
2. For each file, identifies the current nav markup pattern
3. Rewrites it to match the updated configuration
4. Preserves the active page class (the current page's nav link stays highlighted)

## Source: `scripts/update_nav.py` (~7 KB)

The canonical nav structure is defined in `scripts/chrome.py` as `NAV_ITEMS`, which is also used by the site generator. The updater should be kept in sync with `chrome.py`.

## Change guidance

- Always run the generator after the updater, since generated pages also need updated navs.
- After running, `git diff` and verify the active page state is correct for each page family.
- Run Playwright nav-integrity tests after any nav change.

## Source map

- `scripts/update_nav.py`
- `scripts/chrome.py` (nav definition)
- Git: recent commits show nav layout adjustments alongside feature work
