#!/usr/bin/env python3
"""
Shared HTML chrome for Aadarsha Gopala Reddy's personal website.

Renders the four chrome regions (head, nav, sidebar, footer) and a top-level
page wrapper that any static-site generator can compose. All functions are
pure: no file I/O, no hardcoded paths, no side effects.

Extracted from `scripts/generate_portfolio.py` so both the project detail
generator and the new experience generator can share a single source of
truth for navigation, metadata, sidebar biography, and footer.
"""

# Map active_page identifier to the (href, label) shown in the top nav.
# Order in the dict literal IS the rendered order in the nav bar.
NAV_ITEMS = (
    ("home", "/", "Home"),
    ("experience", "/experience/", "Experience"),
    ("projects", "/projects/", "Projects"),
    ("cv", "/cv/", "CV/Resume"),
    ("availability", "/availability/", "Availability"),
)


def render_head(title, description, canonical_url, og_type="article"):
    """
    Render the full <head> block: meta, favicons, stylesheets, OG, Twitter,
    canonical link. Caller passes dynamic values for title/description/url;
    everything else is static across the site.
    """
    description = description.replace('"', "&quot;").replace("'", "&apos;")
    return f"""<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{description}">
    <title>{title} - Aadarsha Gopala Reddy</title>
    <link rel="stylesheet" href="/assets/css/style.css?v=1.1.1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <!-- Favicons & Mobile Device Integration -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/mstile-150x150.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/mstile-70x70.png">
    <link rel="manifest" href="/images/manifest.json">
    <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#0a0a16">
    <meta name="msapplication-TileColor" content="#0a0a16">
    <meta name="msapplication-TileImage" content="/images/mstile-144x144.png">
    <meta name="msapplication-config" content="/images/browserconfig.xml">
    <meta name="theme-color" content="#0a0a16">

    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="{og_type}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:title" content="{title} - Aadarsha Gopala Reddy">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="https://agreddy.com/images/profile.png">
    <meta property="og:site_name" content="Aadarsha Gopala Reddy">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{canonical_url}">
    <meta name="twitter:title" content="{title} - Aadarsha Gopala Reddy">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="https://agreddy.com/images/profile.png">
    <meta name="twitter:site" content="@aadarsha2002">

    <!-- Canonical Link -->
    <link rel="canonical" href="{canonical_url}">"""


def render_nav(active_page):
    """
    Render the top navigation header. `active_page` is the key of the
    matching NAV_ITEMS tuple element; its link gets `class="nav-link active"`.
    Unknown keys simply produce no active highlight.
    """
    links = []
    for key, href, label in NAV_ITEMS:
        active_class = " nav-link active" if key == active_page else " nav-link"
        links.append(f'<a href="{href}" class="{active_class.strip()}">{label}</a>')
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
    """
    Render the left-hand academic sidebar: avatar, name, bio, and contact
    links. Static across all pages.
    """
    return """<aside class="academic-sidebar" aria-label="Author Biography">
                    <div class="author-avatar-wrapper">
                        <img src="/images/profile.png" class="author-avatar" alt="Aadarsha Gopala Reddy">
                        <h2 class="author-name">Aadarsha Gopala Reddy</h2>
                        <p class="author-bio">M.S. Computer Science graduate from Washington University in St. Louis</p>
                        <ul class="author-links">
                            <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> St. Louis, Missouri, USA</li>
                            <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:adurs2002@gmail.com">adurs2002 [at] gmail [dot] com</a></li>
                            <li><i class="fab fa-linkedin" aria-hidden="true"></i> <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">LinkedIn <span class="sr-only">(opens in a new tab)</span></a></li>
                            <li><i class="fab fa-github" aria-hidden="true"></i> <a href="https://github.com/agopalareddy" target="_blank" rel="noopener">GitHub <span class="sr-only">(opens in a new tab)</span></a></li>
                        </ul>
                    </div>
                </aside>"""


def render_footer():
    """
    Render the four-column site footer (about, explore, connect, downloads)
    plus the bottom bar with copyright and footer theme toggle slot.
    """
    return """<footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col about-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Aadarsha Gopala Reddy</h3>
                <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); margin: 0;">Software, data, and ML engineer focused on applied research systems: reliable data pipelines, distributed services, and models that hold up outside the notebook.</p>
            </div>
            <div class="footer-col links-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Explore</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Home</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/experience/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Experience</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/projects/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Projects Showcase</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/cv/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Curriculum Vitae</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/availability/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Availability Schedule</a></li>
                </ul>
            </div>
            <div class="footer-col contact-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Connect</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="mailto:adurs2002@gmail.com" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;"><i class="fas fa-envelope" aria-hidden="true" style="margin-right: 0.4rem;"></i> Email</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;"><i class="fab fa-linkedin" aria-hidden="true" style="margin-right: 0.4rem;"></i> LinkedIn <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="https://github.com/agopalareddy" target="_blank" rel="noopener" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;"><i class="fab fa-github" aria-hidden="true" style="margin-right: 0.4rem;"></i> GitHub <span class="sr-only">(opens in a new tab)</span></a></li>
                </ul>
            </div>
            <div class="footer-col resources-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Downloads &amp; Info</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="/files/reddy_cv.pdf" target="_blank" rel="noopener" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Curriculum Vitae (PDF) <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/files/reddy_resume.pdf" target="_blank" rel="noopener" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Resume (PDF) <span class="sr-only">(opens in a new tab)</span></a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="/accessibility.html" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Accessibility Statement</a></li>
                </ul>
            </div>
        </div>
        <div class="container footer-bottom" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 1.5rem;">
            <p style="margin: 0;">&copy; <span class="current-year">2026</span> Aadarsha Gopala Reddy.</p>
            <div id="theme-toggle-footer"></div>
        </div>
    </footer>"""


def render_page_wrapper(head_html, body_html, active_page):
    """
    Assemble a complete HTML5 page: doctype, lang, head, skip link, nav,
    main content region (with sidebar + body), footer, and the theme
    persistence script. `head_html` is the inner contents of <head>
    (typically the output of `render_head(...)`). `body_html` is the
    article body to drop inside <article class="academic-content">.
    `active_page` is forwarded to `render_nav` to mark the current section.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
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

    <!-- Theme Switcher Persistence Script -->
    <script src="/assets/js/theme.js"></script>
</body>
</html>"""
