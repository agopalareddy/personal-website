#!/usr/bin/env python3
"""
generate_site.py — Experience and project detail + listing page
generator for Aadarsha Gopala Reddy's personal website.

Reads `scripts/experience_database.json` (produced by `cv_parser.py`) and
`scripts/projects_database.json` (the hand-curated project catalog) and:

  * Writes one detail HTML file per Experience entry into
    `experience/{category}/{slug}.html`, sharing the same `<head>`, nav,
    sidebar, and footer chrome as the rest of the site via `scripts.chrome`.
  * Splices the experience data into the existing `experience/index.html`
    via `sync_experience_listing_page()`: the `<script type="application/json"
    class="experiences-data">` payload and the `<noscript>` fallback cards
    are regenerated in place, while the hand-evolved page chrome (TOC
    sidebar, org/year filter controls, Font Awesome version, inline
    `JSON.parse` bootstrap for the runtime `experience-catalog.js`) is
    preserved untouched.  The full-page template
    (`generate_experience_listing_page`) is only used as a bootstrap
    fallback when `experience/index.html` does not exist at all.
  * Writes `sitemap.xml` at the repo root covering every public page
    (referenced by `robots.txt`).
  * Writes one detail HTML file per project (with `has_detail=True`) into
    `projects/{id}.html`, using the shared chrome and a body identical in
    structure to the original `generate_portfolio.py` output.
  * Re-runs the `update_project_catalog_array()` pass to regex-replace
    the JSON array inside the `<script type="application/json"
    class="projects-data">` block in `projects/index.html`, so the runtime
    catalog stays in sync with the database.

Usage:
    python3 scripts/generate_site.py --experiences
    python3 scripts/generate_site.py --projects

Public API (importable):
    from scripts.generate_site import (
        generate_experience_detail_page,
        generate_experience_listing_page,
        sync_experience_listing_page,
        generate_project_detail_page,
        update_project_catalog_array,
        generate_sitemap,
    )
"""

from __future__ import annotations

import argparse
import json
import os
import sys

# Allow imports from scripts/ directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import re
from typing import Any

from icons import ICONS  # noqa: E402

# ---------------------------------------------------------------------------
# Path bootstrap: allow `from scripts.chrome import ...` to work whether the
# script is invoked as `python3 scripts/generate_site.py` (from the repo
# root) or as a module (`python3 -m scripts.generate_site`).  We add
# BASE_DIR (the personal-website/ root) to sys.path so the `scripts/`
# sibling package is importable.
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from scripts.chrome import (  # noqa: E402  (import after sys.path tweak)
    render_head,
    render_page_wrapper,
)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EXPERIENCE_JSON = os.path.join(SCRIPT_DIR, "experience_database.json")
EXPERIENCE_DIR = os.path.join(BASE_DIR, "experience")

PROJECTS_JSON = os.path.join(SCRIPT_DIR, "projects_database.json")
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")

VALID_CATEGORIES = (
    "professional",
    "education",
    "research",
    "leadership",
    "awards",
    "presentations",
)

# Canonical filter order in the listing page.  "all" is the synthetic
# "show everything" filter and must be first.
FILTER_PILLS = (
    ("all", "All"),
    ("professional", "Professional"),
    ("education", "Education"),
    ("research", "Research"),
    ("leadership", "Leadership"),
    ("presentations", "Presentations"),
    ("awards", "Awards"),
)

# Friendly display label for each category badge.  Keys must match the
# schema's `category` enum; values are the user-facing label.
CATEGORY_LABELS: dict[str, str] = {
    "professional": "Professional",
    "education": "Education",
    "research": "Research",
    "leadership": "Leadership",
    "awards": "Awards",
    "presentations": "Presentations",
}

# Map link type -> Octicon key. Falls back to LINK_EXTERNAL_16.
LINK_TYPE_ICONS: dict[str, str] = {
    "publication": "FILE_16",
    "github": "MARK_GITHUB_16",
    "demo": "ROCKET_16",
    "paper": "FILE_16",
    "talk": "FILE_16",
    "award": "TROPHY_16",
    "organization": "ORGANIZATION_16",
    "other": "LINK_EXTERNAL_16",
}

# Map month number -> short English month name used by the date range helper.
MONTH_NAMES_SHORT = (
    None,  # 1-indexed
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def html_escape(text: str) -> str:
    """Escape the four characters that matter in HTML body / attribute contexts."""
    if text is None:
        return ""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def format_month_year(iso_date: str | None) -> str:
    """
    Format an ISO date `YYYY-MM-DD` as `Mon YYYY` (e.g. `2024-08-01` -> `Aug 2024`).
    Returns an empty string for None or malformed input.
    """
    if not iso_date:
        return ""
    m = re.match(r"^(\d{4})-(\d{2})-\d{2}$", iso_date)
    if not m:
        return iso_date
    year = int(m.group(1))
    month = int(m.group(2))
    if not 1 <= month <= 12:
        return iso_date
    return f"{MONTH_NAMES_SHORT[month]} {year}"


def format_date_range(start_date: str | None, end_date: str | None) -> str:
    """
    Format a start/end ISO date pair as `Start – End` (with an en dash).
    `end_date` of `None` renders as `Present`.  Returns empty string if
    `start_date` is missing.
    """
    start = format_month_year(start_date)
    if not start:
        return ""
    if end_date is None:
        return f"{start} \u2013 Present"
    end = format_month_year(end_date)
    if not end or end == start:
        return start
    return f"{start} \u2013 {end}"


def experience_order_date(entry: dict[str, Any]) -> str:
    """
    Date used for chronological ordering and timeline grouping.

    For completed credentials, awards, roles, and projects, the relevant
    timeline date is completion/receipt time (`end_date`), not start time.
    """
    return entry.get("end_date") or entry.get("start_date") or "1970-01-01"


def experience_order_year(entry: dict[str, Any]) -> str:
    """Four-digit year derived from `experience_order_date()`."""
    return experience_order_date(entry)[:4]


def organization_short_label(org: str | None) -> str:
    """Short organization label used where role titles need more context."""
    if not org:
        return ""
    lower = org.lower()
    if "washington university" in lower:
        if "drives" in lower:
            return "Washington University (DRIVES)"
        return "Washington University in St. Louis"
    if "ohio wesleyan" in lower:
        return "Ohio Wesleyan University"
    if "crittero" in lower:
        return "Crittero"
    if "lab714" in lower:
        return "Lab714"
    if "mitxsurestart" in lower or "mitx" in lower:
        return "MITxSureStart"
    if "denison" in lower:
        return "Denison University"
    if "next genius" in lower:
        return "Next Genius"
    if "ages & science coach" in lower:
        return "Science Coach"
    if "spring student symposium" in lower:
        return "OWU Symposium"
    if "patricia belt conrades" in lower:
        return "OWU Symposium"
    if "graduate student affairs" in lower or "gsaab" in lower:
        return "GSAAB"
    if "career engagement" in lower or "cce" in lower:
        return "CCE Board"
    if "umang" in lower:
        return "Umang"
    if "hackwashu" in lower:
        return "HackWashU"
    if "hindu student" in lower:
        return "HSC"
    if "gpsc" in lower or "student council" in lower:
        return "GPSC"
    if "wesleyan council" in lower or "wcsa" in lower:
        return "WCSA"
    if "neurds" in lower:
        return "The Neurds"
    if "programming board" in lower:
        return "CPB"
    if "mathematics, computer science" in lower:
        return "Math/CS Board"
    return org.split(",", 1)[0].strip()


def experience_display_title(entry: dict[str, Any]) -> str:
    """Title shown on cards and in the listing TOC."""
    title = (entry.get("title") or "").strip()
    if not title or entry.get("category") != "leadership":
        return title

    org = (entry.get("organization") or "").strip()
    org_short = organization_short_label(org)
    if not org_short:
        return title
    if org_short in {"Science Coach", "OWU Symposium"}:
        return title

    title_lower = title.lower()
    if org_short.lower() in title_lower or (org and org.lower() in title_lower):
        return title

    return f"{title} - {org_short}"


def category_label(cat: str) -> str:
    """Friendly display label for a category, falling back to the raw slug."""
    return CATEGORY_LABELS.get(cat, cat.replace("-", " ").title() if cat else "")


def link_icon(link_type: str | None) -> str:
    """FontAwesome 5 class for a link type, with safe fallback."""
    return LINK_TYPE_ICONS.get(link_type or "", "LINK_EXTERNAL_16")


# ---------------------------------------------------------------------------
# Detail page
# ---------------------------------------------------------------------------


def generate_experience_detail_page(entry: dict[str, Any]) -> str:
    """
    Render a single Experience entry as a complete HTML5 document.

    Layout (inside `<article class="academic-content">`):
      * h1 — title
      * meta line — organization + role/context + date range
      * location line (if present)
      * category badge
      * <section class="page__content"> with <ul> of responsibilities
      * Related Projects section (if `related_projects` non-empty)
      * Links section (if `links` non-empty)
      * Footer nav back to listing
    """
    title = (entry.get("title") or "").strip()
    organization = (entry.get("organization") or "").strip()
    location = entry.get("location")
    role_context = entry.get("role_context")
    category = entry.get("category") or ""
    start_date = entry.get("start_date")
    end_date = entry.get("end_date")
    responsibilities = entry.get("responsibilities") or []
    related_projects = entry.get("related_projects") or []
    links = entry.get("links") or []
    slug = entry.get("id") or ""

    # Safe excerpts for OG/description fall back to the title.
    excerpt = (entry.get("excerpt") or "").strip() or title
    description = excerpt
    canonical_url = f"https://agreddy.com/experience/{category}/{slug}.html"

    # ---- Head -------------------------------------------------------------
    head_html = render_head(
        title=title,
        description=description,
        canonical_url=canonical_url,
        og_type="article",
    )

    # ---- Body fragments ---------------------------------------------------
    title_esc = html_escape(title)
    org_esc = html_escape(organization)
    label = category_label(category)
    cat_class = f"cat-{category}" if category else ""
    badge = (
        f'<span class="card-category {html_escape(cat_class)}">'
        f"{html_escape(label)}</span>"
        if cat_class
        else ""
    )

    # Meta line: organization · role_context · date range
    meta_bits: list[str] = []
    if organization:
        meta_bits.append(f"<strong>{org_esc}</strong>")
    if role_context:
        meta_bits.append(html_escape(role_context))
    date_range = format_date_range(start_date, end_date)
    if date_range:
        meta_bits.append(html_escape(date_range))
    # NOTE: wrap the .join() in parens so Python's implicit string
    # concatenation doesn't fold the separator literal into the preceding
    # <p> opening tag (which would call .join on the entire tag string
    # and produce a malformed HTML structure).
    meta_html = (
        (
            '<p class="entry-meta" '
            'style="font-family: var(--font-body); font-size: 0.95rem; '
            'color: var(--text-secondary); margin: 0 0 0.5rem 0;">'
            + (" &mdash; ".join(meta_bits))
            + "</p>"
        )
        if meta_bits
        else ""
    )

    # Location line (optional)
    location_html = ""
    if location:
        location_html = (
            f'<p class="entry-location" '
            f'style="font-family: var(--font-body); font-size: 0.85rem; '
            f'color: var(--text-muted); margin: 0 0 1.25rem 0;">'
            f"{ICONS.get('LOCATION_16', '')} "
            f"{html_escape(location)}</p>"
        )

    # Badge line
    badge_html = (
        f'<div class="entry-badge" style="margin-bottom: 1.5rem;">{badge}</div>'
        if badge
        else ""
    )

    # Responsibilities list (heading adapts to the entry kind)
    if responsibilities:
        if entry.get("is_presentation") or category == "awards":
            section_heading = "About"
        elif category == "education":
            section_heading = "Highlights"
        else:
            section_heading = "Responsibilities &amp; Contributions"
        items = "\n".join(
            f"            <li>{html_escape(r)}</li>" for r in responsibilities if r
        )
        responsibilities_html = (
            '<section class="page__content" style="margin-bottom: 2rem;">\n'
            '            <h2 style="font-family: var(--font-heading); '
            "font-size: 1.25rem; margin-bottom: 0.75rem; "
            f'color: var(--text-primary);">{section_heading}</h2>\n'
            f"            <ul>\n{items}\n            </ul>\n"
            "        </section>"
        )
    else:
        responsibilities_html = ""

    # Related projects
    related_html = ""
    if related_projects:
        proj_items = "\n".join(
            f'            <li><a href="/projects/{html_escape(p)}.html">'
            f"{html_escape(p)}</a></li>"
            for p in related_projects
            if p
        )
        related_html = (
            '<section class="related-projects" style="margin-bottom: 2rem;">\n'
            '            <h2 style="font-family: var(--font-heading); '
            "font-size: 1.25rem; margin-bottom: 0.75rem; "
            'color: var(--text-primary);">Related Projects</h2>\n'
            f"            <ul>\n{proj_items}\n            </ul>\n"
            "        </section>"
        )

    # Links
    links_html = ""
    if links:
        link_items: list[str] = []
        for lnk in links:
            if not isinstance(lnk, dict):
                continue
            url = (lnk.get("url") or "").strip()
            label_text = (lnk.get("label") or url).strip() or url
            ltype = lnk.get("type") or "other"
            icon = link_icon(ltype)
            is_external = url.startswith("http://") or url.startswith("https://")
            extra = ""
            if is_external:
                extra = ' target="_blank" rel="noopener"'
            sr_only = (
                ' <span class="sr-only">(opens in a new tab)</span>'
                if is_external
                else ""
            )
            icon_svg = ICONS.get(icon, "")
            link_items.append(
                f"            <li>"
                f'<a href="{html_escape(url)}"{extra}>'
                f"{icon_svg} "
                f"{html_escape(label_text)}"
                f"{sr_only}</a></li>"
            )
        if link_items:
            links_html = (
                '<section class="entry-links" style="margin-bottom: 2rem;">\n'
                '            <h2 style="font-family: var(--font-heading); '
                "font-size: 1.25rem; margin-bottom: 0.75rem; "
                'color: var(--text-primary);">Links</h2>\n'
                "            <ul>\n"
                + "\n".join(link_items)
                + "\n            </ul>\n        </section>"
            )

    # Back to listing
    back_link = (
        '<p style="margin-top: 2.5rem; font-size: 0.9rem;">'
        '<a href="/experience/">&larr; Back to all experience</a></p>'
    )

    body_html = (
        f'<h1 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">'
        f"{title_esc}</h1>"
        f"{meta_html}"
        f"{location_html}"
        f"{badge_html}"
        f"{responsibilities_html}"
        f"{related_html}"
        f"{links_html}"
        f"{back_link}"
    )

    return render_page_wrapper(
        head_html=head_html,
        body_html=body_html,
        active_page="experience",
    )


# ---------------------------------------------------------------------------
# Listing page
# ---------------------------------------------------------------------------


def _render_filter_pills() -> str:
    """Render the 6 filter pills (All + 5 categories)."""
    parts: list[str] = []
    for idx, (key, label) in enumerate(FILTER_PILLS):
        pressed = "true" if key == "all" else "false"
        active_cls = " active" if key == "all" else ""
        parts.append(
            f'<button class="filter-btn{active_cls}" '
            f'data-filter="{html_escape(key)}" '
            f'aria-pressed="{pressed}">'
            f"{html_escape(label)}</button>"
        )
    return "\n                    ".join(parts)


def _render_noscript_card(e: dict[str, Any]) -> str:
    """Render one static, no-JS fallback card in the committed listing style
    (`project-card spotlight-card timeline-card`, matching the JS renderer)."""
    cat = e.get("category") or ""
    display_title = experience_display_title(e)
    title = html_escape(display_title)
    org = html_escape((e.get("organization") or "").strip())
    date_range_esc = html_escape(
        format_date_range(e.get("start_date"), e.get("end_date"))
    )
    excerpt = html_escape((e.get("excerpt") or "").strip())
    slug = e.get("id") or ""
    label = category_label(cat)
    permalink = f"/experience/{cat}/{slug}.html" if cat and slug else "/experience/"
    venue_txt = f"{org} &bull; {date_range_esc}" if org else date_range_esc
    aria = html_escape(f"Explore dedicated detail page for {display_title}")

    info_icon = ICONS.get("INFO_16", "")
    return (
        f'                  <div class="project-card timeline-card">\n'
        f'                    <div class="card-meta">\n'
        f'                      <span class="card-category cat-{html_escape(cat)}">'
        f"{html_escape(label)}</span>\n"
        f'                      <span class="card-venue">{venue_txt}</span>\n'
        f"                    </div>\n"
        f'                    <h3 class="project-title">\n'
        f'                      <a href="{html_escape(permalink)}" '
        f'aria-label="{aria}">{title}</a>\n'
        f"                    </h3>\n"
        f'                    <p class="project-excerpt">{excerpt}</p>\n'
        f'                    <div class="card-actions">\n'
        f'                      <a href="{html_escape(permalink)}" '
        f'class="card-btn btn-detail" aria-label="{aria}"'
        f">{info_icon} Details</a>\n"
        f"                    </div>\n"
        f"                  </div>"
    )


def _render_noscript_cards(entries: list[dict[str, Any]]) -> str:
    """Render the static, no-JS fallback card list: newest first, grouped
    under `timeline-year` headers by completion/receipt year (mirrors the JS
    renderer)."""
    entries_sorted = sorted(
        (e for e in entries if e),
        key=lambda e: (experience_order_date(e), e.get("start_date") or ""),
        reverse=True,
    )
    parts: list[str] = []
    year: str | None = None
    for e in entries_sorted:
        y = experience_order_year(e)
        if y != year:
            year = y
            parts.append(f'                  <h2 class="timeline-year">{y}</h2>')
        parts.append(_render_noscript_card(e))
    return "\n".join(parts)


def generate_experience_listing_page(entries: list[dict[str, Any]]) -> str:
    """
    Render the full HTML5 listing page at `experience/index.html`.

    Includes:
      * Filter pills (6 buttons)
      * Search input
      * Sort select
      * `<div class="project-grid" id="experienceGrid">` populated with a
        `<noscript>` fallback of static cards
      * Empty-state div
      * Embedded `application/json` "experiences-data" payload (with
        `content_html` stripped) plus a `JSON.parse` bootstrap that exposes
        it as `const experiences` for the runtime consumer
      * `<script src="/assets/js/experience-catalog.js"></script>` include

    NOTE: this template is a *bootstrap fallback* only — the committed
    `experience/index.html` has hand-evolved chrome (TOC sidebar, org/year
    filters, Font Awesome upgrades) that this template does not reproduce.
    Routine regeneration must go through `sync_experience_listing_page()`,
    which splices data into the existing file instead.
    """
    # chrome.render_head appends " - Aadarsha Gopala Reddy" to the
    # supplied title, so we pass the bare page name to avoid a
    # double-suffix ("Professional Experience — Aadarsha Gopala Reddy
    # - Aadarsha Gopala Reddy") in the final <title>.
    title = "Experience"
    description = (
        "Aadarsha Gopala Reddy's professional, research, leadership, "
        "and academic experience."
    )
    canonical_url = "https://agreddy.com/experience/"

    head_html = render_head(
        title=title,
        description=description,
        canonical_url=canonical_url,
        og_type="website",
    )

    # Build a lightweight copy of the entries for the embedded JS array.
    # The Task spec says "strip content_html from embedded copy" — experience
    # records don't carry a `content_html` field, so the strip is a no-op,
    # but we honor the spec by producing a fresh dict per entry.
    lightweight = [
        {k: v for k, v in (e or {}).items() if k != "content_html"} for e in entries
    ]
    serialized_array = json.dumps(lightweight, indent=2, ensure_ascii=False)

    pills_html = _render_filter_pills()
    noscript_cards = _render_noscript_cards(entries)

    body_html = f"""<h1 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Experience
            </h1>
            <p style="font-family: var(--font-body); font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 2.5rem;">
                A curated catalog of my professional, research, leadership, and academic experience. Filter by category, search by keyword, or sort chronologically.
            </p>

            <div class="experience-container">
                <search>
                    <div class="experience-controls" style="flex-direction: column; align-items: stretch; gap: 1rem;">
                        <!-- First Row: Search & Filters -->
                        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center; width: 100%;">
                            <div class="filter-pills" role="group" aria-label="Category Filters">
                    {pills_html}
                            </div>
                            <div class="search-wrapper">
                                <span class="search-icon">{ICONS.get("SEARCH_16", "")}</span>
                                <input
                                    type="search"
                                    class="search-input"
                                    id="experienceSearch"
                                    aria-label="Search experience by title, organization, or keyword"
                                    placeholder="Search experience..."
                                />
                            </div>
                        </div>

                        <!-- Second Row: Sort -->
                        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem; width: 100%;">
                            <div class="select-wrapper">
                                <select
                                    class="custom-select"
                                    id="experienceSort"
                                    aria-label="Sort experience chronologically or alphabetically"
                                >
                                    <option value="date-desc">Newest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="title-asc">Title A-Z</option>
                                </select>
                                <span class="select-icon">{ICONS.get("CHEVRON_DOWN_16", "")}</span>
                            </div>
                        </div>
                    </div>
                </search>

                <div class="project-grid" id="experienceGrid" style="margin-top: 1.5rem;">
                    <!--
                      SSR fallback: a static card grid for visitors with
                      JavaScript disabled.  The runtime catalog script
                      (assets/js/experience-catalog.js) clears and re-renders
                      this container when JS is enabled.  The embedded
                      application/json payload below is the authoritative
                      data source.
                    -->
                    <script type="application/json" class="experiences-data">
{serialized_array}
                    </script>
                    <noscript>
{noscript_cards}
                    </noscript>
                </div>

                <div id="emptyState" class="empty-state" hidden>
                    No experience entries match your search or filter criteria.
                </div>
            </div>

            <script>
                // Authoritative data for the runtime catalog renderer — parsed
                // from the application/json "experiences-data" payload embedded
                // in #experienceGrid above (single source of truth, spliced in
                // place by scripts/generate_site.py --experiences).
                const experiences = JSON.parse(
                    document.querySelector('#experienceGrid script.experiences-data').textContent
                );
            </script>
            <script src="/assets/js/experience-catalog.js"></script>"""

    return render_page_wrapper(
        head_html=head_html,
        body_html=body_html,
        active_page="experience",
    )


# ---------------------------------------------------------------------------
# Listing page sync (in-place splice into the committed index.html)
# ---------------------------------------------------------------------------


def sync_experience_listing_page(entries: list[dict[str, Any]]) -> bool:
    """
    Splice the experience data into the existing `experience/index.html`
    without touching the rest of the page:

      1. Replace the `<script type="application/json"
         class="experiences-data">` payload with a lightweight copy of
         `entries` (no `content_html`).
      2. Rebuild the `<noscript>` fallback card list (newest first, grouped
         by start year).

    The hand-evolved chrome around those two islands (TOC sidebar, org/year
    filter controls, the inline `JSON.parse` bootstrap, Font Awesome
    version) is preserved verbatim.  Returns True on a successful write.

    If the listing page does not exist at all, falls back to writing the
    bootstrap template via `generate_experience_listing_page()` (with a
    warning, since the template lacks the hand-evolved chrome).
    """
    listing_path = os.path.join(EXPERIENCE_DIR, "index.html")
    if not os.path.exists(listing_path):
        print(
            f"[generate_site] WARNING: {listing_path} missing — writing the "
            "bootstrap template. It lacks the hand-evolved chrome (TOC, "
            "org/year filters); restore the committed file from git if "
            "possible.",
            file=sys.stderr,
        )
        with open(listing_path, "w", encoding="utf-8") as f:
            f.write(generate_experience_listing_page(entries))
        return True

    with open(listing_path, "r", encoding="utf-8") as f:
        content = f.read()

    lightweight = [
        {k: v for k, v in (e or {}).items() if k != "content_html"} for e in entries
    ]
    serialized = json.dumps(lightweight, indent=2, ensure_ascii=False)

    content, n_json = re.subn(
        r'(<script\s+type="application/json"\s+class="experiences-data"\s*>).*?(</script>)',
        lambda m: m.group(1) + "\n" + serialized + "\n                " + m.group(2),
        content,
        count=1,
        flags=re.DOTALL,
    )
    if n_json != 1:
        print(
            "[generate_site] ERROR: experiences-data JSON block not found in "
            f"{listing_path}; aborting sync (page left untouched).",
            file=sys.stderr,
        )
        return False

    noscript = (
        "<noscript>\n"
        + _render_noscript_cards(entries)
        + "\n                </noscript>"
    )
    content, n_noscript = re.subn(
        r"<noscript>.*?</noscript>",
        lambda _m: noscript,
        content,
        count=1,
        flags=re.DOTALL,
    )
    if n_noscript != 1:
        print(
            f"[generate_site] ERROR: <noscript> block not found in "
            f"{listing_path}; aborting sync (page left untouched).",
            file=sys.stderr,
        )
        return False

    with open(listing_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(
        f"[generate_site] spliced {len(entries)} experience entries into "
        f"{listing_path} (JSON payload + noscript cards)"
    )
    return True


# ---------------------------------------------------------------------------
# Project detail page
# ---------------------------------------------------------------------------


def generate_project_detail_page(project: dict[str, Any]) -> str:
    """
    Render a single project record (from `projects_database.json`) as a
    complete HTML5 document using the shared `chrome.render_page_wrapper`.

    Layout (inside `<article class="academic-content">`):
      * h1 — project title
      * italic venue + formatted date line
      * <section class="page__content"> with `content_html` (if any)
      * Technologies Applied section (tech-tag spans)
      * Action buttons row (GitHub / Demo / PDF / Slides — same pattern as
        `generate_portfolio.py`)

    Returns the full HTML string (does not write to disk; the caller
    decides where to place the file).
    """
    clean_title = project["title"]
    desc_escaped = project["excerpt"].replace('"', "&quot;").replace("'", "&apos;")
    slug = project["permalink"].rsplit("/", 1)[-1]
    canonical_url = f"https://agreddy.com/projects/{slug}.html"
    tech_tags_html = "".join(
        f'<span class="tech-tag">{t}</span>' for t in project["technologies"]
    )

    # Action buttons: GitHub, Demo, PDF Paper, Slides — Octicons
    gh_icon = ICONS.get("MARK_GITHUB_16", "")
    demo_icon = ICONS.get("ROCKET_16", "")
    file_icon = ICONS.get("FILE_16", "")
    action_buttons: list[str] = []
    if project.get("github"):
        action_buttons.append(
            f'<a href="{project["github"]}" target="_blank" rel="noopener" '
            f'class="card-btn btn-github">{gh_icon}'
            f' GitHub <span class="sr-only">'
            f"(opens in a new tab)</span></a>"
        )
    if project.get("demo"):
        action_buttons.append(
            f'<a href="{project["demo"]}" class="card-btn btn-demo">'
            f"{demo_icon} Demo</a>"
        )
    if project.get("pdf"):
        action_buttons.append(
            f'<a href="{project["pdf"]}" target="_blank" rel="noopener" '
            f'class="card-btn btn-pdf">{file_icon}'
            f' PDF Paper <span class="sr-only">'
            f"(opens in a new tab)</span></a>"
        )
    if project.get("presentation"):
        action_buttons.append(
            f'<a href="{project["presentation"]}" target="_blank" '
            f'rel="noopener" class="card-btn btn-pdf">'
            f"{file_icon}"
            f' Slides <span class="sr-only">(opens in a new tab)</span></a>'
        )

    actions_bar = (
        f'<div class="card-actions" style="margin-top: 2rem; '
        f'justify-content: flex-start; gap: 1rem;">'
        f"{''.join(action_buttons)}</div>"
        if action_buttons
        else ""
    )

    # ---- Head -------------------------------------------------------------
    head_html = render_head(
        title=clean_title,
        description=desc_escaped,
        canonical_url=canonical_url,
        og_type="article",
    )

    # ---- Body -------------------------------------------------------------
    # Indentation matches the original `generate_portfolio.py` output: the
    # first line sits flush against the wrapper's 20-space prefix, and
    # subsequent lines carry 20 / 24 spaces of leading whitespace so they
    # line up under the opening `<article class="academic-content">` tag.
    body_html = f"""<h1 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">{clean_title}</h1>
                    <p style="font-family: var(--font-body); font-size: 0.9rem; font-style: italic; color: var(--text-muted); margin-bottom: 2rem;">
                        {project["venue"]} &mdash; {project["formatted_date"]}
                    </p>
                    <section class="page__content">
                        {project.get("content_html", "")}
                    </section>
                    
                    <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                        <h4 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-primary);">Technologies Applied</h4>
                        <div class="project-tech">{tech_tags_html}</div>
                    </div>

                    {actions_bar}"""

    return render_page_wrapper(
        head_html=head_html,
        body_html=body_html,
        active_page="projects",
    )


# ---------------------------------------------------------------------------
# Project catalog array sync (regex replace inside projects/index.html)
# ---------------------------------------------------------------------------


def _render_project_noscript_cards(projects: list[dict[str, Any]]) -> str:
    """Render the static, no-JS fallback card grid for projects."""
    sorted_projects = sorted(
        projects, key=lambda x: x.get("date") or "1970-01-01", reverse=True
    )

    venue_labels = {
        "WashU": "Washington University in St. Louis",
        "OWU": "Ohio Wesleyan University",
        "MITxSureStart": "MITxSureStart",
        "Personal": "Personal Projects",
    }

    cards: list[str] = []
    for p in sorted_projects:
        title = html_escape((p.get("title") or "").replace("&apos;", "'"))
        excerpt = html_escape((p.get("excerpt") or "").replace("&apos;", "'"))
        venue_tag = p.get("venue_tag") or ""
        venue_label = venue_labels.get(venue_tag, venue_tag)
        formatted_date = html_escape(p.get("formatted_date") or "")
        category = p.get("category") or ""
        slug = p.get("id") or ""
        permalink = p.get("permalink") or ""

        cat_class = ""
        if category == "Research & ML":
            cat_class = "cat-research"
        elif category == "Web Apps":
            cat_class = "cat-web"
        elif category == "Software & Tools":
            cat_class = "cat-tools"

        tags_html = "".join(
            [
                f'<span class="tech-tag">{html_escape(t)}</span>'
                for t in p.get("technologies", [])
            ]
        )

        actions = []
        info_icon = ICONS.get("INFO_16", "")
        gh_icon = ICONS.get("MARK_GITHUB_16", "")
        demo_icon = ICONS.get("ROCKET_16", "")
        file_icon = ICONS.get("FILE_16", "")

        actions.append(
            f'<a href="{permalink}" class="card-btn btn-detail" '
            f'aria-label="Explore dedicated detail page for {title}">'
            f"{info_icon} Details</a>"
        )

        if p.get("github"):
            actions.append(
                f'<a href="{p["github"]}" target="_blank" rel="noopener" class="card-btn btn-github" '
                f'aria-label="View {title} codebase on GitHub (opens in a new tab)">'
                f"{gh_icon} Code "
                f'<span class="sr-only">(opens in a new tab)</span></a>'
            )
        if p.get("demo"):
            actions.append(
                f'<a href="{p["demo"]}" class="card-btn btn-demo" '
                f'aria-label="Launch live interactive demo for {title}">'
                f"{demo_icon} Demo</a>"
            )
        if p.get("pdf"):
            actions.append(
                f'<a href="{p["pdf"]}" target="_blank" rel="noopener" class="card-btn btn-pdf" '
                f'aria-label="Download {title} PDF paper (opens in a new tab)">'
                f"{file_icon} PDF "
                f'<span class="sr-only">(opens in a new tab)</span></a>'
            )
        if p.get("presentation"):
            actions.append(
                f'<a href="{p["presentation"]}" target="_blank" rel="noopener" class="card-btn btn-pdf" '
                f'aria-label="Download {title} presentation slides (opens in a new tab)">'
                f"{file_icon} Slide "
                f'<span class="sr-only">(opens in a new tab)</span></a>'
            )

        actions_html = f'<div class="card-actions">{"".join(actions)}</div>'

        cards.append(
            f'                  <div class="project-card timeline-card" id="proj-{slug}">\n'
            f'                    <div class="card-meta">\n'
            f'                      <span class="card-category {cat_class}">{html_escape(category)}</span>\n'
            f'                      <span class="card-venue">{formatted_date}</span>\n'
            f"                    </div>\n"
            f'                    <h2 class="project-title"><a href="{permalink}" aria-label="Explore dedicated detail page for {title}">{title}</a></h2>\n'
            f'                    <div class="card-org-context">{html_escape(venue_label)}</div>\n'
            f'                    <p class="project-excerpt">{excerpt}</p>\n'
            f'                    <div class="project-tech">{tags_html}</div>\n'
            f"                    {actions_html}\n"
            f"                  </div>"
        )
    return "\n".join(cards)


def update_project_catalog_array(projects: list[dict[str, Any]]) -> bool:
    """
    Regex-replace the embedded catalog array and <noscript> static cards inside
    `projects/index.html`.  The page stores its data inside a
    `<script type="application/json" class="projects-data">` block; this
    function updates the JSON array inside that block with a lightweight
    copy of `projects` (no `content_html` key — the runtime catalog does
    not need it).

    Mirrors the structure of `update_experience_catalog_array()` and the
    pre-refactor `generate_portfolio.update_catalog_index()`.
    Returns True on a successful write, False if the index page is
    missing or no replacement happened.
    """
    catalog_path = os.path.join(PROJECTS_DIR, "index.html")
    if not os.path.exists(catalog_path):
        print(
            f"[generate_site] projects catalog not found at {catalog_path}; "
            "run with --projects first to generate it.",
            file=sys.stderr,
        )
        return False

    with open(catalog_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Strip `content_html` from every project — the runtime catalog on the
    # index page does not need the long body copy.  This is the same
    # optimization the original `generate_portfolio.py` used.
    lightweight = [
        {k: v for k, v in (p or {}).items() if k != "content_html"} for p in projects
    ]
    serialized = json.dumps(lightweight, indent=2, ensure_ascii=False)

    new_content, n_subs = re.subn(
        r'(<script type="application/json" class="projects-data">)\s*\[[\s\S]*?\]\s*(</script>)',
        rf"\1{serialized}\2",
        content,
        flags=re.DOTALL,
    )

    if n_subs == 0:
        print(
            '[generate_site] WARNING: no `<script type="application/json" '
            'class="projects-data">[...]</script>` block found in '
            f"{catalog_path}; nothing replaced.",
            file=sys.stderr,
        )
        return False

    noscript_cards = _render_project_noscript_cards(projects)
    new_content, n_subs_noscript = re.subn(
        r"(<noscript>)\s*[\s\S]*?\s*(</noscript>)",
        f"\\1\n{noscript_cards}\n                \\2",
        new_content,
        flags=re.DOTALL,
    )

    if n_subs_noscript == 0:
        print(
            f"[generate_site] WARNING: no `<noscript>[...]</noscript>` block found in {catalog_path}; noscript cards not updated.",
            file=sys.stderr,
        )

    with open(catalog_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(
        f"[generate_site] synchronized {len(projects)} projects inside {catalog_path}"
    )
    return True


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def _load_experience_database() -> list[dict[str, Any]]:
    if not os.path.exists(EXPERIENCE_JSON):
        print(
            f"[generate_site] ERROR: experience database not found at "
            f"{EXPERIENCE_JSON}. Run scripts/cv_parser.py first.",
            file=sys.stderr,
        )
        sys.exit(1)
    with open(EXPERIENCE_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_experience_detail_pages(entries: list[dict[str, Any]]) -> int:
    """Write one detail page per entry; return the number written."""
    written = 0
    for entry in entries:
        cat = entry.get("category")
        slug = entry.get("id")
        if not cat or not slug:
            print(
                f"[generate_site] skipping entry without category/id: "
                f"{entry.get('title')!r}",
                file=sys.stderr,
            )
            continue
        out_dir = os.path.join(EXPERIENCE_DIR, cat)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, f"{slug}.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(generate_experience_detail_page(entry))
        written += 1
    return written


def _prettier_format(paths: list[str]) -> None:
    """Best-effort `npx prettier --write` so regenerated files match the
    repo's committed formatting.  Skipped silently if npx is unavailable."""
    import subprocess

    try:
        subprocess.run(
            ["npx", "--no-install", "prettier", "--write", *paths],
            cwd=BASE_DIR,
            check=True,
            capture_output=True,
            timeout=120,
        )
        print(f"[generate_site] prettier formatted {len(paths)} path(s)")
    except (OSError, subprocess.SubprocessError):
        print(
            "[generate_site] NOTE: prettier not run — format manually with "
            f"`npx prettier --write {' '.join(paths)}` before committing.",
            file=sys.stderr,
        )


def generate_all_experiences() -> None:
    """
    End-to-end experience generation: load DB, write detail pages, splice
    the data into the committed listing page, then prettier-format the
    touched files.
    """
    print(f"[generate_site] BASE_DIR = {BASE_DIR}")
    entries = _load_experience_database()
    print(f"[generate_site] loaded {len(entries)} experience records")

    # Ensure all 5 category directories exist (Task spec).
    for cat in VALID_CATEGORIES:
        os.makedirs(os.path.join(EXPERIENCE_DIR, cat), exist_ok=True)

    n_detail = _write_experience_detail_pages(entries)
    sync_experience_listing_page(entries)
    _prettier_format(["experience"])

    print(
        f"[generate_site] wrote {n_detail} detail page(s) into "
        f"{EXPERIENCE_DIR}/<category>/"
    )


# ---------------------------------------------------------------------------
# Project pipeline (Task 8 — refactor of `generate_portfolio.py`)
# ---------------------------------------------------------------------------


def _load_projects_database() -> list[dict[str, Any]]:
    """Load the project catalog from `projects_database.json`."""
    if not os.path.exists(PROJECTS_JSON):
        print(
            f"[generate_site] ERROR: projects database not found at {PROJECTS_JSON}.",
            file=sys.stderr,
        )
        sys.exit(1)
    with open(PROJECTS_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_project_detail_pages(projects: list[dict[str, Any]]) -> int:
    """
    Write one detail HTML page per project that has `has_detail=True`.
    Returns the number of pages written.
    """
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    written = 0
    for project in projects:
        if not project.get("has_detail"):
            continue
        permalink = project.get("permalink")
        if not permalink:
            print(
                f"[generate_site] skipping project without permalink: "
                f"{project.get('title')!r}",
                file=sys.stderr,
            )
            continue
        slug = permalink.rsplit("/", 1)[-1]
        out_path = os.path.join(PROJECTS_DIR, f"{slug}.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(generate_project_detail_page(project))
        written += 1
    return written


def generate_all_projects() -> None:
    """
    End-to-end project generation: load DB, write detail pages for every
    `has_detail=True` entry, then sync the embedded catalog array in
    `projects/index.html` via regex replace.
    """
    print(f"[generate_site] BASE_DIR = {BASE_DIR}")
    projects = _load_projects_database()
    print(f"[generate_site] loaded {len(projects)} project records")

    n_detail = _write_project_detail_pages(projects)
    update_project_catalog_array(projects)

    print(
        f"[generate_site] wrote {n_detail} project detail page(s) into {PROJECTS_DIR}/"
    )


# ---------------------------------------------------------------------------
# Sitemap (referenced by robots.txt)
# ---------------------------------------------------------------------------

SITE_ROOT = "https://agreddy.com"

# Hand-maintained top-level pages.  Detail-page URLs are derived from the
# experience and project databases below, so they never go stale.
SITEMAP_STATIC_PAGES = (
    f"{SITE_ROOT}/",
    f"{SITE_ROOT}/accessibility.html",
    f"{SITE_ROOT}/availability/",
    f"{SITE_ROOT}/cv/",
    f"{SITE_ROOT}/experience/",
    f"{SITE_ROOT}/projects/",
)


def generate_sitemap() -> str:
    """
    Write `sitemap.xml` at the repo root (the URL advertised by
    `robots.txt`).  Covers the static top-level pages plus every
    experience detail page and every project detail page with
    `has_detail=True`.  URLs match each page's `<link rel="canonical">`.
    Returns the output path.
    """
    urls: list[str] = list(SITEMAP_STATIC_PAGES)

    for e in _load_experience_database():
        cat = e.get("category")
        slug = e.get("id")
        if cat and slug:
            urls.append(f"{SITE_ROOT}/experience/{cat}/{slug}.html")

    for p in _load_projects_database():
        permalink = p.get("permalink")
        if p.get("has_detail") and permalink:
            urls.append(f"{SITE_ROOT}{permalink}.html")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url in urls:
        lines.append(f"  <url>\n    <loc>{html_escape(url)}</loc>\n  </url>")
    lines.append("</urlset>")

    out_path = os.path.join(BASE_DIR, "sitemap.xml")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"[generate_site] wrote {len(urls)} URLs to {out_path}")
    return out_path


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Generate experience and project detail + listing HTML pages "
            "for the personal website."
        )
    )
    parser.add_argument(
        "--experiences",
        action="store_true",
        help="Generate experience detail pages and the /experience/ listing page.",
    )
    parser.add_argument(
        "--projects",
        action="store_true",
        help=(
            "Generate project detail pages from projects_database.json "
            "and sync the embedded catalog array in projects/index.html."
        ),
    )
    parser.add_argument(
        "--sitemap",
        action="store_true",
        help="Regenerate sitemap.xml only (also runs after --experiences/--projects).",
    )
    args = parser.parse_args(argv)

    if not (args.experiences or args.projects or args.sitemap):
        parser.print_help()
        return 0

    rc = 0
    if args.experiences:
        try:
            generate_all_experiences()
        except Exception as exc:  # noqa: BLE001
            print(
                f"[generate_site] ERROR generating experiences: {exc}", file=sys.stderr
            )
            rc = 1

    if args.projects:
        try:
            generate_all_projects()
        except Exception as exc:  # noqa: BLE001
            print(f"[generate_site] ERROR generating projects: {exc}", file=sys.stderr)
            rc = 1

    # Any content regeneration may add or remove pages — keep the sitemap
    # advertised by robots.txt in lockstep.
    try:
        generate_sitemap()
    except Exception as exc:  # noqa: BLE001
        print(f"[generate_site] ERROR generating sitemap: {exc}", file=sys.stderr)
        rc = 1

    return rc


if __name__ == "__main__":
    sys.exit(main())
