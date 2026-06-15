# Experience Section — JSON Schema & LaTeX Mapping

> **Purpose**: Canonical schema for the experience entries that the personal-website
> Experience page renders. The CV LaTeX (`personal-website/files/cv_tex/reddy_cv.tex`)
> is the source of truth. `cv_parser.py` (Task 2) reads the LaTeX and emits a
> JSON array conforming to the `Experience` schema defined here.
>
> **Status**: Task 1 deliverable — defines the contract that the parser must satisfy.
> **Last Updated**: 2026-06-08

---

## 1. Custom Environment Inventory

All custom environments are defined in
[`personal-website/files/cv_tex/reddy_cv.sty`](../../files/cv_tex/reddy_cv.sty).
The list below is the authoritative catalog — discovered by reading the
`\newenvironment{...}[N]{...}` blocks. **Argument counts differ between
environments; never assume uniformity.**

| #   | Environment                  | Args      | Defined at (.sty line) | CV usages | Notes                                                                                                |
| --- | ---------------------------- | --------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| 1   | `header`                     | 0         | 158–165                | 1         | Top-of-document name + contact block. **Skipped** — content is static and re-derived in HTML chrome. |
| 2   | `educationentry`             | 3         | 278–294                | 2         | Degree, Institution+Location, Date Range                                                             |
| 3   | `researchentry`              | 5         | 330–349                | 5         | Title, Org, Location, Context, Date Range                                                            |
| 4   | `experienceentry`            | 4         | 304–320                | 7         | Position, Org, Location, Date Range                                                                  |
| 5   | `projectentry`               | 4         | 358–374                | 5         | Title, Affiliation, Location, Date Range                                                             |
| 6   | `leadershipentry`            | 2         | 381–387                | 10        | Org, Location (nested `positionentry` carries role)                                                  |
| 7   | `positionentry`              | 2         | 395–408                | 10        | **Always nested** inside `leadershipentry`. Position, Date Range.                                    |
| 8   | `presentationentry`          | 4         | 442–448                | 3         | Date, Title, Venue, University/Location                                                              |
| 9   | `honorentry`                 | 2         | 428–433                | 10        | Date/Year, Honor Name + Institution                                                                  |
| 10  | `skillcategory`              | 1         | 415–421                | 5         | Category name (body is comma-separated skills)                                                       |
| 11  | `onecolentry`                | 0         | 217–221                | 2         | Free text — used for PUBLICATIONS and REFERENCES.                                                    |
| 12  | `highlightsforbulletentries` | 0         | 193–205                | many      | Helper itemize list — **not a top-level entry**; body is responsibilities.                           |
| 13  | `onecolentry` (helper)       | 0         | 217–221                | n/a       | Also used internally by `skillcategory`.                                                             |
| 14  | `twocolentry`                | 2 (1 opt) | 229–243                | n/a       | Layout helper — only used inside other envs.                                                         |
| 15  | `honorstwocolentry`          | 2 (1 opt) | 250–264                | n/a       | Layout helper — only used inside `honorentry`.                                                       |

**Total experience-bearing top-level environments**: 10 (rows 2–11 in the table above).
The 4 layouts/headers (rows 1, 12, 14, 15) are internal and emit no Experience record.

---

## 2. Argument-Position → JSON-Field Mapping

The table below pins each LaTeX argument to the JSON field it populates.
The rightmost column is the source of truth for the parser.

### 2.1 `educationentry` — `{degree}{institution+location}{dates}` (3 args)

| Pos  | LaTeX role          | JSON field                  | Required | Example (line 65–67)                                                                                                      |
| ---- | ------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| #1   | Degree name         | `title`                     | yes      | `"M.S. Computer Science"`                                                                                                 |
| #2   | Institution + place | `organization` + `location` | yes      | `"Washington University in St. Louis, St. Louis, Missouri, USA"` → split on last comma into `organization` and `location` |
| #3   | Date range          | `start_date` + `end_date`   | yes      | `"August 2024 - May 2026"`                                                                                                |
| body | `\item` bullets     | `responsibilities[]`        | optional | GPA, Thesis, Coursework lines                                                                                             |

**Category**: `education`
**Has detail?**: `true` (when bullets are present), else `false`.

### 2.2 `researchentry` — `{title}{org}{location}{context}{dates}` (5 args)

| Pos  | LaTeX role      | JSON field                | Required | Example (line 94–98)                                   |
| ---- | --------------- | ------------------------- | -------- | ------------------------------------------------------ |
| #1   | Project title   | `title`                   | yes      | `"Toward Vehicle-Agnostic Driving Signatures …"`       |
| #2   | Org/Lab         | `organization`            | yes      | `"DRIVES Project, Washington University in St. Louis"` |
| #3   | Location        | `location`                | yes      | `"St. Louis, Missouri, USA"`                           |
| #4   | Course/Context  | `role_context`            | yes      | `"Master's Thesis (Lab PI: Dr. Ganesh Babulal)"`       |
| #5   | Date range      | `start_date` + `end_date` | yes      | `"August 2025 - May 2026"`                             |
| body | `\item` bullets | `responsibilities[]`      | optional | 1+ contribution bullets                                |

**Category**: `research`
**Has detail?**: `true` (bullets present).

### 2.3 `experienceentry` — `{position}{org}{location}{dates}` (4 args)

| Pos  | LaTeX role      | JSON field                | Required | Example (line 168–171)      |
| ---- | --------------- | ------------------------- | -------- | --------------------------- |
| #1   | Position title  | `title`                   | yes      | `"AI Engineer Intern"`      |
| #2   | Organization    | `organization`            | yes      | `"Crittero, Inc."`          |
| #3   | Location        | `location`                | yes      | `"Remote"`                  |
| #4   | Date range      | `start_date` + `end_date` | yes      | `"June 2025 - August 2025"` |
| body | `\item` bullets | `responsibilities[]`      | optional | contribution bullets        |

**Category**: `professional` (the CV re-uses this env in TEACHING & MENTORSHIP — see Section 3 for the resolution rule).
**Has detail?**: `true` (bullets present).

### 2.4 `projectentry` — `{title}{affiliation}{location}{dates}` (4 args)

| Pos  | LaTeX role      | JSON field                | Required | Example (line 260–263)                 |
| ---- | --------------- | ------------------------- | -------- | -------------------------------------- |
| #1   | Project title   | `title`                   | yes      | `"Datacenter Cooling Optimization …"`  |
| #2   | Affiliation     | `organization`            | yes      | `"Washington University in St. Louis"` |
| #3   | Location        | `location`                | yes      | `"St. Louis, Missouri, USA"`           |
| #4   | Date range      | `start_date` + `end_date` | yes      | `"August 2024 - December 2024"`        |
| body | `\item` bullets | `responsibilities[]`      | optional | tech bullets                           |

**Category**: `research` (decision — see Section 3.6).
**Has detail?**: `true`.

### 2.5 `leadershipentry` + `positionentry` (nested, 2 + 2 args)

`leadershipentry` emits the **organization header**; `positionentry` emits
the **role + dates + bullets** underneath. The parser MUST flatten this into
a single Experience record per `positionentry`, copying the parent org/location.

| Pos                  | LaTeX role      | JSON field                | Required | Example (line 437–441)                                                |
| -------------------- | --------------- | ------------------------- | -------- | --------------------------------------------------------------------- |
| `leadershipentry` #1 | Org name        | `organization`            | yes      | `"Graduate and Professional Student Council (GPSC)"`                  |
| `leadershipentry` #2 | Org location    | `location`                | yes      | `"Washington University in St. Louis, St. Louis, Missouri, USA"`      |
| `positionentry` #1   | Position        | `title`                   | yes      | `"Vice President of the Graduate-Professional Council (GPC) Chamber"` |
| `positionentry` #2   | Date range      | `start_date` + `end_date` | yes      | `"May 2025 - May 2026"`                                               |
| `positionentry` body | `\item` bullets | `responsibilities[]`      | optional | 1+ contribution bullets                                               |

**Category**: `leadership`
**Has detail?**: `true`.

> **Note**: The CV does not always use parentheses in the rendered org name;
> the parser must preserve the raw LaTeX text (e.g. `"GPSC"` should stay
> `"GPSC"`, not be re-expanded by the parser). The HTML template can decide
> to render a friendly label.

### 2.6 `presentationentry` — `{date}{title}{venue}{location}` (4 args)

| Pos | LaTeX role  | JSON field                | Required | Example (line 229–232)                                                  |
| --- | ----------- | ------------------------- | -------- | ----------------------------------------------------------------------- |
| #1  | Date        | `start_date` = `end_date` | yes      | `"September 2024"`                                                      |
| #2  | Title       | `title`                   | yes      | `"An Introduction to Artificial Intelligence for High School Students"` |
| #3  | Venue/Event | `organization`            | yes      | `"Engineering Workshop by AGES & Science Coach"`                        |
| #4  | University  | `location`                | yes      | `"Washington University in St. Louis"`                                  |

No body bullets.
**Category**: `leadership` (see Section 3.5).
**Has detail?**: `false`.

### 2.7 `honorentry` — `{date}{honor+institution}` (2 args)

| Pos | LaTeX role       | JSON field                | Required | Example (line 345–346)                                                                                |
| --- | ---------------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| #1  | Date/Year        | `start_date` = `end_date` | yes      | `"April 2026"`                                                                                        |
| #2  | Honor name + org | `title` + `organization`  | yes      | `"Bauer Leaders Academy (BLA) Leadership Development Badge"` + `"Washington University in St. Louis"` |

The 2nd arg in the LaTeX mixes the honor name and the awarding institution
joined by a comma. **Splitting rule**: split on the **last** comma; the
left side is `title` (strip surrounding `\textbf{...}` from the parser output
or keep it for the HTML template to handle — the parser MUST capture both
sides as discrete fields by stripping the `\textbf{...}` wrapper). The right
side is `organization`.

No body bullets.
**Category**: `awards`
**Has detail?**: `false`.

### 2.8 `skillcategory` — `{category_name}` (1 arg) + body

| Pos  | LaTeX role           | JSON field                                             | Required | Example (line 540–541)                                               |
| ---- | -------------------- | ------------------------------------------------------ | -------- | -------------------------------------------------------------------- |
| #1   | Category name        | `title` (or `category` tag)                            | yes      | `"Programming Languages"`                                            |
| body | Comma-separated list | `responsibilities[]` (or a dedicated `skills[]` array) | yes      | `"Java, C++, Python, R, JavaScript/TypeScript, PHP, C#, SQL, Rust."` |

> **Decision**: The schema does **not** require `skillcategory` to emit an
> Experience record. Skills are rendered as a static block on the page (one
> block per category). The parser MAY emit a synthetic Experience with
> `category: "professional"` and `has_detail: false` if the site design
> later unifies skills into the experience flow. **Default behaviour for
> Task 2: skip `skillcategory`** and write a separate `skills.json` blob
> keyed by category.

### 2.9 `onecolentry` (free-text, 0 args) — used for PUBLICATIONS & REFERENCES

PUBLICATIONS contains a single `\href`-rich citation; REFERENCES contains
the literal `"Available upon request."`.

| Pos  | LaTeX role    | JSON field      | Required | Example (line 217)      |
| ---- | ------------- | --------------- | -------- | ----------------------- |
| body | Full citation | `excerpt` (raw) | yes      | Full APA-style citation |

> **Decision**: PUBLICATIONS is best modelled as a single Experience with
> `category: "research"`, `has_detail: false`, `title` extracted from the
> first sentence (or `"<first 80 chars of citation>..."` if no clear title).
> REFERENCES emits no Experience record.

---

## 3. CV Section → Category Mapping

The CV has 11 `\section{...}` headings. The schema's category enum is
**strict** (`professional|education|research|leadership|awards`); every
emitted Experience record must be assigned exactly one of these values.

| CV `\section{...}` heading          | LaTeX line | Environment(s) used                 | Mapped category | Rationale                                                     |
| ----------------------------------- | ---------- | ----------------------------------- | --------------- | ------------------------------------------------------------- |
| `EDUCATION`                         | 61         | `educationentry`                    | `education`     | Direct match — degree-granting programs                       |
| `RESEARCH EXPERIENCE`               | 90         | `researchentry`                     | `research`      | Direct match — academic research with project titles          |
| `INDUSTRY EXPERIENCE`               | 155        | `experienceentry`                   | `professional`  | Direct match — paid industry/teaching work                    |
| `PUBLICATIONS`                      | 214        | `onecolentry`                       | `research`      | Academic output — research category                           |
| `PRESENTATIONS`                     | 226        | `presentationentry`                 | `leadership`    | Talks & workshops are service/discipline-leadership           |
| `PROJECTS`                          | 257        | `projectentry`                      | `research`      | Course / research / personal project portfolio                |
| `TEACHING & MENTORSHIP EXPERIENCE`  | 314        | `experienceentry`                   | `professional`  | Paid TA / lab assistant roles — same env, professional bucket |
| `GRANTS, FELLOWSHIPS, & AWARDS`     | 341        | `honorentry`                        | `awards`        | Direct match — competitive recognition                        |
| `PROFESSIONAL SERVICE & LEADERSHIP` | 409        | `leadershipentry` + `positionentry` | `leadership`    | Direct match — student government and committee service       |
| `TECHNICAL SKILLS & AFFILIATIONS`   | 537        | `skillcategory`                     | _(skipped)_     | Static skills block — not an Experience record by default     |
| `REFERENCES`                        | 570        | `onecolentry`                       | _(skipped)_     | Single free-text line — render statically                     |

### 3.1 Education section (line 61)

2 entries. Both `educationentry`. → 2 Experience records, `category: education`.

### 3.2 Research experience section (line 90)

5 entries. All `researchentry`. → 5 Experience records, `category: research`.

### 3.3 Industry experience section (line 155)

5 entries. All `experienceentry`. → 5 Experience records, `category: professional`.

### 3.4 Publications section (line 214)

1 `onecolentry` block. → 1 Experience record, `category: research`,
`has_detail: false`, `excerpt` = the full citation (HTML-escaped), `links[]`
= any `\href{url}{...}` discovered in the citation body, `start_date` =
`end_date` derived from the year token in the citation (e.g. `2026` →
`2026-01-01`).

### 3.5 Presentations section (line 226)

3 entries. All `presentationentry`. → 3 Experience records, `category: leadership`.

### 3.6 Projects section (line 257)

5 entries. All `projectentry`. → 5 Experience records, `category: research`.

> **Decision rationale**: The PROJECTS section is mostly course-driven or
> research-adjacent work (Datacenter Cooling, Interactive Storybook, etc.).
> Treating them as `research` aligns with the projects_database.json
> (`category: "Research & ML"` for the same items). If a future entry
> should be `professional`, the parser should expose a hint via a comment
> marker in the LaTeX — but **out of scope for Task 1**.

### 3.7 Teaching & mentorship section (line 314)

2 entries. Both `experienceentry`. → 2 Experience records, `category: professional`.

> **Resolution rule**: `experienceentry` is ambiguous — INDUSTRY EXPERIENCE
> and TEACHING & MENTORSHIP both use it. The parser MUST resolve category
> from the enclosing `\section{...}` heading:
>
> - `INDUSTRY EXPERIENCE` → `professional`
> - `TEACHING & MENTORSHIP EXPERIENCE` → `professional`
>
> (Both map to `professional` today. If a future revision wants to split
> teaching into its own category, add a new enum value and update both
> rows — do NOT change the existing map without a schema bump.)

### 3.8 Awards section (line 341)

10 entries. All `honorentry`. → 10 Experience records, `category: awards`.

### 3.9 Professional service & leadership section (line 409)

10 `leadershipentry` blocks, each containing exactly 1 `positionentry`. → 10
Experience records, `category: leadership`. The leadershipentry header is
**not** a record of its own — the record is keyed by the position.

### 3.10 Technical skills (line 537)

5 `skillcategory` blocks. → 0 Experience records (default). Parser writes
a sidecar `skills.json` shaped as:

```json
{
  "Programming Languages": [
    "Java",
    "C++",
    "Python",
    "R",
    "JavaScript/TypeScript",
    "PHP",
    "C#",
    "SQL",
    "Rust"
  ],
  "Frameworks & Libraries": [
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Keras",
    "NumPy",
    "Pandas",
    "Matplotlib",
    "Seaborn",
    "Node.js",
    "Vue.js",
    "React",
    "Socket.IO",
    "Gemini API",
    "OpenAI API"
  ],
  "Tools & Technologies": [
    "LaTeX",
    "Git",
    "Tableau",
    "Power BI",
    "MySQL",
    "AWS",
    "MongoDB",
    "Snowflake",
    "Apache Airflow",
    "Spark",
    "Kafka",
    "Flink",
    "Microsoft 365",
    "Google Workspace"
  ],
  "Core Competencies": [
    "Analytical Skills",
    "Problem Solving",
    "Critical Thinking",
    "Communication",
    "Team Collaboration",
    "Leadership",
    "Adaptability",
    "Project Management"
  ],
  "Languages": ["Proficient in English", "Kannada", "Telugu", "Conversational in Hindi"]
}
```

### 3.11 References (line 570)

1 `onecolentry` block. → 0 Experience records. Rendered as a static line on
the page (or omitted — the CV already says "Available upon request.").

### 3.12 Totals

| Section                           | Experience records |
| --------------------------------- | -----------------: |
| EDUCATION                         |                  2 |
| RESEARCH EXPERIENCE               |                  5 |
| INDUSTRY EXPERIENCE               |                  5 |
| PUBLICATIONS                      |                  1 |
| PRESENTATIONS                     |                  3 |
| PROJECTS                          |                  5 |
| TEACHING & MENTORSHIP EXPERIENCE  |                  2 |
| GRANTS, FELLOWSHIPS, & AWARDS     |                 10 |
| PROFESSIONAL SERVICE & LEADERSHIP |                 10 |
| TECHNICAL SKILLS & AFFILIATIONS   |        0 (sidecar) |
| REFERENCES                        |                  0 |
| **Total**                         |             **43** |

---

## 4. JSON Schema

The top-level artifact produced by `cv_parser.py` is a JSON array of
`Experience` objects. A single Experience conforms to:

```jsonc
{
  "id": "2024-08-ms-computer-science", // string, slug, unique (Section 5)
  "title": "M.S. Computer Science", // string, non-empty
  "category": "education", // enum: professional|education|research|leadership|presentations|awards
  "organization": "Washington University in St. Louis", // string, non-empty
  "location": "St. Louis, Missouri, USA", // string | null
  "role_context": null, // string | null
  "start_date": "2024-08-01", // string, YYYY-MM-DD
  "end_date": "2026-05-31", // string, YYYY-MM-DD | null (null = present)
  "excerpt": "Master's program in Computer Science at WashU.", // string
  "responsibilities": [
    // array<string>, ordered
    "GPA: 3.67/4.00",
    "Thesis: Toward Vehicle-Agnostic Driving Signatures ...",
    "Coursework: Neurobiology of Learning & Memory, ...",
  ],
  "related_projects": [], // array<string>, slugs of related projects_database.json entries
  "links": [
    // array<{label, url, type}>, ordered
    {
      "label": "Thesis",
      "url": "https://openscholarship.wustl.edu/eng_etds/1341/",
      "type": "publication",
    },
  ],
  "has_detail": true, // boolean
}
```

### 4.1 Field-by-field specification

| Field              | Type                      | Required | Validation                                                                                                                                                                                             |
| ------------------ | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`               | `string`                  | yes      | Matches `^[a-z0-9-]{1,80}$`. Globally unique across the experience array. Algorithm in Section 5.                                                                                                      |
| `title`            | `string`                  | yes      | 1–200 chars. Trimmed. No leading/trailing whitespace. The displayed headline.                                                                                                                          |
| `category`         | `string` (enum)           | yes      | One of: `professional`, `education`, `research`, `leadership`, `presentations`, `awards`. See Section 3 for mapping.                                                                                   |
| `organization`     | `string`                  | yes      | 1–200 chars. For `experienceentry` and `leadershipentry` this is the org; for `presentationentry` this is the venue/event; for `honorentry` this is the awarding institution (split from the 2nd arg). |
| `location`         | `string \| null`          | no       | Free-form. `null` when the env does not supply one (rare — every env in the CV does supply one).                                                                                                       |
| `role_context`     | `string \| null`          | no       | For `researchentry` only, this carries the course/mentor context string. For all other envs, set to `null`.                                                                                            |
| `start_date`       | `string` (date)           | yes      | ISO 8601 `YYYY-MM-DD`. See Section 6 for parsing rules.                                                                                                                                                |
| `end_date`         | `string \| null`          | yes      | ISO 8601 `YYYY-MM-DD` or `null` to mean "present" (in-progress). For single-date entries (awards, presentations) this equals `start_date`.                                                             |
| `excerpt`          | `string`                  | yes      | 1–500 chars. 1–2 sentence summary suitable for the card view. For awards/presentations/projects, a 1-sentence blurb; for full entries, the first bullet or a synthesized sentence.                     |
| `responsibilities` | `array<string>`           | yes      | `0 ≤ N`. Each item: 1–500 chars, trimmed. Order preserved from LaTeX.                                                                                                                                  |
| `related_projects` | `array<string>`           | yes      | `0 ≤ N`. Each item: slug from `projects_database.json`. May be empty (default). The site generator may cross-link; the parser does NOT need to resolve — just record candidate slugs.                  |
| `links`            | `array<{label,url,type}>` | yes      | `0 ≤ N`. Each `label` 1–80 chars, `url` matches `^https?://`, `type` ∈ `{"publication","github","demo","paper","talk","award","organization","other"}`. See Section 7 for extraction rules.            |
| `has_detail`       | `boolean`                 | yes      | `true` iff the entry has either non-empty `responsibilities[]` or non-empty `links[]`. `false` for single-line awards/presentations/publications without bullets or links.                             |

### 4.2 Category enum — exhaustive list

```
education     — degree-granting academic programs
research      — academic research projects, publications, course projects
professional  — paid industry/teaching/TA work
leadership    — student government, committees, presentations, talks
awards        — scholarships, honors, dean's list, prizes
```

No other values are allowed. The parser MUST raise a `SchemaError` if it
encounters a category that is not in the enum (e.g. a future CV section
should be added to the schema first, then to the parser).

### 4.3 Link `type` enum — exhaustive list

| Value          | When to use                                             |
| -------------- | ------------------------------------------------------- |
| `publication`  | `\href` pointing to a paper, thesis, or preprint server |
| `github`       | `github.com` repo URLs                                  |
| `demo`         | Live demo / personal-website project URLs               |
| `paper`        | Direct PDF / paper download                             |
| `talk`         | Slide deck, recording, or talk page                     |
| `award`        | Awarding body / program page                            |
| `organization` | Organization's own page (department, lab, club)         |
| `other`        | Anything not in the above                               |

### 4.4 Example — full record (researchentry, line 93–101)

```json
{
  "id": "2025-08-driving-signatures-cdr",
  "title": "Toward Vehicle-Agnostic Driving Signatures for Cognitive Impairment Prediction from Naturalistic Driving Data",
  "category": "research",
  "organization": "DRIVES Project, Washington University in St. Louis",
  "location": "St. Louis, Missouri, USA",
  "role_context": "Master's Thesis (Lab PI: Dr. Ganesh Babulal)",
  "start_date": "2025-08-01",
  "end_date": "2026-05-31",
  "excerpt": "End-to-end pipeline processing 26,968 participant-weeks of naturalistic driving data for CDR status prediction, comparing six models under leave-one-group-out cross-validation.",
  "responsibilities": [
    "Built an end-to-end pipeline processing 26,968 participant-weeks of naturalistic driving data from 304 participants, deriving weekly driving features and integrating demographic covariates for CDR status prediction.",
    "Compared six CDR prediction models (GRU-DANN, DANN, logistic regression, random forest, XGBoost, MLP) under leave-one-group-out cross-validation; GRU-DANN achieved highest participant-level ROC AUC (0.599) and balanced accuracy (0.584)."
  ],
  "related_projects": ["2026-04-ms-thesis"],
  "links": [
    {
      "label": "Thesis",
      "url": "https://openscholarship.wustl.edu/eng_etds/1341/",
      "type": "publication"
    }
  ],
  "has_detail": true
}
```

### 4.5 Example — single-date entry (honorentry, line 344–347)

```json
{
  "id": "2026-04-bla-leadership-badge",
  "title": "Bauer Leaders Academy (BLA) Leadership Development Badge",
  "category": "awards",
  "organization": "Washington University in St. Louis",
  "location": null,
  "role_context": null,
  "start_date": "2026-04-01",
  "end_date": "2026-04-01",
  "excerpt": "Recognized by the Bauer Leaders Academy for demonstrated leadership development.",
  "responsibilities": [],
  "related_projects": [],
  "links": [],
  "has_detail": false
}
```

---

## 5. Slug Generation

The `id` field is a URL-safe slug used for anchors (`#2024-08-ms-computer-science`)
and for cross-referencing from the projects page.

### 5.1 Algorithm

1. Concatenate `start_date`'s year and month with the title:
   - `{YYYY-MM}` + `-` + `slugify(title)`
2. `slugify(text)`:
   1. Lowercase the input.
   2. Replace any character that is not `[a-z0-9]` with a single hyphen `-`.
   3. Collapse runs of hyphens (`--` → `-`).
   4. Trim leading and trailing hyphens.
3. If the resulting slug exceeds **60 characters**, truncate at the last
   hyphen that keeps the slug ≤ 60 chars; if no such hyphen exists within
   60 chars, hard-truncate at 60 and strip any trailing hyphen.
4. Dedupe within the experience array: if the slug already exists, append
   `-2`, `-3`, … until unique. The **first** occurrence keeps the base
   slug; subsequent collisions get the suffix.

### 5.2 Worked examples

| Title                                                               | `start_date` | Raw slug                                                                                                                | After 60-char rule                                                             | Final `id`                                                                |
| ------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `M.S. Computer Science`                                             | 2024-08      | `2024-08-m-s-computer-science`                                                                                          | unchanged                                                                      | `2024-08-m-s-computer-science`                                            |
| `Toward Vehicle-Agnostic Driving Signatures …`                      | 2025-08      | `2025-08-toward-vehicle-agnostic-driving-signatures-for-cognitive-impairment-prediction-from-naturalistic-driving-data` | truncates to `2025-08-toward-vehicle-agnostic-driving-signatures-for-cognitiv` | `2025-08-toward-vehicle-agnostic-driving-signatures-for-cognitiv`         |
| `AI Engineer Intern`                                                | 2025-06      | `2025-06-ai-engineer-intern`                                                                                            | unchanged                                                                      | `2025-06-ai-engineer-intern`                                              |
| `Vice President of the Graduate-Professional Council (GPC) Chamber` | 2025-05      | `2025-05-vice-president-of-the-graduate-professional-council-gpc-chamber`                                               | unchanged                                                                      | `2025-05-vice-president-of-the-graduate-professional-council-gpc-chamber` |
| `Bauer Leaders Academy (BLA) Leadership Development Badge`          | 2026-04      | `2026-04-bauer-leaders-academy-bla-leadership-development-badge`                                                        | unchanged                                                                      | `2026-04-bauer-leaders-academy-bla-leadership-development-badge`          |
| (collision with above)                                              | 2026-04      | same as above                                                                                                           | unchanged                                                                      | `2026-04-bauer-leaders-academy-bla-leadership-development-badge-2`        |

### 5.3 Edge cases

| Input                                 | Rule                                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Title with leading article `A`, `The` | Keep them; do not strip. (Avoid ambiguity loss.)                                                                     |
| Title with `&`                        | Becomes `-and-` (e.g. `R&D` → `r-and-d`)                                                                             |
| Title with multiple spaces            | Each space becomes one hyphen; runs collapse.                                                                        |
| Title with parentheses                | Removed: `Open Source (OS)` → `open-source-os`                                                                       |
| Accented characters (rare in CV)      | Strip the diacritic (`é` → `e`). Use `unicodedata.normalize("NFKD", ...).encode("ascii", "ignore").decode("ascii")`. |
| Empty title after slugify             | Fall back to `entry-{N}` where N is the 1-based index in the section.                                                |

---

## 6. Date Parsing Rules

The CV uses several date formats. The parser must handle each:

| LaTeX form                                   | `start_date` | `end_date`   | Notes                                        |
| -------------------------------------------- | ------------ | ------------ | -------------------------------------------- |
| `August 2024 - May 2026`                     | `2024-08-01` | `2026-05-31` | day = 1 for start, last-day-of-month for end |
| `June 2025 - August 2025`                    | `2025-06-01` | `2025-08-31` | same                                         |
| `September 2021 - May 2023`                  | `2021-09-01` | `2023-05-31` | same                                         |
| `May 2022 - July 2022`                       | `2022-05-01` | `2022-07-31` | same                                         |
| `January 2026 - May 2026`                    | `2026-01-01` | `2026-05-31` | same                                         |
| `September 2024` (single date, presentation) | `2024-09-01` | `2024-09-01` | both fields equal; set to first of month     |
| `April 2026` (single date, honor)            | `2026-04-01` | `2026-04-01` | both fields equal; set to first of month     |
| `August 2025 - Present` (if it ever occurs)  | `2025-08-01` | `null`       | "Present" maps to `null`                     |

> **Decision**: end-of-month last-day values use `calendar.monthrange(year, month)[1]`.
> This makes ordering and overlap checks trivial and avoids inventing arbitrary
> day-of-month values (no `00`, no `99`).

> **Future-proofing**: The CV does not currently include `Present` literally
> (all ranges are bounded). If a future revision uses it, the parser must
> emit `end_date: null` and the renderer should display "Present".

---

## 7. Link Extraction Rules

`\href{url}{display_text}` is the only link syntax in the CV. The parser
should:

1. Walk the title (and any other LaTeX args) for `\href{URL}{TEXT}`.
2. Strip the wrapper; capture `URL` as the `url` and `TEXT` (after stripping
   nested LaTeX commands) as the `label`.
3. Classify `type` by URL hostname / path heuristics:

| URL pattern                                                         | Inferred `type` |
| ------------------------------------------------------------------- | --------------- |
| `github.com/...`                                                    | `github`        |
| `openscholarship.wustl.edu/...` or `arxiv.org/...` or `doi.org/...` | `publication`   |
| ends in `.pdf`                                                      | `paper`         |
| `agreddy.com/<project>/`                                            | `demo`          |
| `docs.google.com/presentation/...`                                  | `talk`          |
| domain matches the `organization` field                             | `organization`  |
| otherwise                                                           | `other`         |

> **Manual override**: If a future entry needs a non-default type, the
> parser should not try to be clever. Stick to the URL-pattern table above
> and let the HTML template (or a post-parse manual edit) override.

---

## 8. Excerpt Generation Rules

The schema requires a 1–2 sentence `excerpt` per record. Heuristics:

1. **If `responsibilities` is non-empty**: take the **first** bullet, trim to
   280 chars, append `…` if truncated.
2. **If `responsibilities` is empty AND `category == awards`**: synthesize
   from the title, e.g. `"Recognized for <title stripped of 'Award' / 'Prize'>."`.
3. **If `responsibilities` is empty AND `category == leadership` (presentation)**: synthesize
   `Delivered a talk titled "<title>" at <organization>.`.
4. **If `responsibilities` is empty AND `category == research` (publication)**: use the
   raw citation text (HTML-escaped) as the excerpt, truncated to 480 chars.
5. **Hard cap**: 500 chars. Truncate at the last word boundary before the
   limit and append `…`.

---

## 9. Parser Checklist (Hand-off to Task 2)

The `cv_parser.py` implementation MUST:

- [ ] Read `reddy_cv.tex` and `reddy_cv.sty` from disk.
- [ ] Tokenize on `\begin{env}` / `\end{env}` boundaries.
- [ ] Use a section-tracker to remember the current `\section{...}` heading
      (needed to resolve `experienceentry`'s category ambiguity).
- [ ] Handle the **nested** `leadershipentry` + `positionentry` pair by
      emitting one record per inner `positionentry` and copying the parent
      org/location.
- [ ] Strip LaTeX wrappers from the title: `\textbf{...}`, `\textit{...}`,
      `\href{URL}{TEXT}` → keep `TEXT` as title and capture the URL into
      `links[]` (Section 7).
- [ ] Emit exactly the 43 records enumerated in Section 3.12 (plus the
      sidecar `skills.json`).
- [ ] Validate each record against the schema in Section 4.1 before
      serializing. Fail loudly on any validation error.
- [ ] Write the final array to `personal-website/scripts/experience_database.json`.
- [ ] Write the skills sidecar to `personal-website/scripts/skills.json`.

---

## 10. Open Questions / Future Work

| Question                                                                                                              | Status                                                                                                       | Owner         |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| Should `projectentry` ever be `category: "professional"` for industry-style work?                                     | Open — currently always `research`. Schema allows reclassification.                                          | Parser author |
| Add a `featured: boolean` flag for entries highlighted on the home page?                                              | Out of scope for Task 1. Add to schema when needed.                                                          | Site author   |
| Should the `PUBLICATIONS` `onecolentry` be split if multiple citations are added later?                               | Yes — when 2+ citations appear, switch to a new env (e.g. `publicationentry` mirroring `presentationentry`). | CV author     |
| Should the parser emit `related_projects[]` automatically by string-matching titles against `projects_database.json`? | Out of scope for Task 1. The site generator can do this at render time.                                      | Site author   |
