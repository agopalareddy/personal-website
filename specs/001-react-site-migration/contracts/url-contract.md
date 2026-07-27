# URL Contract

This is the interface this feature exposes to the outside world: every URL the site
answers today MUST answer identically after migration (FR-004, SC-001). This is the
concrete checklist Phase 2 tasks and the User Story acceptance scenarios test against.

## Route inventory (must all resolve, unchanged, post-migration)

| Route pattern                 | Count today | Source                                         | Notes                                                                         |
| ----------------------------- | ----------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `/`                           | 1           | hand-authored                                  | Home page.                                                                    |
| `/projects/`                  | 1           | `projects_database.json` (catalog view)        | Filter/search UI.                                                             |
| `/projects/<slug>.html`       | 22          | `projects_database.json`                       | One per entry where `has_detail: true`; `permalink` field is the slug source. |
| `/experience/`                | 1           | `experience_database.json` (combined timeline) |                                                                               |
| `/experience/education/*`     | N           | `experience_database.json`                     |                                                                               |
| `/experience/research/*`      | N           | `experience_database.json`                     |                                                                               |
| `/experience/professional/*`  | N           | `experience_database.json`                     |                                                                               |
| `/experience/leadership/*`    | N           | `experience_database.json`                     |                                                                               |
| `/experience/presentations/*` | N           | `experience_database.json`                     |                                                                               |
| `/experience/awards/*`        | N           | `experience_database.json`                     |                                                                               |
| `/cv/`                        | 1           | hand-authored                                  | CV/resume/cover-letter document hub.                                          |
| `/availability/`              | 1           | hand-authored                                  |                                                                               |
| `/accessibility.html`         | 1           | hand-authored                                  | Must stay in sync with actual a11y behavior (Principle IV).                   |
| `/404.html`                   | 1           | hand-authored                                  | nginx `error_page 404` target.                                                |
| `/sitemap.xml`                | 1           | generated                                      | Derived from the build's own route manifest (research.md R5).                 |

Out of scope, untouched: `/wellness/*` (FR-012), all `infra/nginx` legacy redirect
rules (`/about/`, `/wordpress/*`, `/publications`, `/talks`, `/teaching`, `/talkmap`,
and the one re-categorized leadership→presentations redirect) — these are nginx-level
rules, not generated pages, and are not part of this feature.

## Contract rules

1. **Slugs are stable**: a route's path segment comes from data (`permalink` for
   projects; the equivalent per-entry identifier for experience, per
   `experience_schema.md`), never regenerated from a title at build time in a way that
   could change if a title is edited. Changing a slug is a content edit, not something
   this migration does implicitly.
2. **No trailing-slash drift**: index/catalog routes keep their trailing slash (e.g.
   `/experience/`), detail routes keep their current extension convention (`.html` for
   projects, per-category paths for experience) — matching nginx's
   `try_files $uri $uri/ $uri.html` behavior exactly, since that config is not changing
   (FR-010, research.md R2).
3. **Sitemap is derived, not maintained**: `sitemap.xml` MUST list exactly this route
   inventory, generated from the same manifest the build renders (research.md R5) —
   never a separately hand-updated list.
4. **New entries extend the inventory automatically**: adding a JSON database entry
   with `has_detail: true` MUST add its detail route and appear in the relevant
   catalog/listing and the sitemap, with no other file to update (FR-002, SC-002).
