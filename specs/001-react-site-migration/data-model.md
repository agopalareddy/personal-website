# Phase 1 Data Model: Migrate Site Generation to a Component-Based Build

This migration does not change what data is captured (Assumption in spec.md) — both
JSON databases keep their existing shape. This document describes the entities as the
new build MUST consume them; it doesn't redefine the schema.

## Project Entry

**Source**: `scripts/projects_database.json` (flat JSON array, 21 entries today).

| Field                                         | Type                           | Required | Notes                                                                                                         |
| --------------------------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `id`                                          | string                         | yes      | Stable identifier (e.g. `2022-07-aiparkinscan`); not necessarily the URL slug.                                |
| `title`                                       | string                         | yes      | Display name.                                                                                                 |
| `excerpt`                                     | string (HTML-escaped entities) | yes      | Short summary shown in catalog cards.                                                                         |
| `venue`                                       | string                         | yes      | Program/competition/context the project was built under.                                                      |
| `venue_tag`                                   | string                         | yes      | Short label variant of `venue` for compact display.                                                           |
| `permalink`                                   | string                         | yes      | Canonical path, e.g. `/projects/aiparkinscan` — this IS the URL contract; MUST be preserved exactly (FR-004). |
| `date`                                        | ISO date string                | yes      | Sort key.                                                                                                     |
| `formatted_date`                              | string                         | yes      | Pre-formatted display string (e.g. `"Jun 2022 – Aug 2022"`) — render as-is, do not reformat.                  |
| `category`                                    | string                         | yes      | Groups projects for filter/search (Category label role mapping in `DESIGN.md`).                               |
| `technologies`                                | string[]                       | yes      | Tag pills; drives search/filter matching.                                                                     |
| `github` \| `demo` \| `pdf` \| `presentation` | string \| `null`               | no       | Optional external links; `null` means "don't render this link," not an error.                                 |
| `has_detail`                                  | boolean                        | yes      | Whether a detail page exists for this entry; catalog card links to detail page only when true.                |
| `content_html`                                | string (pre-rendered HTML)     | yes      | Detail-page body. Trusted, pre-sanitized (R4) — inject via React's raw-HTML mechanism, not by re-parsing.     |

**Validation rules carried over from current behavior**: a missing/`null` optional
link field MUST simply omit that link's UI affordance (edge case in spec.md), not fail
the build. `has_detail: false` MUST suppress detail-page generation and detail links
for that entry, consistent with today's generator.

**Relationships**: One `Project Entry` → zero-or-one detail page (`has_detail`); many
`Project Entry` → one catalog page (`/projects/`), filtered/searched client-side by
`category` and `technologies`.

## Experience Entry

**Source**: `scripts/experience_database.json`, structured per the categories and
per-environment field mappings already fully documented in
[`scripts/experience_schema.md`](../../scripts/experience_schema.md) (10 top-level
entry types — `educationentry`, `researchentry`, `experienceentry`, `projectentry`,
`leadershipentry` + nested `positionentry`, `presentationentry`, `honorentry`,
`skillcategory`, `onecolentry` — each mapped to `title`/`organization`/`location`/
`start_date`/`end_date`/`role_context`/`responsibilities[]` as applicable). This
migration reads that same JSON shape; `experience_schema.md` remains the canonical
field reference and is not duplicated here.

**Categories** (drives the 6 experience subdirectories the build MUST reproduce):
`education`, `research`, `professional`, `leadership`, `presentations`, `awards`.

**Relationships**: One `Experience Entry` → zero-or-one detail page (`has_detail`,
mirroring the Project Entry pattern per `experience_schema.md`); many entries per
category → one category listing + the combined `/experience/` timeline view.

## Page Chrome

Not a data entity — a structural/rendering concern (FR-003). Modeled as:

| Slot                                                                                   | Current source                         | New source                                                                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Navigation (`UnderlineNav`, active tab)                                                | `scripts/chrome.py` template functions | `<Nav>` component, `aria-current="page"` computed from current route                                   |
| Sidebar (profile card, contact octicons)                                               | `scripts/chrome.py`                    | `<Sidebar>` component, static props (profile data doesn't come from either JSON database)              |
| Footer                                                                                 | `scripts/chrome.py`                    | `<Footer>` component                                                                                   |
| `<head>` (meta, theme-init inline script, stylesheet links, version-busted asset URLs) | `scripts/chrome.py` version-bump logic | `<Head>` component; cache-busting (`style.css?v=`) driven by build hash instead of manual version bump |

No new state, no persistence beyond what `useTheme` already needs (see
`research.md` R1/R3 — theme choice persists via the existing `localStorage` key
`color-scheme`, unchanged).

## Content Schema (validation contract, per FR-014)

A JSON Schema document per database — `project-entry.schema.json`,
`experience-entry.schema.json` — formalizing the field tables above: required fields
required, nullable link fields (`github`/`demo`/`pdf`/`presentation`) explicitly
`["string", "null"]`, `technologies`/`responsibilities` as string arrays, etc. Not a
new data source; a build-time gate (research.md R8) that fails loudly on a malformed
entry instead of letting bad data reach a rendered page.
