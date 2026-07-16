#!/usr/bin/env python3
"""
bump_cache_version.py — Content-hash cache busting for shared chrome
assets and per-page catalog scripts.

There is no build step for the public site (Nginx serves the checked-out
repository directly), so cache busting is done by rewriting the `?v=`
query string on `<link>`/`<script>` tags. This script computes short
content hashes so that version bumps happen automatically when the
underlying file changes, instead of a developer manually incrementing
`ASSETS_VERSION` in scripts/chrome.py and every hand-authored HTML file.

Two independent groups are versioned:

  * The shared "chrome" bundle: style.css, primer.css, icons.js, theme.js,
    status-badge.js, sw-register.js — one combined hash, matching the
    single ASSETS_VERSION scheme already used by scripts/chrome.py.
  * Each catalog script (experience-catalog.js, projects-catalog.js) —
    versioned independently since they're page-specific, not shared chrome.

Usage:
    python3 scripts/bump_cache_version.py
"""

from __future__ import annotations

import hashlib
import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CHROME_CSS_JS = [
    "assets/css/style.css",
    "assets/css/primer/primer.css",
    "assets/js/icons.js",
    "assets/js/theme.js",
    "assets/js/status-badge.js",
    "assets/js/sw-register.js",
]

STANDALONE_SCRIPTS = [
    "assets/js/experience-catalog.js",
    "assets/js/projects-catalog.js",
]


def short_hash(*paths: Path) -> str:
    digest = hashlib.sha256()
    for path in paths:
        digest.update(path.read_bytes())
    return digest.hexdigest()[:8]


def tracked_html_files() -> list[Path]:
    out = subprocess.run(
        ["git", "ls-files", "*.html"],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return [REPO_ROOT / line for line in out.splitlines() if line]


def replace_version(text: str, asset_rel_path: str, new_version: str) -> str:
    # asset_rel_path like "assets/css/style.css" -> matches
    # href="/assets/css/style.css?v=OLD" or src="/assets/css/style.css?v=OLD"
    pattern = re.compile(
        r'((?:href|src)="/' + re.escape(asset_rel_path) + r'\?v=)[^"]*(")'
    )
    return pattern.sub(lambda m: m.group(1) + new_version + m.group(2), text)


def main() -> None:
    chrome_version = short_hash(*(REPO_ROOT / p for p in CHROME_CSS_JS))

    chrome_py = REPO_ROOT / "scripts" / "chrome.py"
    chrome_src = chrome_py.read_text()
    new_chrome_src = re.sub(
        r'ASSETS_VERSION = "[^"]*"',
        f'ASSETS_VERSION = "{chrome_version}"',
        chrome_src,
    )
    if new_chrome_src != chrome_src:
        chrome_py.write_text(new_chrome_src)
        print(f"scripts/chrome.py: ASSETS_VERSION -> {chrome_version}")

    catalog_versions = {
        rel: short_hash(REPO_ROOT / rel) for rel in STANDALONE_SCRIPTS
    }

    changed_files = []
    for html_path in tracked_html_files():
        text = html_path.read_text()
        original = text
        for rel in CHROME_CSS_JS:
            text = replace_version(text, rel, chrome_version)
        for rel, version in catalog_versions.items():
            text = replace_version(text, rel, version)
        if text != original:
            html_path.write_text(text)
            changed_files.append(html_path.relative_to(REPO_ROOT))

    if changed_files:
        print(f"Updated {len(changed_files)} HTML file(s):")
        for f in changed_files:
            print(f"  {f}")
    else:
        print("No cache versions changed.")


if __name__ == "__main__":
    main()
