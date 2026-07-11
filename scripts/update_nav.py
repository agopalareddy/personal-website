#!/usr/bin/env python3
"""Bulk-update navigation bars in all HTML files under personal-website/.

Adds an "Experience" link between Home and Projects, preserving the
active state of whichever page currently has ``class="nav-link active"``.

Usage:
    python3 scripts/update_nav.py            # apply changes
    python3 scripts/update_nav.py --dry-run  # preview only
    python3 scripts/update_nav.py --check    # CI gate (exit 0 = all ok)
"""

import argparse
import os
import re
import sys
from pathlib import Path

# Allow imports from scripts/ directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons import ICONS  # noqa: E402

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent  # personal-website/

# Ordered nav links (href → label, octicon_key)
NAV_LINKS = [
    ("/", "Home", "HOME_16"),
    ("/experience/", "Experience", "BRIEFCASE_16"),
    ("/projects/", "Projects", "CODE_16"),
    ("/cv/", "CV/Resume", "FILE_16"),
    ("/availability/", "Availability", "CALENDAR_16"),
]

# Regex: capture the entire <nav class="nav-links" …> block, incl. its
# leading whitespace so we can rebuild with identical indentation.
NAV_RE = re.compile(
    r"(?P<indent>[ \t]*)"
    r'<nav class="nav-links" aria-label="Primary Navigation">'
    r"(?P<body>.*?)"
    r"\s*</nav>",
    re.DOTALL,
)

# Extract href + optional "active" from a single <a> tag.
LINK_RE = re.compile(r'<a\s[^>]*href="([^"]+)"[^>]*>')

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def find_all_html_files(base_dir: Path) -> list[Path]:
    """Walk *base_dir* and return every ``.html`` / ``.htm`` file.

    Directories named ``.git``, ``node_modules``, ``__pycache__``, and
    ``.venv`` are automatically skipped.
    """
    skip_dirs = {".git", "node_modules", "__pycache__", ".venv", "venv", "env"}
    files: list[Path] = []
    for root, dirs, filenames in os.walk(base_dir):
        # Prune skipped directories in-place
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for name in filenames:
            if name.lower().endswith((".html", ".htm")):
                files.append(Path(root) / name)
    return files


def _has_experience_link(html: str) -> bool:
    """Return ``True`` if the nav block contains an /experience/ link."""
    return bool(re.search(r'href="/experience/"', html))


def _extract_active_href(nav_body: str) -> str | None:
    """From the inner body of a <nav> block, return the href that
    carries ``class="nav-link active"`` (or ``None`` if nothing is active).
    """
    for tag in re.finditer(
        r'<a\s[^>]*href="([^"]+)"\s+class="nav-link\s+active"',
        nav_body,
    ):
        return tag.group(1)
    # Fallback: "nav-link active" with href after class
    for tag in re.finditer(
        r'<a\s[^>]*class="nav-link\s+active"[^>]*href="([^"]+)"',
        nav_body,
    ):
        return tag.group(1)
    return None


def _build_nav(indent: str, active_href: str | None) -> str:
    """Return a complete ``<nav>…</nav>`` block for the 5-item bar."""
    inner_indent = indent + "  "
    lines = [f'{indent}<nav class="nav-links" aria-label="Primary Navigation">']
    for href, label, icon_key in NAV_LINKS:
        cls = "nav-link active" if href == active_href else "nav-link"
        aria = ' aria-current="page"' if href == active_href else ""
        icon_svg = ICONS.get(icon_key, "")
        lines.append(
            f'{inner_indent}<a href="{href}" class="{cls}"{aria}>{icon_svg}<span>{label}</span></a>'
        )
    lines.append(f"{indent}</nav>")
    return "\n".join(lines)


def update_file(path: Path, *, dry_run: bool = False) -> bool:
    """Replace the nav bar in *path*.

    Returns ``True`` if the file was modified (or *would* be modified in
    dry-run mode).
    """
    original = path.read_text(encoding="utf-8")

    match = NAV_RE.search(original)
    if not match:
        print(f"[!] {path.relative_to(BASE_DIR)} — no nav-links block found")
        return False

    nav_body = match.group("body")
    active_href = _extract_active_href(nav_body)
    indent = match.group("indent")
    new_nav = _build_nav(indent, active_href)

    if match.group(0) == new_nav:
        return False  # already updated

    modified = original[: match.start()] + new_nav + original[match.end() :]

    if dry_run:
        print(f"[dry-run] {path.relative_to(BASE_DIR)}")
    else:
        path.write_text(modified, encoding="utf-8")
        print(f"[+] {path.relative_to(BASE_DIR)}")
    return True


# ---------------------------------------------------------------------------
# Check mode (CI gate)
# ---------------------------------------------------------------------------


def check_all(base_dir: Path) -> int:
    """Scan every HTML file. Exit 0 if all contain an Experience link,
    exit 1 if any file is missing it.
    """
    files = find_all_html_files(base_dir)
    missing: list[str] = []
    for p in files:
        html = p.read_text(encoding="utf-8")
        if _has_experience_link(html):
            continue
        # Also check if the file has a nav-links block at all
        if NAV_RE.search(html) and not _has_experience_link(html):
            missing.append(str(p.relative_to(BASE_DIR)))
    if missing:
        print("Missing Experience link in:")
        for m in missing:
            print(f"  {m}")
        print(f"\n{len(missing)} file(s) need updating.")
        return 1
    print(f"All {len(files)} HTML files have the Experience link. ✓")
    return 0


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Insert Experience link into all nav bars."
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files.",
    )
    group.add_argument(
        "--check",
        action="store_true",
        help="CI mode: exit 0 if all files have Experience link, else exit 1.",
    )
    args = parser.parse_args()

    if args.check:
        sys.exit(check_all(BASE_DIR))

    files = find_all_html_files(BASE_DIR)
    modified = 0
    for p in sorted(files):
        if update_file(p, dry_run=args.dry_run):
            modified += 1

    action = "Would modify" if args.dry_run else "Updated"
    print(f"\n{action} {modified} file(s).")


if __name__ == "__main__":
    main()
