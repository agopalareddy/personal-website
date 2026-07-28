## Conventions for building with this design system

This is agreddy.com's own component set: GitHub's **Primer** design tokens (vendored, unmodified)
plus ~10 site-specific React components (page chrome + catalog cards). It is not a general-purpose
UI kit — most components are opinionated, single-use page pieces, not composable primitives.

### Required wrapper — without it, every color disappears

Primer's functional color tokens (`--fgColor-*`, `--bgColor-*`, `--borderColor-*`, etc.) are gated
behind a color-mode attribute selector, not defined at bare `:root`. **Any composition using this
system's colors must have an ancestor carrying:**

```html
<div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
  <!-- your composition -->
</div>
```

Without it, components render with zero color styling — plain black-on-white, missing card
surfaces, missing button/pill backgrounds — even though layout, spacing, and typography still
apply (those tokens live at bare `:root`). `Layout` already sets these attributes on its own root
element; only add the wrapper when composing OTHER components without `Layout` around them.

### Styling idiom — plain utility-ish classes, not CSS-in-JS or a prop-based system

Components take **no styling props** — no `variant`, `color`, or `size` props. Style is entirely
via plain CSS classes on real DOM elements, following Primer's naming loosely:

| Class                                                  | Use                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `card-surface`                                         | The bordered/elevated card container (base for most cards)                              |
| `project-card`, `timeline-card`                        | Catalog card composition (`ProjectCard`/`ExperienceEntryCard`'s own root)               |
| `card-meta`, `card-category`, `cat-<category>`         | Card header row + category pill (color keyed by `cat-education`, `cat-research`, etc.)  |
| `card-btn`, `btn-detail`, `btn-pdf`                    | Action buttons inside a card footer                                                     |
| `filter-pills`, `filter-btn`, `custom-select`          | Filter/search controls (see `CatalogFilter`)                                            |
| `page-intro-title`, `page-intro-lead`                  | Page-level heading + lead paragraph, used inside `Layout`'s `children`                  |
| `container`                                            | Max-width content wrapper                                                               |
| `timeline-section`, `timeline-year`, `timeline-marker` | Chronological list grouping (used around a list of `ProjectCard`/`ExperienceEntryCard`) |

For anything not covered by an existing class, reach for Primer's own functional CSS custom
properties directly (`color: var(--fgColor-default)`, `background: var(--bgColor-accent-muted)`,
`font-family: var(--fontStack-system)`) rather than inventing new classes or hardcoding hex values.

### Where the truth lives

Read `styles.css` (and its `@import` closure — `tokens/*.css`, `_ds_bundle.css`) before styling
anything new — it is the exact compiled stylesheet this design system ships, not a summary. Each
component's `.prompt.md` documents its specific props and composition; `.d.ts` is the type contract.

### Example — composing a catalog page

```tsx
import { Layout, CatalogFilter, ProjectCard } from '<pkg>';

<Layout
  activePage="projects"
  title="Projects"
  description="…"
  canonicalUrl="https://example.com/projects/"
  sidebarExtra={
    <CatalogFilter
      categories={[{ value: 'all', label: 'All' }]}
      categoryGroupAriaLabel="Category Filters"
      searchId="projectSearch"
      searchPlaceholder="Search…"
      searchAriaLabel="Search projects"
      groupSelectId="venueFilter"
      groupAriaLabel="Filter by venue"
      groupOptions={[]}
      yearSelectId="yearFilter"
      yearAriaLabel="Filter by year"
      years={[2026]}
      sortSelectId="projectSort"
      sortAriaLabel="Sort projects"
    />
  }
>
  <h1 className="page-intro-title">Projects</h1>
  <div className="project-timeline timeline-section">
    <ProjectCard p={someProjectEntry} />
  </div>
</Layout>;
```

`Layout` already wraps its subtree in the `data-color-mode` attributes above — composing new
pages by nesting content inside `Layout`'s `children` needs no extra wrapper.
