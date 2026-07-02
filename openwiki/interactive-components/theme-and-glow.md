# Theme System

The theme system is a 3-state slider (light / device / dark) built entirely in client-side JavaScript. It is the site's most interactive UI component.

## Source: `assets/js/theme.js`

### How it works

1. **On load**: reads `localStorage.getItem('theme')` (default: `'device'`).
2. **Applies theme**: sets `data-active-theme` and `data-resolved-theme` attributes on `<html>`, adds/removes `.theme-light` / `.theme-dark` classes.
3. **Theme resolution**:
   - `light` → always light
   - `dark` → always dark
   - `device` → checks `prefers-color-scheme: dark`
4. **Meta tag**: updates `<meta name="theme-color">` for browser chrome.
5. **System listener**: watches `prefers-color-scheme` changes and re-applies if in `device` mode.

### Slider DOM

The slider is built programmatically (no hardcoded HTML) at `DOMContentLoaded`:

```js
iconDefs = [
  ['light', 'Light mode', 'fa-solid fa-sun'],
  ['device', 'System mode', 'fa-solid fa-desktop'],
  ['dark', 'Dark mode', 'fa-solid fa-moon'],
];
```

Placeholders are targeted by ID: `#theme-toggle` (nav) and `#theme-toggle-footer`.

The thumb slides via `translateX(0)` / `translateX(32px)` / `translateX(64px)`.

### What the slider controls

- `data-active-theme`: the user's selected mode (`light`, `dark`, `device`)
- `data-resolved-theme`: the actual resolved mode (`light` or `dark`)
- CSS uses `[data-resolved-theme]` selectors to switch color tokens

### Change guidance

- Do not hardcode badge or slider markup in HTML — the JS builds it.
- If adding a new placement, follow the placeholder ID pattern.
- After changing theme behavior, test both listing pages in all three modes.
- Recent fix: `4fe4c69` changed the device icon from `fa-display` to `fa-desktop`.

## Cursor Glow

Source: `assets/js/cursor-glow.js`

Applies a cursor-following radial gradient spotlight to `.card-surface` and `.card-glow` elements.

### Performance design

- Single `mousemove` listener (not one per card)
- `rAF`-throttled: max one update per animation frame
- `IntersectionObserver`: only cards in/near viewport updated
- Distance gate: cards > 700px from cursor are skipped
- Cached rects via `WeakMap`, refreshed on scroll/resize
- CSS variables only written when values change (no-op guard)

### Ripple effect

Clicking a `.card-surface` or `.card-glow` spawns a Material-You-style ripple `<span>` that auto-removes on `animationend`.

### Recent fixes

- `ab6a095`: gate cursor distance against visible portion of card (not geometric center)
- `53268fa`: CSS-driven max-height for expand/collapse animations
- `c064a2f`: stop cross-toggle between filter and TOC buttons

### Change guidance

- If adding a new card class, add it to the `SELECTOR` constant at line 22.
- Test with tall cards, scrolled views, and mobile viewports.
- Verify `prefers-reduced-motion: reduce` suppresses the effect.

## Source map

- `assets/js/theme.js` — theme slider implementation
- `assets/js/cursor-glow.js` — cursor spotlight + click ripple
- `assets/css/style.css` — theme CSS variables, slider styles, glow gradients
- Design evidence: `DESIGN.md` sections 2 (colors), 5 (components)
- Git evidence: `4fe4c69`, `e49c6a6`, `3247502`, `ab6a095`, `53268fa`, `c064a2f`
