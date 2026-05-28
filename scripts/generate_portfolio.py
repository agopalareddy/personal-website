#!/usr/bin/env python3
"""
Aadarsha Gopala Reddy - Static HTML Portfolio Generator
Allows maintaining all projects, research papers, and workshops from a single JSON database.
Compiles projects catalog and individual glassmorphic detail subpages with unified headers,
SEO metadata, Open Graph cards, and mobile favicon integration.
"""

import os
import json
import re

BASE_DIR = "/home/adurs/repos/GCP_Projects/personal-website"
PROJECTS_JSON = os.path.join(BASE_DIR, "scripts/projects_database.json")
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")

# A default database template to initialize if it doesn't exist
DEFAULT_DB = [
    {
        "id": "ms-thesis",
        "title": "Toward Vehicle-Agnostic Driving Signatures for Cognitive Impairment Prediction from Naturalistic Driving Data",
        "excerpt": "Master's thesis comparing six model families (GRU-DANN, DANN, classical baselines) for cognitive impairment prediction from naturalistic telematics.",
        "venue": "Washington University in St. Louis",
        "venue_tag": "WashU",
        "date": "2026-04-01",
        "formatted_date": "Spring 2026",
        "category": "Research & ML",
        "technologies": ["Python", "PyTorch", "Deep Learning", "Domain Adaptation", "Sequence Modeling", "Scikit-learn"],
        "github": None,
        "demo": None,
        "pdf": "/files/thesis-main.pdf",
        "presentation": None,
        "has_detail": True,
        "content_html": "<p>Master's thesis completed in the McKelvey School of Engineering...</p>"
    }
]

def load_database():
    if not os.path.exists(PROJECTS_JSON):
        # Create default database if missing
        os.makedirs(os.path.dirname(PROJECTS_JSON), exist_ok=True)
        with open(PROJECTS_JSON, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_DB, f, indent=2)
        print(f"[i] Created a template projects database at {PROJECTS_JSON}")
    
    with open(PROJECTS_JSON, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_project_detail_page(project):
    """Generates an individual project detail HTML page from the JSON record."""
    filename = f"{project['id']}.html"
    file_path = os.path.join(PROJECTS_DIR, filename)
    
    clean_title = project['title']
    desc_escaped = project['excerpt'].replace('"', '&quot;').replace("'", "&apos;")
    canonical_url = f"https://agreddy.com/projects/{filename}"
    tech_tags_html = "".join([f'<span class="tech-tag">{t}</span>' for t in project['technologies']])
    
    action_buttons = []
    if project.get('github'):
        action_buttons.append(f'<a href="{project["github"]}" target="_blank" rel="noopener" class="card-btn btn-github"><i class="fab fa-github" aria-hidden="true"></i> GitHub <span class="sr-only">(opens in a new tab)</span></a>')
    if project.get('demo'):
        action_buttons.append(f'<a href="{project["demo"]}" class="card-btn btn-demo"><i class="fas fa-rocket" aria-hidden="true"></i> Demo</a>')
    if project.get('pdf'):
        action_buttons.append(f'<a href="{project["pdf"]}" target="_blank" rel="noopener" class="card-btn btn-pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> PDF Paper <span class="sr-only">(opens in a new tab)</span></a>')
    if project.get('presentation'):
        action_buttons.append(f'<a href="{project["presentation"]}" target="_blank" rel="noopener" class="card-btn btn-pdf"><i class="fas fa-file-powerpoint" aria-hidden="true"></i> Slides <span class="sr-only">(opens in a new tab)</span></a>')

    actions_bar = f'<div class="card-actions" style="margin-top: 2rem; justify-content: flex-start; gap: 1rem;">{"".join(action_buttons)}</div>' if action_buttons else ''

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{desc_escaped}">
    <title>{clean_title} - Aadarsha Gopala Reddy</title>
    <link rel="stylesheet" href="/assets/css/style.css">
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
    <meta property="og:type" content="article">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:title" content="{clean_title} - Aadarsha Gopala Reddy">
    <meta property="og:description" content="{desc_escaped}">
    <meta property="og:image" content="https://agreddy.com/images/profile.png">
    <meta property="og:site_name" content="Aadarsha Gopala Reddy">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{canonical_url}">
    <meta name="twitter:title" content="{clean_title} - Aadarsha Gopala Reddy">
    <meta name="twitter:description" content="{desc_escaped}">
    <meta name="twitter:image" content="https://agreddy.com/images/profile.png">
    <meta name="twitter:site" content="@aadarsha2002">

    <!-- Canonical Link -->
    <link rel="canonical" href="{canonical_url}">
</head>
<body>

    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Skip to Content</a>

    <!-- Top Navigation Bar -->
    <header class="top-header">
        <div class="top-bar container">
            <nav class="nav-links" aria-label="Primary Navigation">
                <a href="/" class="nav-link">Home</a>
                <a href="/projects/" class="nav-link active">Projects</a>
                <a href="/cv/" class="nav-link">CV/Resume</a>
                <a href="/availability/" class="nav-link">Availability</a>
            </nav>
            <div id="theme-toggle"></div>
        </div>
    </header>

    <!-- Main Wrapper -->
    <div id="main-content">
        <main class="container">
            <div class="academic-layout">
                <aside class="academic-sidebar" aria-label="Author Biography">
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
                </aside>

                <article class="academic-content" aria-label="Project Detail: {clean_title}">
                    <h1 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">{clean_title}</h1>
                    <p style="font-family: var(--font-body); font-size: 0.9rem; font-style: italic; color: var(--text-muted); margin-bottom: 2rem;">
                        {project['venue']} &mdash; {project['formatted_date']}
                    </p>
                    <section class="page__content">
                        {project.get('content_html', '')}
                    </section>
                    
                    <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                        <h4 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-primary);">Technologies Applied</h4>
                        <div class="project-tech">{tech_tags_html}</div>
                    </div>

                    {actions_bar}
                </article>
            </div>
        </main>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col about-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Aadarsha Gopala Reddy</h3>
                <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); margin: 0;">M.S. Computer Science graduate from Washington University in St. Louis. Passionate about solving complex distributed systems problems, building high-throughput data pipelines, and training machine learning models.</p>
            </div>
            <div class="footer-col links-col">
                <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; display: inline-block; margin-bottom: 1rem;">Explore</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="/" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Home</a></li>
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
        </div>
    </footer>

    <!-- Theme Switcher Persistence Script -->
    <script src="/assets/js/theme.js"></script>
</body>
</html>"""
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[+] Generated project detail page: {filename}")

def update_catalog_index(projects):
    """Updates the dynamic catalog JS array inside projects/index.html to include all database entries."""
    catalog_path = os.path.join(PROJECTS_DIR, "index.html")
    if not os.path.exists(catalog_path):
        print(f"[-] Catalog index not found at {catalog_path}")
        return

    with open(catalog_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Formulate clean JSON serialization for the array
    # Stripping out content_html to keep the index listing lightweight
    lightweight_projects = []
    for p in projects:
        lp = p.copy()
        if 'content_html' in lp:
            del lp['content_html']
        lightweight_projects.append(lp)

    serialized_js_array = json.dumps(lightweight_projects, indent=2)
    
    # Locate projects array declaration in projects/index.html: const projects = [ ... ];
    modified_content = re.sub(
        r"const projects = \[.*?\];",
        f"const projects = {serialized_js_array};",
        content,
        flags=re.DOTALL
    )
    
    with open(catalog_path, "w", encoding="utf-8") as f:
        f.write(modified_content)
    print(f"[+] Successfully synchronized {len(projects)} projects inside projects/index.html catalog grid.")

def main():
    print("[*] Launching Portfolio Compilation Pipeline...")
    projects = load_database()
    
    # Compile each detail page
    for project in projects:
        if project.get('has_detail'):
            generate_project_detail_page(project)
            
    # Compile list index
    update_catalog_index(projects)
    print("[*] Portfolio Compilation Successful! All pages are synchronized and live.")

if __name__ == "__main__":
    main()
