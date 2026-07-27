#!/usr/bin/env python3
"""
bump_cache_version.py — Content-hash cache busting for shared chrome
assets, post-migration.

Two independent groups are versioned:

  * The React site's shared chrome (style.css, primer.css) — hash written
    into site/src/components/chrome/Head.tsx's ASSETS_VERSION constant.
    Run `npm run build:site` afterward to propagate it into the generated
    HTML (this script edits the source, not the build output).
  * The legacy chrome bundle (icons.js, theme.js, status-badge.js,
    sw-register.js) still loaded directly by files/index.html and
    files/README/index.html — hashed and patched in place, matching the
    original pre-migration scheme (those two pages aren't part of the
    React build).

Usage:
    python3 scripts/bump_cache_version.py
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

REACT_CHROME_CSS = [
    "assets/css/style.css",
    "assets/css/primer/primer.css",
]

LEGACY_CHROME_JS = [
    "assets/js/icons.js",
    "assets/js/theme.js",
    "assets/js/status-badge.js",
    "assets/js/sw-register.js",
]

LEGACY_HTML_PAGES = [
    "files/index.html",
    "files/README/index.html",
]


def short_hash(*paths: Path) -> str:
    digest = hashlib.sha256()
    for path in paths:
        digest.update(path.read_bytes())
    return digest.hexdigest()[:8]


def replace_version(text: str, asset_rel_path: str, new_version: str) -> str:
    pattern = re.compile(r'((?:href|src)="/' + re.escape(asset_rel_path) + r'\?v=)[^"]*(")')
    return pattern.sub(lambda m: m.group(1) + new_version + m.group(2), text)


def main() -> None:
    react_version = short_hash(*(REPO_ROOT / p for p in REACT_CHROME_CSS))
    head_tsx = REPO_ROOT / "site" / "src" / "components" / "chrome" / "Head.tsx"
    head_src = head_tsx.read_text()
    new_head_src = re.sub(
        r'const ASSETS_VERSION = "[^"]*"',
        f'const ASSETS_VERSION = "{react_version}"',
        head_src,
    )
    if new_head_src != head_src:
        head_tsx.write_text(new_head_src)
        print(f"Head.tsx: ASSETS_VERSION -> {react_version} (run `npm run build:site` to apply)")

    legacy_version = short_hash(*(REPO_ROOT / p for p in LEGACY_CHROME_JS))
    changed_files = []
    for rel in LEGACY_HTML_PAGES:
        html_path = REPO_ROOT / rel
        if not html_path.exists():
            continue
        text = html_path.read_text()
        original = text
        for asset_rel in LEGACY_CHROME_JS:
            text = replace_version(text, asset_rel, legacy_version)
        if text != original:
            html_path.write_text(text)
            changed_files.append(rel)

    if changed_files:
        print(f"Updated {len(changed_files)} legacy HTML file(s):")
        for f in changed_files:
            print(f"  {f}")
    else:
        print("No legacy HTML cache versions changed.")


if __name__ == "__main__":
    main()
