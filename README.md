# Aadarsha Gopala Reddy — Personal Website & Showcase Portfolio

A premium, highly responsive, glassmorphic portfolio and academic showcase website highlighting academic achievements, computer science research, distributed systems engineering, and TA/leadership credentials.

Live Website: [https://agreddy.com](https://agreddy.com)

---

## 🚀 Key Features

* **Dynamic Three-State Theme Toggle**: A custom slider selector (Light / Device / Dark) with persistent theme state matching browser and system preferences, specifically engineered to eliminate Cumulative Layout Shifts (CLS).
* **Premium Aesthetics**: Seamless micro-interactions, responsive grids, and modern layout spacing utilizing a clean glassmorphism design system.
* **Dynamic Spotlight Cards**: Custom coordinate-mapped cursor spotlight border glow implemented on showcase grid cards for a premium interactive feel.
* **Document Modal Panel**: Full-width, direct glassmorphic PDF modals that load previews on-demand within an `iframe` with custom color-schemes and device mode support.
* **A11y Compliant**: Screen-reader skip links, semantic HTML5, explicit ARIA roles, and accessibility statement built in line with WCAG guidelines.
* **Canonical Routing & Redirections**: Configured with a dedicated Nginx server reverse-proxy that forces a unified, canonical HTTPS non-www redirect (`https://agreddy.com`) to prevent duplicate indexing and partitioning of browser caches.

---

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5 (structured section nesting, accessibility indicators).
* **Styling**: Vanilla CSS3 (CSS Custom Properties design system, Flexbox, Grid, keyframe animations).
* **Logic**: Vanilla ES6+ JavaScript (theme managers, coordinate-mapped event listeners, modal controllers).
* **Asset Pipeline**: Lightweight, static directory mapping:
  * `/assets/css/` — Design system rules.
  * `/images/` — Optimized image assets.
  * `/files/` — PDFs and document compiler directories.

---

## 📁 Repository Structure

```
personal-website/
├── index.html               # Main portfolio landing page
├── accessibility.html       # WCAG accessibility statement
├── 404.html                 # Custom 404 error page
│
├── projects/                # Projects showcase archive
│   ├── index.html           # Project grid hub page
│   ├── ms-thesis.html       # Master's Thesis project detail
│   └── ...                  # Individual portfolio detail sheets
│
├── cv/                      # CV & Resume hub
│   └── index.html           # Document modals panel page
│
├── availability/            # Availability schedule
│   └── index.html           # Contact and scheduling console
│
├── files/                   # Document static outputs & compilers
│   ├── reddy_cv.pdf         # Compiled Academic CV
│   ├── reddy_resume.pdf     # Compiled Industry Resume
│   ├── cv_tex/              # LaTeX source folder for Academic CV
│   │   ├── reddy_cv.tex     # LaTeX CV source
│   │   └── reddy_cv.sty     # CV styling framework (needspace & paracol)
│   └── resume_tex/          # LaTeX source folder for Industry Resume
│       ├── reddy_resume.tex # LaTeX Resume source
│       └── reddy_resume.sty # Resume styling framework
│
└── assets/                  # Shared style definitions and scripts
    ├── css/
    │   └── style.css        # Central stylesheet & variables
    └── js/
```

---

## 💻 Local Development & Setup

### 1. Serve the Website
Because the website uses local relative paths for previews and assets, it should be run on a local HTTP server to prevent CORS issues with iframe loading.

Using Python:
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📄 Compiling LaTeX Documents

The CV and Resume source files reside in `/files/cv_tex/` and `/files/resume_tex/` and are built using `latexmk`. Spacing and page breaks are handled dynamically at the style level (`.sty` file) to prevent orphan headers or split bullet points.

### Prerequisites
Make sure a LaTeX distribution (such as TeX Live or MacTeX) is installed.

### Build Instructions
To compile the CV:
```bash
cd files/cv_tex
latexmk -pdf reddy_cv.tex
```

To compile the Resume:
```bash
cd files/resume_tex
latexmk -pdf reddy_resume.tex
```

### Clean Build Residuals
Always clean auxiliary compilation logs before committing changes:
```bash
# Inside cv_tex or resume_tex directories:
rm -f *.aux *.log *.fls *.fdb_latexmk *.out *.synctex.gz
```

---

## 🔄 Deployment Policy

This website is hosted on a **Google Cloud Platform (GCP) Compute Engine** instance. 

To maintain canonical history and prevent discrepancies, **ALL deployments must be performed strictly via Git** — never via manual `scp` or `sftp` transfers.

### Deploy Command:
```bash
# Push locally
git add -A && git commit -m "feat: commit message" && git push origin main

# Deploy live on the GCP server
ssh gcp-showcase "cd /opt/personal-website && git pull origin main"
```

The server Nginx configuration will serve the new files directly from `/opt/personal-website/` with unified HTTPS non-www canonical routing.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
