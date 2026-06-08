#!/usr/bin/env python3
"""
cv_parser.py — Parse the LaTeX CV (personal-website/files/cv_tex/reddy_cv.tex)
into structured JSON Experience records conforming to the schema in
`personal-website/scripts/experience_schema.md`.

Usage:
    python3 personal-website/scripts/cv_parser.py                       # write JSON to default paths
    python3 personal-website/scripts/cv_parser.py --validate           # validate only, exit 0/1
    python3 personal-website/scripts/cv_parser.py --output path.json   # custom output path
    python3 personal-website/scripts/cv_parser.py --cv path/to/cv.tex  # custom CV path

Outputs:
    <repo>/personal-website/scripts/experience_database.json
    <repo>/personal-website/scripts/skills.json
"""

from __future__ import annotations

import argparse
import calendar
import json
import os
import re
import sys
import unicodedata
from typing import Any, Callable, Optional


# ---------------------------------------------------------------------------
# Constants — paths, sections, categories, link types
# ---------------------------------------------------------------------------

# Auto-derive BASE_DIR from this script's location so the script is runnable
# from any working directory.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
DEFAULT_CV_PATH = os.path.join(BASE_DIR, "files", "cv_tex", "reddy_cv.tex")
DEFAULT_EXPERIENCE_OUT = os.path.join(SCRIPT_DIR, "experience_database.json")
DEFAULT_SKILLS_OUT = os.path.join(SCRIPT_DIR, "skills.json")

# CV \section{} heading -> category.  None means "skip" (no Experience record).
SECTION_TO_CATEGORY: dict[str, Optional[str]] = {
    "EDUCATION": "education",
    "RESEARCH EXPERIENCE": "research",
    "INDUSTRY EXPERIENCE": "professional",
    "PUBLICATIONS": "research",
    "PRESENTATIONS": "leadership",
    "PROJECTS": "research",
    "TEACHING & MENTORSHIP EXPERIENCE": "professional",
    "GRANTS, FELLOWSHIPS, & AWARDS": "awards",
    "PROFESSIONAL SERVICE & LEADERSHIP": "leadership",
    "TECHNICAL SKILLS & AFFILIATIONS": None,  # skills sidecar
    "REFERENCES": None,  # static line
}

VALID_CATEGORIES = {"professional", "education", "research", "leadership", "awards"}

VALID_LINK_TYPES = {
    "publication",
    "github",
    "demo",
    "paper",
    "talk",
    "award",
    "organization",
    "other",
}

# Experience-bearing environments and their expected argument counts.
ENV_ARG_COUNTS: dict[str, int] = {
    "educationentry": 3,
    "experienceentry": 4,
    "researchentry": 5,
    "projectentry": 4,
    "leadershipentry": 2,
    "positionentry": 2,
    "presentationentry": 4,
    "honorentry": 2,
    "skillcategory": 1,
}


# ---------------------------------------------------------------------------
# Brace-counting utilities
# ---------------------------------------------------------------------------


def parse_braces(text: str, pos: int) -> tuple[str, int]:
    """
    Read a top-level `{...}` group starting at text[pos] (which must be '{').
    Returns (inner_content, position_after_closing_brace).
    Respects nested braces and ignores backslash-escaped braces (LaTeX escaped braces).
    """
    if pos >= len(text) or text[pos] != "{":
        raise ValueError(f"parse_braces called at non-{{ position {pos}: {text[pos]!r}")
    depth = 0
    i = pos
    n = len(text)
    while i < n:
        c = text[i]
        if c == "\\" and i + 1 < n and text[i + 1] in "{}":
            # Escaped brace — skip both
            i += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[pos + 1 : i], i + 1
        i += 1
    raise ValueError(f"Unmatched brace starting at position {pos}")


def extract_top_level_args(text: str, start: int, n: int) -> tuple[list[str], int]:
    """
    Read N top-level `{...}` groups starting from text[start].  Whitespace
    between groups is tolerated.  Returns (list_of_inner_strings, position_after_last_brace).
    """
    args: list[str] = []
    i = start
    n_text = len(text)
    while len(args) < n and i < n_text:
        # Skip whitespace and comments
        while i < n_text and text[i] in " \t\r\n%":
            if text[i] == "%":
                # Skip to end of line
                nl = text.find("\n", i)
                i = n_text if nl < 0 else nl + 1
            else:
                i += 1
        if i >= n_text or text[i] != "{":
            break
        content, i = parse_braces(text, i)
        args.append(content)
    return args, i


def find_env_body(text: str, start: int, env_name: str) -> tuple[Optional[str], int]:
    """
    Starting from text[start], look for \\begin{env_name}, extract its top-level
    arguments (using ENV_ARG_COUNTS) and the body content up to the matching
    \\end{env_name}.  Returns (body_content_or_None, position_after_end) on
    success, (None, -1) if not found.
    """
    needle = "\\begin{" + env_name + "}"
    idx = text.find(needle, start)
    if idx < 0:
        return None, -1
    pos = idx + len(needle)
    n_args = ENV_ARG_COUNTS.get(env_name)
    if n_args is None:
        # Unknown env — return entire content up to \end{env_name}
        body, end_idx = find_end_env(text, pos, env_name)
        return body, end_idx
    args, after_args = extract_top_level_args(text, pos, n_args)
    if len(args) != n_args:
        return None, -1
    # Body is whatever lies between after_args and \end{env_name}
    end_needle = "\\end{" + env_name + "}"
    end_idx = text.find(end_needle, after_args)
    if end_idx < 0:
        return None, -1
    body = text[after_args:end_idx]
    return body, end_idx + len(end_needle)


def find_end_env(text: str, start: int, env_name: str) -> tuple[Optional[str], int]:
    """Find body content up to \\end{env_name}."""
    end_needle = "\\end{" + env_name + "}"
    end_idx = text.find(end_needle, start)
    if end_idx < 0:
        return None, -1
    return text[start:end_idx], end_idx + len(end_needle)


# ---------------------------------------------------------------------------
# LaTeX cleanup utilities
# ---------------------------------------------------------------------------

# Reusable compiled patterns
_RE_HREF = re.compile(
    r"\\href\s*(?:\[([^\]]*)\])?\s*\{([^{}]*)\}\s*\{((?:[^{}]|\{[^{}]*\})*)\}"
)
_RE_HREF_SIMPLE = re.compile(r"\\href\s*\{([^{}]*)\}\s*\{((?:[^{}]|\{[^{}]*\})*)\}")
_RE_TEXTBF = re.compile(r"\\textbf\s*\{((?:[^{}]|\{[^{}]*\})*)\}")
_RE_TEXTIT = re.compile(r"\\textit\s*\{((?:[^{}]|\{[^{}]*\})*)\}")
_RE_EMPH = re.compile(r"\\emph\s*\{((?:[^{}]|\{[^{}]*\})*)\}")
_RE_ITEM = re.compile(r"\\item\b")
_RE_BRACE_CMD = re.compile(r"\\[a-zA-Z@]+\*?(?:\[[^\]]*\])?\s*")
_RE_HTML_ENTITIES = re.compile(r"[&<>\"]")
_HTML_ESCAPE = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}
_LATEX_ESCAPES = {
    r"\&": "&",
    r"\#": "#",
    r"\$": "$",
    r"\%": "%",
    r"\_": "_",
    r"\{": "{",
    r"\}": "}",
    r"\\": "\\",
    r"\~": "~",
    r"\^": "^",
}


def extract_links(text: str) -> tuple[list[dict[str, str]], str]:
    """
    Pull every \\href{URL}{LABEL} out of `text`, return (links, text_with_links_replaced_by_label).
    LABEL is recursively cleaned of inner LaTeX wrappers.
    """
    links: list[dict[str, str]] = []
    counter = {"i": 0}

    def repl(m: re.Match) -> str:
        url = m.group(1).strip()
        label_raw = m.group(2)
        label = clean_latex(label_raw)
        label = label.strip() or url
        links.append({"label": label, "url": url, "type": classify_link(url)})
        counter["i"] += 1
        return label

    cleaned = _RE_HREF_SIMPLE.sub(repl, text)
    return links, cleaned


def clean_latex(text: str) -> str:
    """
    Strip common LaTeX wrappers from a fragment, returning plain text.
    Handles \\textbf, \\textit, \\emph, and \\href{...}{...} (replaces with
    the label text).  Unescapes \\& \\# \\$ \\% \\_ etc.  Strips residual
    command names.  Collapses whitespace.
    """
    if not text:
        return ""

    # 1. Pull out \href{...}{label} — keep label, discard URL
    text = _RE_HREF.sub(lambda m: m.group(3), text)
    text = _RE_HREF_SIMPLE.sub(lambda m: m.group(2), text)

    # 2. Strip \textbf{...}, \textit{...}, \emph{...} (outer wrapper)
    #    Apply repeatedly to handle nested wrappers.
    for _ in range(5):
        prev = text
        text = _RE_TEXTBF.sub(lambda m: m.group(1), text)
        text = _RE_TEXTIT.sub(lambda m: m.group(1), text)
        text = _RE_EMPH.sub(lambda m: m.group(1), text)
        if text == prev:
            break

    # 3. Unescape LaTeX special sequences
    for esc, repl_char in _LATEX_ESCAPES.items():
        text = text.replace(esc, repl_char)

    # 4. Strip generic \command[opt]{arg}{arg} sequences.  We repeatedly try
    #    to consume the longest command, including optional and brace args.
    text = strip_generic_commands(text)

    # 5. Collapse whitespace
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def strip_generic_commands(text: str) -> str:
    """Remove remaining LaTeX commands of the form \\name[opt]{arg}...{arg}."""
    # Iterate, shrinking the string each pass.
    pattern = re.compile(
        r"\\[a-zA-Z@]+\*?(?:\[[^\[\]]*\])?(?:\{(?:[^{}]|\{[^{}]*\})*\})*"
    )
    prev = None
    while prev != text:
        prev = text
        text = pattern.sub("", text)
    return text


def html_escape(text: str) -> str:
    return _RE_HTML_ENTITIES.sub(lambda m: _HTML_ESCAPE[m.group(0)], text)


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------


def slugify_title(title: str) -> str:
    """Lowercase, NFKD diacritic strip, non-[a-z0-9] -> hyphen, collapse, trim."""
    if not title:
        return ""
    # NFKD normalize and drop combining marks
    decomposed = unicodedata.normalize("NFKD", title)
    ascii_only = decomposed.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_only.lower()
    # Replace anything that isn't alphanumeric with hyphen
    cleaned = re.sub(r"[^a-z0-9]+", "-", lowered)
    cleaned = re.sub(r"-+", "-", cleaned).strip("-")
    return cleaned


def truncate_slug(slug: str, max_len: int = 60) -> str:
    """Truncate to <= max_len, breaking at the last hyphen that fits."""
    if len(slug) <= max_len:
        return slug
    truncated = slug[:max_len]
    last_hyphen = truncated.rfind("-")
    if last_hyphen > 0:
        return truncated[:last_hyphen].rstrip("-")
    return truncated.rstrip("-")


def unique_slug(base_slug: str, seen: set[str], fallback_idx: int) -> str:
    """Return base_slug (or base-N) ensuring uniqueness in `seen`."""
    if not base_slug:
        base_slug = f"entry-{fallback_idx}"
    if base_slug not in seen:
        seen.add(base_slug)
        return base_slug
    # Collision — try -2, -3, ...
    n = 2
    while True:
        candidate = f"{base_slug}-{n}"
        if candidate not in seen:
            seen.add(candidate)
            return candidate
        n += 1
        if n > 9999:  # safety
            raise RuntimeError("Slug dedupe exceeded 9999 attempts")


# ---------------------------------------------------------------------------
# Date parsing
# ---------------------------------------------------------------------------

MONTH_NAMES = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "sept": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}


def parse_month_year(token: str) -> Optional[tuple[int, int]]:
    """Parse 'Month YYYY' (or 'Month-YYYY', 'YYYY-MM', 'YYYY', etc.)."""
    if not token:
        return None
    t = token.strip()
    # Pattern: Month YYYY
    m = re.match(r"^([A-Za-z]+)\s+(\d{4})$", t)
    if m:
        month = MONTH_NAMES.get(m.group(1).lower())
        if month:
            return int(m.group(2)), month
    # Pattern: YYYY-MM
    m = re.match(r"^(\d{4})[-/](\d{1,2})$", t)
    if m:
        year, month = int(m.group(1)), int(m.group(2))
        if 1 <= month <= 12:
            return year, month
    # Pattern: YYYY alone
    m = re.match(r"^(\d{4})$", t)
    if m:
        return int(m.group(1)), 1
    # Pattern: YYYY-MM-DD (use as-is, then derive YYYY-MM)
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", t)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def end_of_month(year: int, month: int) -> int:
    return calendar.monthrange(year, month)[1]


def iso_date(year: int, month: int, day: int) -> str:
    return f"{year:04d}-{month:02d}-{day:02d}"


def parse_date_range(raw: str) -> tuple[Optional[str], Optional[str]]:
    """
    Parse a date range from LaTeX.  Returns (start_date_iso, end_date_iso_or_None).

    Forms supported:
        "August 2024 - May 2026"          -> range
        "September 2024"                  -> single date (start == end)
        "August 2025 - Present"           -> end = None
        "2024"                            -> single year (month=1)
        "2024-08"                         -> single YYYY-MM
    """
    if not raw:
        return None, None
    # Normalize en/em dashes to ASCII hyphen
    s = raw.replace("\u2013", "-").replace("\u2014", "-")
    s = s.strip()
    if not s:
        return None, None

    # Split on " - " or "-" with optional spaces
    parts = re.split(r"\s*-\s*", s, maxsplit=1)
    start_token = parts[0].strip()
    end_token = parts[1].strip() if len(parts) > 1 else ""

    start_ym = parse_month_year(start_token)
    if not start_ym:
        return None, None
    start_iso = iso_date(start_ym[0], start_ym[1], 1)

    if not end_token:
        # Single date — start == end
        return start_iso, iso_date(start_ym[0], start_ym[1], 1)

    # "Present" maps to None
    if end_token.lower() in {"present", "current", "now", "ongoing"}:
        return start_iso, None

    end_ym = parse_month_year(end_token)
    if not end_ym:
        return start_iso, None
    end_iso = iso_date(end_ym[0], end_ym[1], end_of_month(end_ym[0], end_ym[1]))
    return start_iso, end_iso


# ---------------------------------------------------------------------------
# Link classification
# ---------------------------------------------------------------------------


def classify_link(url: str, organization: Optional[str] = None) -> str:
    """
    Classify a URL into a link type using hostname/path heuristics.
    See experience_schema.md §4.3 and §7.
    """
    if not url:
        return "other"
    u = url.strip()
    # Lowercase scheme + host portion
    try:
        # Quick parse — we don't need a real URL lib here
        m = re.match(r"^https?://([^/]+)(/.*)?$", u, re.IGNORECASE)
        host = m.group(1).lower() if m else ""
        path = (m.group(2) or "").lower() if m else ""
    except Exception:
        host, path = "", ""

    # github
    if "github.com" in host:
        return "github"
    # publication
    if any(
        pub in host
        for pub in (
            "openscholarship.wustl.edu",
            "arxiv.org",
            "doi.org",
            "scholar.google",
        )
    ):
        return "publication"
    # paper
    if path.endswith(".pdf") or u.lower().endswith(".pdf"):
        return "paper"
    # demo
    if "agreddy.com" in host and path.strip("/"):
        return "demo"
    # talk (Google Slides / presentations)
    if "docs.google.com" in host and ("presentation" in path or "slides" in path):
        return "talk"
    # organization — domain matches organization
    if organization:
        org_tokens = re.findall(r"[a-z0-9]+", organization.lower())
        if org_tokens and any(tok in host for tok in org_tokens if len(tok) > 3):
            return "organization"
    return "other"


# ---------------------------------------------------------------------------
# Body parsing — extract \item bullets and free text
# ---------------------------------------------------------------------------


def strip_latex_comments(text: str) -> str:
    """Remove LaTeX line comments (everything from `%` to end-of-line)."""
    return re.sub(r"%[^\n]*", "", text)


def extract_bullets(body: str) -> list[str]:
    """
    Split a body on '\\item' markers, clean each chunk of LaTeX wrappers,
    and return non-empty bullets in order.  Strips LaTeX `%` comments first
    so trailing comments on arg lines don't appear as fake bullets.
    """
    if not body:
        return []
    body = strip_latex_comments(body)
    chunks = _RE_ITEM.split(body)
    bullets: list[str] = []
    for chunk in chunks:
        cleaned = clean_latex(chunk).strip()
        if cleaned:
            bullets.append(cleaned)
    return bullets


def extract_plain_text(body: str) -> str:
    """Clean a body of all LaTeX wrappers, returning plain text."""
    if not body:
        return ""
    # Replace items with newline separators
    text = _RE_ITEM.sub("\n", body)
    return clean_latex(text).strip()


# ---------------------------------------------------------------------------
# Excerpt generation
# ---------------------------------------------------------------------------


def make_excerpt(record: dict[str, Any]) -> str:
    """
    Build a 1-2 sentence excerpt per the rules in experience_schema.md §8.
    """
    category = record.get("category")
    responsibilities = record.get("responsibilities") or []
    raw = record.get("excerpt_raw")  # for publication citations

    if responsibilities:
        first = responsibilities[0]
        if len(first) > 280:
            truncated = first[:280]
            last_space = truncated.rfind(" ")
            if last_space > 200:
                truncated = truncated[:last_space]
            first = truncated.rstrip(",;:.- ") + "…"
        return first

    if category == "awards":
        title = record.get("title", "")
        org = record.get("organization") or ""
        # Strip "Award", "Prize", "Badge", "Scholarship" trailing words
        friendly = re.sub(
            r"\s*(Award|Prize|Badge|Scholarship|Fellowship|Honor|List)$",
            "",
            title,
            flags=re.IGNORECASE,
        )
        if org:
            return f"Recognized by {org} for {friendly}."
        return f"Recognized for {friendly}."

    if category == "leadership" and record.get("is_presentation"):
        title = record.get("title", "")
        org = record.get("organization") or ""
        return f'Delivered a talk titled "{title}" at {org}.'

    if category == "research" and raw:
        if len(raw) > 480:
            truncated = raw[:480]
            last_space = truncated.rfind(" ")
            if last_space > 400:
                truncated = truncated[:last_space]
            raw = truncated.rstrip(",;:.- ") + "…"
        return raw

    # Fallback
    title = record.get("title", "")
    return title or ""


# ---------------------------------------------------------------------------
# Organization / location splitting (educationentry)
# ---------------------------------------------------------------------------


def split_organization_location(combined: str) -> tuple[str, Optional[str]]:
    """
    For educationentry arg #2 (e.g. "Washington University in St. Louis, St. Louis, Missouri, USA"),
    split on the LAST comma: org = left, location = right.
    If there's no comma, the whole string is org and location is None.
    """
    s = clean_latex(combined).strip()
    if "," not in s:
        return s, None
    idx = s.rfind(",")
    org = s[:idx].strip()
    loc = s[idx + 1 :].strip()
    return org, (loc or None)


# ---------------------------------------------------------------------------
# Environment parsers
# ---------------------------------------------------------------------------


class SchemaError(Exception):
    pass


def parse_educationentry(args: list[str], body: str, category: str) -> dict[str, Any]:
    if len(args) != 3:
        raise SchemaError(f"educationentry expects 3 args, got {len(args)}")
    title = clean_latex(args[0])
    org, location = split_organization_location(args[1])
    start_date, end_date = parse_date_range(args[2])
    bullets = extract_bullets(body)
    links, _ = extract_links(args[0])  # \href in title

    if not start_date:
        raise SchemaError(f"educationentry: could not parse dates {args[2]!r}")

    return {
        "title": title,
        "category": category,
        "organization": org,
        "location": location,
        "role_context": None,
        "start_date": start_date,
        "end_date": end_date,
        "responsibilities": bullets,
        "related_projects": [],
        "links": links,
        "has_detail": bool(bullets or links),
    }


def parse_experienceentry(args: list[str], body: str, category: str) -> dict[str, Any]:
    if len(args) != 4:
        raise SchemaError(f"experienceentry expects 4 args, got {len(args)}")
    title = clean_latex(args[0])
    organization = clean_latex(args[1])
    location = clean_latex(args[2]) or None
    start_date, end_date = parse_date_range(args[3])
    bullets = extract_bullets(body)
    links, _ = extract_links(args[0])

    if not start_date:
        raise SchemaError(f"experienceentry: could not parse dates {args[3]!r}")

    return {
        "title": title,
        "category": category,
        "organization": organization,
        "location": location,
        "role_context": None,
        "start_date": start_date,
        "end_date": end_date,
        "responsibilities": bullets,
        "related_projects": [],
        "links": links,
        "has_detail": bool(bullets or links),
    }


def parse_researchentry(args: list[str], body: str, category: str) -> dict[str, Any]:
    if len(args) != 5:
        raise SchemaError(f"researchentry expects 5 args, got {len(args)}")
    title = clean_latex(args[0])
    organization = clean_latex(args[1])
    location = clean_latex(args[2]) or None
    role_context = clean_latex(args[3]) or None
    start_date, end_date = parse_date_range(args[4])
    bullets = extract_bullets(body)
    links, _ = extract_links(args[0])

    if not start_date:
        raise SchemaError(f"researchentry: could not parse dates {args[4]!r}")

    return {
        "title": title,
        "category": category,
        "organization": organization,
        "location": location,
        "role_context": role_context,
        "start_date": start_date,
        "end_date": end_date,
        "responsibilities": bullets,
        "related_projects": [],
        "links": links,
        "has_detail": bool(bullets or links),
    }


def parse_projectentry(args: list[str], body: str, category: str) -> dict[str, Any]:
    if len(args) != 4:
        raise SchemaError(f"projectentry expects 4 args, got {len(args)}")
    title = clean_latex(args[0])
    organization = clean_latex(args[1])
    location = clean_latex(args[2]) or None
    start_date, end_date = parse_date_range(args[3])
    bullets = extract_bullets(body)
    links, _ = extract_links(args[0])

    if not start_date:
        raise SchemaError(f"projectentry: could not parse dates {args[3]!r}")

    return {
        "title": title,
        "category": category,
        "organization": organization,
        "location": location,
        "role_context": None,
        "start_date": start_date,
        "end_date": end_date,
        "responsibilities": bullets,
        "related_projects": [],
        "links": links,
        "has_detail": bool(bullets or links),
    }


def parse_presentationentry(
    args: list[str], body: str, category: str
) -> dict[str, Any]:
    if len(args) != 4:
        raise SchemaError(f"presentationentry expects 4 args, got {len(args)}")
    # Single date: start == end
    start_iso, end_iso = parse_date_range(args[0])
    title = clean_latex(args[1])
    organization = clean_latex(args[2])
    location = clean_latex(args[3]) or None

    if not start_iso:
        raise SchemaError(f"presentationentry: could not parse date {args[0]!r}")

    return {
        "title": title,
        "category": category,
        "organization": organization,
        "location": location,
        "role_context": None,
        "start_date": start_iso,
        "end_date": start_iso,
        "responsibilities": [],
        "related_projects": [],
        "links": [],
        "has_detail": False,
        "is_presentation": True,
    }


def parse_honorentry(args: list[str], body: str, category: str) -> dict[str, Any]:
    if len(args) != 2:
        raise SchemaError(f"honorentry expects 2 args, got {len(args)}")
    # Single date: start == end
    start_iso, _ = parse_date_range(args[0])
    if not start_iso:
        raise SchemaError(f"honorentry: could not parse date {args[0]!r}")

    # 2nd arg mixes honor name + institution.  Split on the LAST comma.
    combined = clean_latex(args[1]).strip()
    if "," in combined:
        idx = combined.rfind(",")
        title = combined[:idx].strip()
        organization = combined[idx + 1 :].strip()
    else:
        title = combined
        organization = ""

    # Strip any residual \textbf wrapper that may have leaked through
    title = re.sub(r"^[\s*]+|[\s*]+$", "", title)
    organization = organization or None

    return {
        "title": title,
        "category": category,
        "organization": organization,
        "location": None,
        "role_context": None,
        "start_date": start_iso,
        "end_date": start_iso,
        "responsibilities": [],
        "related_projects": [],
        "links": [],
        "has_detail": False,
    }


def parse_positionentry(
    args: list[str],
    body: str,
    parent_org: str,
    parent_loc: Optional[str],
    category: str,
) -> dict[str, Any]:
    if len(args) != 2:
        raise SchemaError(f"positionentry expects 2 args, got {len(args)}")
    title = clean_latex(args[0])
    start_date, end_date = parse_date_range(args[1])
    bullets = extract_bullets(body)
    links, _ = extract_links(args[0])

    if not start_date:
        raise SchemaError(f"positionentry: could not parse dates {args[1]!r}")

    return {
        "title": title,
        "category": category,
        "organization": parent_org,
        "location": parent_loc,
        "role_context": None,
        "start_date": start_date,
        "end_date": end_date,
        "responsibilities": bullets,
        "related_projects": [],
        "links": links,
        "has_detail": bool(bullets or links),
    }


def parse_leadershipentry(
    args: list[str], body: str, category: str
) -> list[dict[str, Any]]:
    """
    leadershipentry nests positionentry blocks.  Emit ONE Experience per
    positionentry, carrying the parent org/location.
    """
    if len(args) != 2:
        raise SchemaError(f"leadershipentry expects 2 args, got {len(args)}")
    org = clean_latex(args[0])
    parent_loc = clean_latex(args[1]) or None

    records: list[dict[str, Any]] = []
    pos = 0
    while True:
        body_part, end_idx = find_env_body(body, pos, "positionentry")
        if body_part is None:
            break
        # We need the raw args of positionentry — refind within body
        idx = body.find("\\begin{positionentry}", pos)
        if idx < 0:
            break
        pos_args_start = idx + len("\\begin{positionentry}")
        pos_args, after_args = extract_top_level_args(body, pos_args_start, 2)
        try:
            rec = parse_positionentry(pos_args, body_part, org, parent_loc, category)
            records.append(rec)
        except SchemaError as e:
            raise SchemaError(f"In leadershipentry {org!r}: {e}") from e
        pos = end_idx
    if not records:
        raise SchemaError(f"leadershipentry {org!r} has no nested positionentry")
    return records


def parse_onecolentry(
    body: str, category: str, section_name: str
) -> Optional[dict[str, Any]]:
    """
    Handle free-text onecolentry blocks.  For PUBLICATIONS, extract a
    research Experience from the citation.  For REFERENCES, return None.
    """
    text = extract_plain_text(body)
    if not text:
        return None
    if section_name == "REFERENCES":
        return None  # skipped

    # PUBLICATIONS: extract title from \textit{...} (the thesis/paper title),
    # then the year, then any \href links.
    title = ""
    it_match = re.search(r"\\textit\s*\{((?:[^{}]|\{[^{}]*\})*)\}", body)
    if it_match:
        title = clean_latex(it_match.group(1)).strip()
    if not title:
        # Fallback: title-like chunk between ". " and " ("
        m = re.search(r"\.\s+([A-Z][^()]{8,200}?)\s*\(", text)
        if m:
            title = m.group(1).strip()
    if not title:
        # Last-resort fallback: first 80 chars
        title = text[:80].rstrip(",;.") + ("…" if len(text) > 80 else "")

    # Year: first 4-digit year 19xx or 20xx in the text
    year_match = re.search(r"\b((?:19|20)\d{2})\b", text)
    year = int(year_match.group(1)) if year_match else None

    # \href links from the body
    links, _ = extract_links(body)

    return {
        "title": title,
        "category": category,
        "organization": "Washington University in St. Louis",
        "location": None,
        "role_context": None,
        "start_date": iso_date(year, 1, 1) if year else None,
        "end_date": iso_date(year, 1, 1) if year else None,
        "responsibilities": [],
        "related_projects": [],
        "links": links,
        "has_detail": bool(links),
        "excerpt_raw": html_escape(text),
    }


def parse_skillcategory(args: list[str], body: str) -> dict[str, list[str]]:
    """Build a skills.json entry."""
    if len(args) != 1:
        raise SchemaError(f"skillcategory expects 1 arg, got {len(args)}")
    title = clean_latex(args[0])
    text = extract_plain_text(body)
    # Split on commas, strip periods, drop empties
    items = [s.strip().rstrip(".").strip() for s in text.split(",")]
    items = [s for s in items if s]
    return {title: items}


# ---------------------------------------------------------------------------
# Section tracking + main parse loop
# ---------------------------------------------------------------------------

_ENV_PARSERS: dict[str, Callable] = {
    "educationentry": parse_educationentry,
    "experienceentry": parse_experienceentry,
    "researchentry": parse_researchentry,
    "projectentry": parse_projectentry,
    "presentationentry": parse_presentationentry,
    "honorentry": parse_honorentry,
}


def parse_cv(cv_path: str) -> tuple[list[dict[str, Any]], dict[str, list[str]]]:
    """Top-level driver — returns (experiences_list, skills_dict)."""
    with open(cv_path, "r", encoding="utf-8") as f:
        text = f.read()

    experiences: list[dict[str, Any]] = []
    skills: dict[str, list[str]] = {}

    pos = 0
    current_section: Optional[str] = None
    n = len(text)

    known_envs = list(_ENV_PARSERS) + [
        "leadershipentry",
        "skillcategory",
        "onecolentry",
    ]
    section_re = re.compile(r"\\section\s*\{((?:[^{}]|\{[^{}]*\})*)\}")

    while pos < n:
        # Find the next \section{...} and the next known \begin{...} from pos.
        m_section = section_re.search(text, pos)
        next_env = _find_next_known_env(text, pos, known_envs)

        if m_section is None and next_env is None:
            break

        section_idx = m_section.start() if m_section is not None else None
        env_idx = next_env[1] if next_env is not None else None

        # Whichever comes first — process it.
        if section_idx is not None and (env_idx is None or section_idx < env_idx):
            current_section = clean_latex(m_section.group(1))  # type: ignore[union-attr]
            pos = m_section.end()  # type: ignore[union-attr]
            continue

        # Process the env
        env_name, idx = next_env  # type: ignore[misc]
        body, after_end = find_env_body(text, idx, env_name)
        if body is None:
            pos = idx + len(f"\\begin{{{env_name}}}")
            continue
        args_start = idx + len(f"\\begin{{{env_name}}}")
        if env_name in _ENV_PARSERS:
            n_args = ENV_ARG_COUNTS[env_name]
            args, _ = extract_top_level_args(text, args_start, n_args)
        elif env_name == "leadershipentry":
            args, _ = extract_top_level_args(text, args_start, 2)
        elif env_name == "skillcategory":
            args, _ = extract_top_level_args(text, args_start, 1)
        elif env_name == "onecolentry":
            args = []
        else:
            args = []

        # Resolve category from current section
        category = SECTION_TO_CATEGORY.get(current_section) if current_section else None

        # Dispatch
        try:
            if env_name in _ENV_PARSERS:
                if category is None:
                    raise SchemaError(
                        f"{env_name} encountered outside a mapped section "
                        f"(current section: {current_section!r})"
                    )
                rec = _ENV_PARSERS[env_name](args, body, category)
                experiences.append(rec)
            elif env_name == "leadershipentry":
                if category is None:
                    raise SchemaError(
                        f"leadershipentry outside a mapped section "
                        f"(current section: {current_section!r})"
                    )
                records = parse_leadershipentry(args, body, category)
                experiences.extend(records)
            elif env_name == "skillcategory":
                if current_section == "TECHNICAL SKILLS & AFFILIATIONS":
                    skills.update(parse_skillcategory(args, body))
            elif env_name == "onecolentry":
                if current_section == "PUBLICATIONS" and category is not None:
                    rec = parse_onecolentry(body, category, current_section)
                    if rec:
                        experiences.append(rec)
                # REFERENCES: silently skip
        except SchemaError as e:
            raise SchemaError(
                f"Failed to parse \\begin{{{env_name}}} in section "
                f"{current_section!r}: {e}"
            ) from e

        pos = after_end

    return experiences, skills


def _find_next_known_env(
    text: str, pos: int, env_names: list[str]
) -> Optional[tuple[str, int]]:
    """Find the earliest \\begin{env} starting at or after pos."""
    best: Optional[tuple[str, int]] = None
    for env in env_names:
        needle = "\\begin{" + env + "}"
        idx = text.find(needle, pos)
        if idx < 0:
            continue
        if best is None or idx < best[1]:
            best = (env, idx)
    return best


# ---------------------------------------------------------------------------
# Slug assignment
# ---------------------------------------------------------------------------


def assign_slugs(records: list[dict[str, Any]]) -> None:
    """In-place: assign unique `id` to every record."""
    seen: set[str] = set()
    for i, rec in enumerate(records, start=1):
        if not rec.get("start_date"):
            rec["id"] = unique_slug("", seen, i)
            continue
        # Extract YYYY-MM
        ym = rec["start_date"][:7]
        base = slugify_title(rec.get("title") or "")
        raw_slug = f"{ym}-{base}" if base else ym
        raw_slug = truncate_slug(raw_slug, 60)
        rec["id"] = unique_slug(raw_slug, seen, i)


# ---------------------------------------------------------------------------
# Excerpt finalization
# ---------------------------------------------------------------------------


def finalize_excerpts(records: list[dict[str, Any]]) -> None:
    """Build the `excerpt` field for every record (in-place)."""
    for rec in records:
        rec["excerpt"] = make_excerpt(rec)


# ---------------------------------------------------------------------------
# Schema validation
# ---------------------------------------------------------------------------


def validate_record(rec: dict[str, Any], index: int) -> list[str]:
    """Return a list of validation errors for a single record."""
    errors: list[str] = []

    # Required string fields
    for field in ("id", "title", "category", "organization"):
        if not rec.get(field) or not isinstance(rec[field], str):
            errors.append(f"record[{index}].{field} missing or non-string")

    # Category enum
    if rec.get("category") not in VALID_CATEGORIES:
        errors.append(
            f"record[{index}].category {rec.get('category')!r} not in {VALID_CATEGORIES}"
        )

    # Location: string or null
    if rec.get("location") is not None and not isinstance(rec["location"], str):
        errors.append(f"record[{index}].location must be string or null")

    # role_context: string or null
    if rec.get("role_context") is not None and not isinstance(rec["role_context"], str):
        errors.append(f"record[{index}].role_context must be string or null")

    # start_date
    if not rec.get("start_date") or not re.match(
        r"^\d{4}-\d{2}-\d{2}$", rec["start_date"]
    ):
        errors.append(
            f"record[{index}].start_date {rec.get('start_date')!r} not YYYY-MM-DD"
        )

    # end_date: YYYY-MM-DD or null
    end = rec.get("end_date")
    if end is not None and not re.match(r"^\d{4}-\d{2}-\d{2}$", end):
        errors.append(f"record[{index}].end_date {end!r} not YYYY-MM-DD or null")

    # excerpt
    if not rec.get("excerpt") or not isinstance(rec["excerpt"], str):
        errors.append(f"record[{index}].excerpt missing or non-string")
    elif len(rec["excerpt"]) > 500:
        errors.append(
            f"record[{index}].excerpt exceeds 500 chars ({len(rec['excerpt'])})"
        )

    # responsibilities
    resp = rec.get("responsibilities")
    if not isinstance(resp, list):
        errors.append(f"record[{index}].responsibilities not a list")
    else:
        for j, item in enumerate(resp):
            if not isinstance(item, str):
                errors.append(f"record[{index}].responsibilities[{j}] not string")
            elif len(item) > 500:
                errors.append(
                    f"record[{index}].responsibilities[{j}] exceeds 500 chars"
                )

    # related_projects
    rp = rec.get("related_projects")
    if not isinstance(rp, list):
        errors.append(f"record[{index}].related_projects not a list")

    # links
    links = rec.get("links")
    if not isinstance(links, list):
        errors.append(f"record[{index}].links not a list")
    else:
        for j, link in enumerate(links):
            if not isinstance(link, dict):
                errors.append(f"record[{index}].links[{j}] not object")
                continue
            if not link.get("label") or not isinstance(link["label"], str):
                errors.append(f"record[{index}].links[{j}].label missing")
            if not link.get("url") or not re.match(r"^https?://", link["url"]):
                errors.append(
                    f"record[{index}].links[{j}].url {link.get('url')!r} not http(s)://"
                )
            if link.get("type") not in VALID_LINK_TYPES:
                errors.append(
                    f"record[{index}].links[{j}].type {link.get('type')!r} not in {VALID_LINK_TYPES}"
                )

    # has_detail
    if not isinstance(rec.get("has_detail"), bool):
        errors.append(f"record[{index}].has_detail not boolean")

    return errors


def validate_all(records: list[dict[str, Any]]) -> tuple[bool, list[str]]:
    """Validate every record.  Returns (ok, errors)."""
    all_errors: list[str] = []
    seen_ids: set[str] = set()
    for i, rec in enumerate(records):
        errs = validate_record(rec, i)
        all_errors.extend(errs)
        if rec.get("id") in seen_ids:
            all_errors.append(f"record[{i}].id {rec.get('id')!r} is duplicate")
        seen_ids.add(rec.get("id", ""))
    return (len(all_errors) == 0), all_errors


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Parse reddy_cv.tex into structured experience_database.json + skills.json"
    )
    parser.add_argument(
        "--cv",
        default=DEFAULT_CV_PATH,
        help="Path to reddy_cv.tex (default: %(default)s)",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output path for experience JSON (default: <scriptdir>/experience_database.json)",
    )
    parser.add_argument(
        "--skills-output",
        default=None,
        help="Output path for skills JSON (default: <scriptdir>/skills.json)",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Run validation after parsing; exit 0 on success, 1 on failure",
    )
    args = parser.parse_args(argv)

    cv_path = args.cv
    if not os.path.isabs(cv_path):
        cv_path = os.path.abspath(cv_path)

    out_path = args.output or DEFAULT_EXPERIENCE_OUT
    skills_out_path = args.skills_output or DEFAULT_SKILLS_OUT

    if not os.path.exists(cv_path):
        print(f"[ERROR] CV file not found: {cv_path}", file=sys.stderr)
        return 2

    print(f"[cv_parser] reading {cv_path}")
    try:
        records, skills = parse_cv(cv_path)
    except SchemaError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        return 1

    assign_slugs(records)
    finalize_excerpts(records)

    # Print quick stats
    by_category: dict[str, int] = {}
    for rec in records:
        by_category[rec["category"]] = by_category.get(rec["category"], 0) + 1
    print(f"[cv_parser] parsed {len(records)} experience records")
    for cat in sorted(by_category):
        print(f"  - {cat}: {by_category[cat]}")
    print(f"[cv_parser] parsed {len(skills)} skill categories")

    # Validate
    ok, errors = validate_all(records)
    if not ok:
        print(f"[ERROR] Validation failed ({len(errors)} error(s)):", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)

    if args.validate:
        if not ok:
            return 1
        # In validate-only mode, also write the JSON to be useful
        _write_outputs(records, skills, out_path, skills_out_path)
        return 0

    # In normal mode, write the JSON regardless and return 0 (validation messages
    # were already printed).  Failure during parse (SchemaError) is a hard error.
    _write_outputs(records, skills, out_path, skills_out_path)
    return 0 if ok else 0  # still exit 0 — the task says only --validate should fail


def _write_outputs(records, skills, out_path, skills_out_path) -> None:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"[cv_parser] wrote {out_path}")
    if skills:
        with open(skills_out_path, "w", encoding="utf-8") as f:
            json.dump(skills, f, indent=2, ensure_ascii=False)
        print(f"[cv_parser] wrote {skills_out_path}")


if __name__ == "__main__":
    sys.exit(main())
