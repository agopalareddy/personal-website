#!/usr/bin/env python3
import os
import re

PROJECTS_DIR = "/home/adurs/repos/GCP_Projects/personal-website/projects"

def update_head(file_path):
    filename = os.path.basename(file_path)
    if filename == "index.html":
        return # Skip main projects catalog (handled separately or manually)
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract title
    title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
    if not title_match:
        print(f"[-] No title found in {filename}")
        return
    title = title_match.group(1).strip()
    
    # Strip any existing suffix like " - Aadarsha Gopala Reddy" to avoid duplication
    clean_title = re.sub(r"\s*-\s*Aadarsha Gopala Reddy.*$", "", title)
    
    # Extract a description from the first paragraph or generic meta description
    desc = "Explore this research and engineering project by Aadarsha Gopala Reddy."
    # Try to find the project description in paragraph tags or similar
    p_match = re.search(r"<p.*?>(.*?)</p>", content, re.IGNORECASE | re.DOTALL)
    if p_match:
        # Strip HTML tags from the paragraph to get clean text
        p_text = re.sub(r"<[^>]+>", "", p_match.group(1)).strip()
        # Clean up double spaces/newlines
        p_text = re.sub(r"\s+", " ", p_text)
        if len(p_text) > 10:
            desc = p_text[:160] + "..." if len(p_text) > 160 else p_text

    # Escape quotes in description for meta tags
    desc_escaped = desc.replace('"', '&quot;').replace("'", "&apos;")
    canonical_url = f"https://agreddy.com/projects/{filename}"

    # Build advanced head
    new_head = f"""<head>
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
</head>"""

    # Replace old head
    # Match <head> ... </head> case insensitively
    modified_content = re.sub(
        r"<head>.*?</head>",
        new_head,
        content,
        flags=re.IGNORECASE | re.DOTALL
    )
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(modified_content)
    print(f"[+] Successfully updated headers for {filename}")

def main():
    for entry in os.scandir(PROJECTS_DIR):
        if entry.is_file() and entry.name.endswith(".html"):
            update_head(entry.path)

if __name__ == "__main__":
    main()
