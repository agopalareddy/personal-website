#!/usr/bin/env python3
"""
Shared HTML chrome for Aadarsha Gopala Reddy's personal website.
GitHub Primer design system — Octicons, system fonts, functional tokens.

All functions are pure: no file I/O, no hardcoded paths, no side effects.
"""

import os
import sys

# Allow imports from scripts/ directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons import ICONS

ASSETS_VERSION = "2.0.0"

# Inline theme snippet — placed BEFORE stylesheet links to prevent FOUC.
THEME_INLINE_SNIPPET = """<script>
(function(){var e=document.documentElement,a=localStorage.getItem('color-scheme');if(!a){var t=localStorage.getItem('theme');if(t){var r={'light':'light','dark':'dark','device':'auto'};a=r[t]||'auto';localStorage.removeItem('theme');localStorage.setItem('color-scheme',a)}else a='auto'}var m={'auto':{'data-color-mode':'auto','data-light-theme':'light','data-dark-theme':'dark'},'light':{'data-color-mode':'light','data-light-theme':'light','data-dark-theme':'dark'},'light_high_contrast':{'data-color-mode':'light','data-light-theme':'light_high_contrast','data-dark-theme':'dark'},'dark':{'data-color-mode':'dark','data-light-theme':'light','data-dark-theme':'dark'},'dark_dimmed':{'data-color-mode':'dark','data-light-theme':'light','data-dark-theme':'dark_dimmed'},'dark_high_contrast':{'data-color-mode':'dark','data-light-theme':'light','data-dark-theme':'dark_high_contrast'}};var s=m[a]||m.auto;for(var k in s)e.setAttribute(k,s[k])})();
</script>"""

# Nav items: (key, href, label, octicon_key)
NAV_ITEMS = (
    ("home", "/", "Home", "HOME_16"),
    ("experience", "/experience/", "Experience", "BRIEFCASE_16"),
    ("projects", "/projects/", "Projects", "CODE_16"),
    ("cv", "/cv/", "CV/Resume", "FILE_16"),
    ("availability", "/availability/", "Availability", "CALENDAR_16"),
)


def render_head(title, description, canonical_url, og_type="article"):
    """Render the full <head> block with Primer stylesheets, inline theme snippet."""
    desc = description.replace('"', "&quot;").replace("'", "&apos;")
    return f"""{THEME_INLINE_SNIPPET}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{desc}">
    <title>{title} - Aadarsha Gopala Reddy</title>

    <!-- Primer Design Tokens (vendored) -->
    <link rel="stylesheet" href="/assets/css/primer/primer.css?v={ASSETS_VERSION}">
    <link rel="stylesheet" href="/assets/css/style.css?v={ASSETS_VERSION}">

    <!-- Favicons & Mobile Device Integration -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/mstile-150x150.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/mstile-70x70.png">
    <link rel="manifest" href="/images/manifest.json">
    <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#0a0a16">
    <meta name="msapplication-TileColor" content="#0a0a16">
    <meta name="msapplication-TileImage" content="/images/mstile-144x144.png">
    <meta name="msapplication-config" content="/images/browserconfig.xml">

    <!-- Dual static theme-color (overridden by JS) -->
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0d1117">

    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="{og_type}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:title" content="{title} - Aadarsha Gopala Reddy">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="https://agreddy.com/images/profile.png">
    <meta property="og:site_name" content="Aadarsha Gopala Reddy">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{canonical_url}">
    <meta name="twitter:title" content="{title} - Aadarsha Gopala Reddy">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="https://agreddy.com/images/profile.png">
    <meta name="twitter:site" content="@aadarsha2002">

    <!-- Canonical Link -->
    <link rel="canonical" href="{canonical_url}">"""


def render_nav(active_page):
    """Render UnderlineNav header with octicons."""
    links = []
    for key, href, label, icon_key in NAV_ITEMS:
        active_class = " nav-link active" if key == active_page else " nav-link"
        icon_svg = ICONS.get(icon_key, "")
        links.append(
            f'<a href="{href}" class="{active_class.strip()}"{" aria-current=\"page\"" if key == active_page else ""}>{icon_svg}<span>{label}</span></a>'
        )
    nav_links_html = "\n                ".join(links)
    return f"""<header class="top-header">
        <div class="top-bar container">
            <nav class="nav-links" aria-label="Primary Navigation">
                {nav_links_html}
            </nav>
            <div id="theme-toggle"></div>
        </div>
    </header>"""


def render_sidebar():
    """Render profile sidebar with octicons."""
    return f"""<aside class="academic-sidebar" aria-label="Author Biography">
                    <div class="author-avatar-wrapper">
                        <img src="/images/profile.png" class="author-avatar" alt="Aadarsha Gopala Reddy">
                        <h2 class="author-name">Aadarsha Gopala Reddy</h2>
                        <p class="author-bio">M.S. Computer Science graduate from Washington University in St. Louis</p>
                        <ul class="author-links">
                            <li>{ICONS.get('LOCATION_16', '')} St. Louis, Missouri, USA</li>
                            <li>{ICONS.get('MAIL_16', '')} <a href="mailto:adurs2002@gmail.com">adurs2002 [at] gmail [dot] com</a></li>
                            <li>{ICONS.get('LINKEDIN_16', '')} <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">LinkedIn <span class="sr-only">(opens in a new tab)</span></a></li>
                            <li>{ICONS.get('MARK_GITHUB_16', '')} <a href="https://github.com/agopalareddy" target="_blank" rel="noopener">GitHub <span class="sr-only">(opens in a new tab)</span></a></li>
                        </ul>
                    </div>
                </aside>"""


def render_footer():
    """Render footer with zero inline styles, octicons, and theme picker slot."""
    return f"""<footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col about-col">
                <h3 class="footer-col-heading">Aadarsha Gopala Reddy</h3>
                <p>Software, data, and ML engineer focused on applied research systems: reliable data pipelines, distributed services, and models that hold up outside the notebook.</p>
            </div>
            <div class="footer-col links-col">
                <h3 class="footer-col-heading">Explore</h3>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/experience/">Experience</a></li>
                    <li><a href="/projects/">Projects Showcase</a></li>
                    <li><a href="/cv/">Curriculum Vitae</a></li>
                    <li><a href="/availability/">Availability Schedule</a></li>
                </ul>
            </div>
            <div class="footer-col contact-col">
                <h3 class="footer-col-heading">Connect</h3>
                <ul>
                    <li><a href="mailto:adurs2002@gmail.com">{ICONS.get('MAIL_16', '')} Email</a></li>
                    <li><a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">{ICONS.get('LINKEDIN_16', '')} LinkedIn <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li><a href="https://github.com/agopalareddy" target="_blank" rel="noopener">{ICONS.get('MARK_GITHUB_16', '')} GitHub <span class="sr-only">(opens in a new tab)</span></a></li>
                </ul>
            </div>
            <div class="footer-col resources-col">
                <h3 class="footer-col-heading">Downloads &amp; Info</h3>
                <ul>
                    <li><a href="/files/reddy_cv.pdf" target="_blank" rel="noopener">Curriculum Vitae (PDF) <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li><a href="/files/reddy_resume.pdf" target="_blank" rel="noopener">Resume (PDF) <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li><a href="/accessibility.html">Accessibility Statement</a></li>
                </ul>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; <span class="current-year">2026</span> Aadarsha Gopala Reddy.</p>
            <div id="theme-toggle-footer"></div>
        </div>
    </footer>"""


def render_page_wrapper(head_html, body_html, active_page):
    """Assemble full HTML5 page with Primer chrome."""
    return f"""<!DOCTYPE html>
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
<head>
    {head_html}
</head>
<body>

    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Skip to Content</a>

    <!-- Top Navigation Bar -->
    {render_nav(active_page)}

    <!-- Main Wrapper -->
    <div id="main-content">
        <main class="container">
            <div class="academic-layout">
                {render_sidebar()}

                <article class="academic-content">
                    {body_html}
                </article>
            </div>
        </main>
    </div>

    <!-- Footer -->
    {render_footer()}

    <!-- A11y live region for theme announcements -->
    <div id="a11y-announcer" class="sr-only" aria-live="polite"></div>

    <!-- Theme & Status Scripts -->
    <script src="/assets/js/theme.js?v={ASSETS_VERSION}"></script>
    <script src="/assets/js/status-badge.js?v={ASSETS_VERSION}"></script>
</body>
</html>"""
