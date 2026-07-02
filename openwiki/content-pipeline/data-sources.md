# Data Sources & Schemas

The site's content is stored as structured JSON and derived from LaTeX source. This page documents the data models.

## Projects Database

Source: `scripts/projects_database.json` (~47 KB)

### Schema (per entry)

```json
{
  "id": "2022-07-aiparkinscan",
  "title": "AIParkinScan",
  "excerpt": "Short description",
  "venue": "Full venue name",
  "venue_tag": "Short tag",
  "permalink": "/projects/aiparkinscan",
  "date": "2022-07-31",
  "category": "Research & ML",
  "technologies": ["Python", "TensorFlow", ...],
  "github": "https://...",
  "demo": "https://..." or null,
  "pdf": "https://..." or null,
  "presentation": "https://..." or null,
  "has_detail": true,
  "formatted_date": "Summer 2022"
}
```

### Categories

Current categories include: Research & ML, Web Apps, Data Science, AI/ML, Tools, Academic.

## Experience Database

Source: `scripts/experience_database.json` (~41 KB)

### Schema (per entry)

```json
{
  "id": "slug",
  "type": "professional",
  "title": "Job Title",
  "org": "Organization",
  "location": "City, State",
  "start_date": "2023-06",
  "end_date": "2023-08",
  "formatted_dates": "Jun 2023 – Aug 2023",
  "bullets": ["Responsibility 1", ...],
  "tags": ["Python", "ML", ...],
  "is_current": false,
  "sort_date": "2023-08"
}
```

### Entry types

| Type         | Category slug |
| ------------ | ------------- |
| education    | education     |
| professional | professional  |
| research     | research      |
| leadership   | leadership    |
| presentation | presentations |
| award        | awards        |

### Schema contract

`scripts/experience_schema.md` (42 KB) is the canonical reference for the mapping between LaTeX environments and JSON fields. It documents:

- Every LaTeX environment in `reddy_cv.sty`
- Argument counts and types
- Optional vs required fields
- Mapping to JSON structure
- Examples

## Skills Data

Source: `scripts/skills.json` (~1 KB)

A lightweight JSON file mapping skill categories (e.g. Languages, Frameworks, Tools) to lists of skills. Used for the CV page skills display.

## Change guidance

- Schema changes cascade: parser → database → generator → JS renderer → tests
- Always update `experience_schema.md` when changing the JSON schema
- Run `generate_site.py` and Playwright tests after schema changes
- The generator maintains backward compatibility — test both old and new entries

## Source map

- `scripts/projects_database.json`
- `scripts/experience_database.json`
- `scripts/experience_schema.md`
- `scripts/skills.json`
- `files/cv_tex/reddy_cv.sty` — LaTeX environment definitions
- `scripts/cv_parser.py`
