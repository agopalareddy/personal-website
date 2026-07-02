# Layout Components

The site's UI is built from a small set of reusable layout and component patterns, all defined in `assets/css/style.css`.

## Navigation bar

Sticky frosted-glass nav (`--z-header: 1000`) with five items: Home, Experience, Projects, CV/Resume, Availability. Active page gets a 2px bottom underline in `--accent`. Nav text is `--text-secondary` at rest, `--text-primary` on hover, `--accent` when active.

- **CSS**: `.navbar`, `.nav-link` classes in `style.css`
- **JS**: `theme.js` includes the nav placeholder rendering; `scripts/chrome.py` renders the nav for generated pages

## Academic sidebar

Present on most pages, contains the author avatar, name, title, links, and the auto-mounted status badge.

- **CSS**: `.academic-sidebar`, `.author-avatar-wrapper`, `.author-links`
- **JS**: `status-badge.js` auto-mounts into `.academic-sidebar` elements
- Layout uses CSS Grid on desktop, collapses on mobile

## Card surfaces

Two card variants:

| Class           | Radius | Padding   | Use case              |
| --------------- | ------ | --------- | --------------------- |
| `.card-surface` | 8px    | 32px      | Detail pages, modals  |
| `.card-glow`    | 8px    | 16px/20px | Catalog listing cards |

Both support a cursor-following spotlight via `cursor-glow.js` and a `translateY(-2px)` hover lift.

- Resting state: `--bg-surface`, 1px `--border-color`, ambient shadow
- Hover state: `--bg-surface-hover`, `--border-hover`, structural shadow

## Filter pills

Category and sort controls on the listing pages:

```css
.filter-btn {
  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}
.filter-btn.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}
```

- ARIA: `aria-pressed` toggles on click
- JS manages active state in `projects-catalog.js` and `experience-catalog.js`

## Structural helpers

- `.section-kicker`: monospace uppercase accent label, max once per page
- `.timeline-dot`, `.timeline-line`: vertical timeline connector on experience listings
- `.sr-only`: screen-reader-only utility class
- `.skip-link`: keyboard skip navigation link (first focusable element on every page)

## Change guidance

- Most layout changes touch `style.css` globals, affecting every page.
- Mobile breakpoints: the site collapses the sidebar, stacks cards, and hides the TOC at widths < 768px.
- After layout changes, check both listing pages and generated detail pages.

## Source map

- `assets/css/style.css` — all component styles
- `assets/js/cursor-glow.js` — card spotlight behavior
- `assets/js/projects-catalog.js` — listing card rendering
- `assets/js/experience-catalog.js` — listing card rendering
- Commit `3247502 feat(ui): shared card-surface base, global cursor glow, click ripple`
