# Accessibility Compliance Statement

This website is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** specification.

---

## 🛠️ Implemented Accessibility Features

Our portfolio showcase implements the following core accessibility best practices:

### 1. ARIA Landmarks & Structural Semantics
- **Skip Navigation Link**: A keyboard-accessible skip link (`.skip-link`) is placed at the top of every page, allowing keyboard-only users to bypass navigation lists and jump straight to `<main id="main-content">`.
- **Semantic Regions**: Content is enclosed within appropriate HTML5 landmark elements:
  - `<nav aria-label="Primary Navigation">` for top navbar.
  - `<aside aria-label="Author Biography">` for sidebar details.
  - `<article aria-label="...">` for core page contents and project grids.
  - `<footer>` for copyright and credits.
- **Heading Hierarchy**: Each page contains a single primary `<h1>` element, with logical sequential headings (`<h2>`, `<h3>`) to support proper screen-reader outline structures.

### 2. Keyboard & Interactive Element Support
- **Focus Indicators**: Dynamic borders and distinct colors for interactive focus outlines, ensuring complete visibility during keyboard navigation.
- **Dynamic Presets**: ARIA-pressed states (`aria-pressed="true/false"`) are wired into category filter buttons so screen readers are instantly notified when filters are toggled.
- **Form Select Labels**: Dropdowns for Sorting and Institution filtering have explicit `aria-label` tags to identify their roles to assist technologies.
- **Icon Hidden States**: All decorative FontAwesome icon vectors (`<i>` tags) have `aria-hidden="true"` so they are bypassed by screen readers, preventing clutter.

### 3. Visual & Styling Enhancements
- **Color Contrast**: Premium custom CSS dark and light color tokens conform to the minimum contrast ratio of **4.5:1** for normal text and **3:1** for large text against background surfaces.
- **Adaptive Contrast in Dark Mode**: No styles are hardcoded; all cards and dropdowns dynamically reference CSS variables (`var(--bg-surface)`, `var(--text-primary)`) to prevent glaring or low-contrast text in dark themes.
- **Target New Tab Alerts**: Any links opening in new browser tabs (`_blank`) include a screen-reader-only notification element `<span class="sr-only">(opens in a new tab)</span>` so users are warned of navigation behavior.

---

## 🔍 Validation Methodologies

Our accessibility implementation is verified through:
1. **Structural Semantic Audits**: Utilizing automated link and reference validators (`validate_site.py`) to confirm sitemap and document linkages remain intact.
2. **Keyboard Navigation Walkthroughs**: Testing focus trapping, tab order correctness, and skip-link execution inside modern user agents.
3. **Screen Reader Outlining**: Auditing pages with layout headers to ensure screen-reader outline logs match standard page structures.

---

## 📧 Feedback & Support

If you encounter any accessibility barriers or have suggestions for further improvement, please contact me directly at:
- **Email**: [a.gopalareddy@wustl.edu](mailto:a.gopalareddy@wustl.edu)
- **LinkedIn**: [Aadarsha Gopala Reddy](https://www.linkedin.com/in/agopalareddy)
