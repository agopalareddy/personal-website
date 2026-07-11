# Accessibility Compliance Statement

This website is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** specification.

---

## 🛠️ Implemented Accessibility Features

Our portfolio showcase implements the following core accessibility best practices:

### 1. ARIA Landmarks & Structural Semantics

- **Skip Navigation Link**: A keyboard-accessible skip link (`.skip-link`) is placed at the top of every page, allowing keyboard-only users to bypass navigation lists and jump straight to `<main id="main-content">`.
- **Semantic Regions**: Content is enclosed within appropriate HTML5 landmark elements:
  - `<nav aria-label="Primary Navigation">` for top navbar (UnderlineNav pattern).
  - `<aside aria-label="Author Biography">` for sidebar details.
  - `<article aria-label="...">` for core page contents and project grids.
  - `<footer>` for copyright and credits.
- **Heading Hierarchy**: Each page contains a single primary `<h1>` element, with logical sequential headings (`<h2>`, `<h3>`) to support proper screen-reader outline structures.

### 2. Keyboard & Interactive Element Support

- **Focus Indicators**: Visible focus outlines using Primer's `--focus-outlineColor` token on all interactive elements.
- **Dynamic Presets**: ARIA-pressed states (`aria-pressed="true/false"`) are wired into category filter buttons so screen readers are instantly notified when filters are toggled.
- **Form Select Labels**: Dropdowns for Sorting and Institution filtering have explicit `aria-label` tags to identify their roles to assist technologies.
- **Icon Hidden States**: All decorative Octicon SVG vectors have `aria-hidden="true"` and `focusable="false"` so they are bypassed by screen readers, preventing clutter. Meaning is always carried by visible text or `sr-only` spans.
- **Theme Picker**: Keyboard-accessible `<details>` dropdown with 6 radio options. Closes on select, Escape, or outside click. Theme changes announced via `aria-live` region.

### 3. Visual & Styling Enhancements

- **Color Contrast**: All colors use GitHub Primer's functional token system with paired foreground/background tokens, ensuring every combination meets WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text).
- **High Contrast Modes**: Two dedicated high-contrast themes are included (Light HC and Dark HC) for users who need stronger contrast. These use Primer's `light_high_contrast` and `dark_high_contrast` token sets.
- **Adaptive Theming**: No styles are hardcoded; all elements dynamically reference CSS custom properties from Primer's design token system. The theme picker offers 6 modes including system sync.
- **Reduced Motion**: A global `prefers-reduced-motion: reduce` media query disables all animations, transitions, and scroll behavior.
- **Forced Colors**: Octicons use `fill: currentColor`, ensuring they render correctly in Windows High Contrast Mode and other forced-colors environments.
- **Target New Tab Alerts**: Any links opening in new browser tabs (`_blank`) include a screen-reader-only notification element `<span class="sr-only">(opens in a new tab)</span>`.

### 4. No-JavaScript Resilience

- **Correct theme without JS**: The static `<html>` tag includes default `data-color-mode="auto"` attributes, and vendored CSS includes `prefers-color-scheme` media query branches.
- **No flash of wrong theme**: An inline `<script>` before stylesheets reads `localStorage` and sets theme attributes before paint.
- **Working navigation**: All nav links are standard `<a>` elements — no JS required.
- **Noscript fallback**: Project and experience listing pages include full `<noscript>` card grids matching the JS-rendered view.

---

## 🔍 Validation Methodologies

Our accessibility implementation is verified through:

1. **Automated Audits**: axe-core scans across all pages in 4 theme variants (light, dark, light HC, dark HC) checking `wcag2a` and `wcag2aa` rules.
2. **Keyboard Navigation Walkthroughs**: Testing focus trapping, tab order correctness, skip-link execution, and theme picker keyboard operation.
3. **Screen Reader Outlining**: Auditing pages with layout headers to ensure screen-reader outline logs match standard page structures.
4. **Playwright E2E Tests**: Automated browser tests verify navigation integrity, filter/search/sort functionality, TOC behavior, and empty states across desktop (1280×720) and mobile (375×667) viewports.

## 📧 Feedback & Support

If you encounter any accessibility barriers or have suggestions for further improvement, please contact me directly at:

- **Email**: [adurs2002@gmail.com](mailto:adurs2002@gmail.com)
- **LinkedIn**: [Aadarsha Gopala Reddy](https://www.linkedin.com/in/agopalareddy)
