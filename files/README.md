# CV, Resume, and Cover Letter TeX Templates

This directory contains TeX files for creating a CV, a resume, and a cover letter. These templates are designed to be easily customizable.

## Directory Structure

- **`cv_tex/`**: Contains the TeX files for the full academic Curriculum Vitae (CV).
  - `reddy_cv.tex`: The main TeX file for the CV.
  - `reddy_cv.sty`: The style file associated with the CV, defining formatting and layout.
  - `reddy_cv.pdf`: An example PDF output of the CV.
- **`resume_tex/`**: Contains the TeX files for a concise resume.
  - `reddy_resume.tex`: The main TeX file for the resume.
  - `reddy_resume.sty`: The style file associated with the resume.
  - `reddy_resume.pdf`: An example PDF output of the resume.
- **`cover_tex/`**: Contains the TeX files for a cover letter.
  - `reddy_cover.tex`: The main TeX file for the cover letter.
  - `reddy_cover.sty`: The style file associated with the cover letter, defining formatting and layout.
  - `reddy_cover.pdf`: The compiled PDF output of the cover letter.
  - **Tailoring**: Use the `cover-letter-tailor` skill (AI agent) to automatically rewrite the cover letter for specific job applications based on a job description and title.

## How to Use

To use these templates for your own CV or resume, you will primarily need to edit the `.tex` files.

### Method 1: Using Overleaf (Recommended & Easiest)

Overleaf is an online LaTeX editor that simplifies the setup process:

1.  **Download** the `cv_tex` or `resume_tex` folder (or both) to your computer.
2.  Go to [Overleaf](https://www.overleaf.com) and sign up or log in.
3.  Create a **New Project** (select "Blank Project" or "Upload Project" if you prefer to upload the whole folder).
4.  If you created a Blank Project, Overleaf might create a default `main.tex` file. If so, **delete it**.
5.  **Upload** the `.tex` file (e.g., `reddy_cv.tex`) and the corresponding `.sty` file (e.g., `reddy_cv.sty`) from the downloaded folder into your Overleaf project. (If you chose "Upload Project" in step 3, you would have uploaded the entire folder already).
6.  Click the "**Recompile**" button in Overleaf. The document should compile without issues.
7.  You can now **edit the `.tex` file** directly in Overleaf. See the "Editing the .tex file" section below for guidance on what to change.

### Method 2: Local LaTeX Setup (Advanced Users)

This method requires a LaTeX distribution installed on your system.

1.  **Download the relevant folder**: Download either `cv_tex` or `resume_tex` (or both) to your local machine.
2.  **Prerequisites**: Ensure you have a LaTeX distribution installed on your system (e.g., MiKTeX for Windows, TeX Live for Linux/macOS, or MacTeX for macOS).
3.  **Edit the `.tex` file**:
    - Open the `.tex` file (e.g., `reddy_cv.tex` or `reddy_resume.tex`) in a TeX editor (like TeXShop, TeXstudio, VS Code with LaTeX Workshop extension).
    - See the "Editing the .tex` file" section below for guidance on what to change.
4.  **Compile the `.tex` file**: Use your LaTeX editor's compile button or a command-line tool (like `pdflatex`) to compile the `.tex` file. You may need to compile it multiple times for all cross-references and citations (if any) to be correctly generated.
    ```bash
    pdflatex your_file_name.tex
    # Run again if needed for references/citations
    pdflatex your_file_name.tex
    ```
5.  **Review the PDF**: Check the generated PDF to ensure it looks as expected.

### Editing the `.tex` file (Applies to both Overleaf and Local Setup)

Once you have your project open in Overleaf or your local editor, you'll primarily be modifying the content within the `.tex` files (`reddy_cv.tex` or `reddy_resume.tex`).

- **Header Section**:
  - Locate the `\\begin{header}` environment at the beginning of the `.tex` file.
  - Update your **Name**, **Email**, and **Phone Number** within the minipages.
  - Change the website URL in `\\href{https://agopalareddy.github.io}{agopalareddy.github.io}`.
  - Update the URL within the `\\qrcode{https://agopalareddy.github.io}` command to generate your personal QR code.
- **Content Sections**:
  - The `.tex` files are structured with predefined sections (e.g., `\\section{EDUCATION}`, `\\section{SKILLS}`).
  - Within each section, content is added using custom LaTeX environments defined in the `.sty` files (e.g., `\\begin{educationentry}{...}{...}{...}`).
  - Replace the placeholder content within these environments with your own information. The `.tex` files include comments indicating what each argument for these environments represents.
  - **Adding/Removing Items**: Inside environments like `educationentry`, `experienceentry`, etc., details are often listed using `\\item`. Add or remove these `\\item` lines as needed.
  - **Adding/Removing Sections**: You can remove an entire section by deleting its `\\section{...}` command and all associated content environments. To add a new section, you can copy an existing one and modify its title and content. Consistent use of `\\vspace{\\headerSpacing}` between sections and `\\vspace{\\entrySpacing}` (optional, often commented out for a compact look) between entries within a section allows for control over spacing. The `\\needspace{...}` command is used before sections to help prevent awkward page breaks.
- **Understanding Custom Environments**:
  - The `.sty` files (`reddy_cv.sty`, `reddy_resume.sty`) define various environments to structure content.
  - For example, in `reddy_cv.tex`, an education entry shows its arguments as follows:
    ```latex
    \\begin{educationentry}
        {M.S. Computer Science} % Degree
        {Washington University in St. Louis, St. Louis, Missouri, USA} % Institution & Location
        {Fall 2024 - *Spring 2026} % Date Range
        \\item \\textbf{GPA:} 3.52/4.0
        \\item \\textbf{Coursework:} Relevant courses...
    \\end{educationentry}
    ```
  - Refer to the commented, existing entries in the `.tex` files as the primary template for your own content.

### Specific Files and What to Change:

#### `cv_tex/reddy_cv.tex`

This file is for a comprehensive academic CV and includes extensive comments for clarity.

- **Header**: Update personal details and QR code URL as described above.
- **Package Loading**: Common packages like `qrcode`, `hyperref`, `atveryend`, `microtype` are loaded by `reddy_cv.sty`. You generally do not need to load them in `reddy_cv.tex`.
- **Sections to Populate**:
  - `\\section{EDUCATION}`: Use `\\begin{educationentry}{Degree}{Institution & Location}{Date Range}`. Add details with `\\item`.
  - `\\section{RESEARCH EXPERIENCE}`: Use `\\begin{researchentry}{Project Title (can include \\href)}{Organization/Lab}{Location}{Course/Context (Optional)}{Date Range}`. Add details with `\\item`.
  - `\\section{TEACHING EXPERIENCE}`: Use `\\begin{experienceentry}{Position Title}{Organization}{Location}{Date Range}`. Add details with `\\item`.
  - `\\section{INDUSTRY EXPERIENCE}`: Use `\\begin{experienceentry}{Position Title}{Organization}{Location}{Date Range}`. Add details with `\\item`.
  - `\\section{SKILLS}`: Uses `\\begin{skillcategory}{Category Name}`. List your skills as plain text content within this environment.
    _Example:_ `\\begin{skillcategory}{Programming Languages} Java, Python, C++ \\end{skillcategory}`
  - `\\section{HONORS}`: Use `\\begin{honorentry}{Date/Year}{Honor Name & Institution}`. This environment does not use `\\item`.
  - `\\section{PRESENTATIONS}`: Use `\\begin{presentationentry}{Date}{Title}{Venue/Event}{University/Location}`. This environment does not use `\\item`.
  - `\\section{LEADERSHIP EXPERIENCE}`: Uses `\\begin{leadershipentry}{Organization}{Location}` which contains one or more `\\begin{positionentry}{Position Title}{Date Range}`. Add details for each position using `\\item` within `positionentry`.
  - `\\section{PROJECTS}`: Use `\\begin{projectentry}{Project Title (can include \\href)}{Organization/Lab}{Location}{Context (Optional)}{Date Range}`. Add details with `\\item`. (Similar structure to `researchentry`).

#### `resume_tex/reddy_resume.tex`

This file is for a concise, typically 1-2 page resume and includes comments for readability.

- **Header**: Update personal details and QR code URL as described above.
- **Package Loading**: Common packages like `qrcode`, `hyperref`, `atveryend`, `microtype` are loaded by `reddy_resume.sty`.
- **Sections to Populate**:
  - `\\section{SUMMARY}`: Uses `\\begin{onecolentry} ...your summary text... \\end{onecolentry}`. This is wrapped in `\\begin{samepage}` to try and keep it on one page.
  - `\\section{SKILLS}`: Uses `\\begin{skillcategory}{Category Name}`. List your skills as plain text content within this environment.
    _Example:_ `\\begin{skillcategory}{Programming Languages} Java, Python, C++ \\end{skillcategory}`
  - `\\section{EDUCATION}`: Use `\\begin{educationentry}{Degree}{Institution & Location}{Date}`. Add details with `\\item`.
  - `\\section{EXPERIENCE}`: Use `\\begin{experienceentry}{Position Title}{Organization & Location}{Date}`. Add details with `\\item`.
  - `\\section{PROJECTS}`: Use `\\begin{projectentry}{Project Title (can include \\href)}{Date Range}`. Add details with `\\item`.

### Customizing the Style (`.sty` files)

The `.sty` files (`reddy_cv.sty` and `reddy_resume.sty`) control the visual appearance (fonts, margins, colors, section formatting, custom environments, etc.). **Modify these files with caution, as incorrect changes can break the document compilation. Always make a backup before editing.** The `.sty` files contain comments to help understand their structure.

- **Key things you might want to change in the `.sty` files**:
  - **Colors**:
    - `\\definecolor{primaryColor}{RGB}{0, 0, 0}` (currently black)
    - `\\definecolor{accentColor}{RGB}{50, 50, 50}` (currently dark gray)
    - You can change the RGB values to customize these.
  - **Fonts**:
    - The templates use the `charter` package and `lmodern` (via `fontenc` and `inputenc` in a `\\ifPDFTeX` block). `microtype` is also loaded for typographic improvements. You can explore other LaTeX font packages if desired, but this may require more significant changes.
  - **Margins and Spacing (Important for Layout!)**:
    - **Page Margins**: These are defined in the `.sty` files using the `geometry` package. Look for lines like:
      ```latex
      \\RequirePackage[
          ignoreheadfoot,
          top=1.2cm, bottom=1.2cm, left=1.2cm, right=1.3cm, % Adjust these values
          footskip=0.8cm
      ]{geometry}
      ```
      Changing `top`, `bottom`, `left`, `right` values will alter the overall page margins.
    - **Vertical Spacing**: The `.sty` files define several custom lengths to control vertical spacing between elements:
      - `\\headerSpacing`: Space between major sections (e.g., after a `\\section{...}` and its content).
      - `\\entrySpacing`: Space before a new entry (e.g., `educationentry`, `experienceentry`). In the `.tex` files, `\\vspace{\\entrySpacing}` is often commented out by default for a more compact layout but can be enabled.
      - `\\highlightSpacing`: Space before a list of highlights/bullet points within an entry (i.e., before the `\\begin{highlightsforbulletentries}`).
        You can find their definitions (e.g., `\\newlength{\\headerSpacing} \\setlength{\\headerSpacing}{3pt}`) and modify the `\\setlength` values (e.g., `3pt`) to increase or decrease space.
    - **Horizontal Spacing**: `\\kernSpacing` is used for small horizontal gaps between inline elements (like the `\\AND` separator in the header).
    - **Controlling Page Breaks with `\\needspace`**:
      - The `\\needspace{<length>}` command is crucial for preventing awkward page breaks, especially before new sections or large entries. It checks if the specified `<length>` of vertical space is available on the current page. If not, it forces a page break _before_ the content that follows the `\\needspace` command.
      - **Where to find it**: You will primarily find `\\needspace` commands in the main `.tex` files (`reddy_cv.tex`, `reddy_resume.tex`) just before `\\section{...}` commands. For example: `\\needspace{5\\baselineskip} \\section{EDUCATION}`. It might also be used within the definitions of some custom environments in the `.sty` files if an environment is expected to be kept together.
      - **How to adjust it**: The `<length>` is typically specified in terms of `\\baselineskip` (the normal vertical distance between lines of text). For instance, `5\\baselineskip` requests space for about 5 lines of text.
      - **When to adjust it**: If you find that a new section is starting too close to the bottom of a page, or a page break occurs in an undesirable location within a section, consider adjusting the `\\needspace` value for the preceding section or entry.
        - **Too much white space at the top of a new page before a section?** The `\\needspace` value for that section might be too large. Try reducing it (e.g., from `7\\baselineskip` to `4\\baselineskip`) and recompile.
        - **A section header appears at the bottom of a page with its content on the next?** The `\\needspace` value might be too small or missing. Try increasing it (e.g., from `3\\baselineskip` to `6\\baselineskip`) to force the header to the next page along with its content.
        - **An entry (like a long job description) breaks awkwardly?** While `\\needspace` is mostly for sections, the `samepage` environment is used within most custom entry types (like `educationentry`, `experienceentry`) to try and keep them from breaking. If an entry is too long to fit on one page even with `samepage`, you might need to manually insert a `\\newpage` command at a logical point within its content, or restructure the content.
      - **General `\\vspace{...}`**: This command is used in the `.tex` and `.sty` files to add specific amounts of vertical space. If you find spacing issues after adding/removing content, you might need to adjust these as well, but `\\needspace` is more directly related to page break control for larger blocks of content.
    - **Itemized List Spacing**: Environments like `highlightsforbulletentries` in the `.sty` files have their own spacing parameters (e.g., `topsep`, `itemsep`, `leftmargin`).
    - **Troubleshooting Spacing**: If your content is running off the page or sections are too cramped/spread out, adjusting these margin and spacing values in the `.sty` file is the primary way to fix it. Start with small adjustments and recompile to see the effect.
  - **Required Packages**: The `.sty` files load many common and necessary packages (e.g., `geometry`, `titlesec`, `xcolor`, `hyperref`, `fontawesome5`, `qrcode`, `microtype`, `atveryend`, etc.). This means you generally don't need to load them in your main `.tex` file. If you compile locally and get errors about missing packages that are _not_ `reddy_cv.sty` or `reddy_resume.sty` themselves, but rather packages _they_ require (like `charter.sty`), you'll need to install them using your LaTeX distribution's package manager (e.g., MiKTeX Console, TeX Live Manager `tlmgr`).

## Troubleshooting Common Issues

- **Compilation Errors**:
  - **Missing Packages**: LaTeX might report missing `.sty` files (packages). Your LaTeX distribution should be able to install these automatically or prompt you to do so. If not, you may need to install them manually using your distribution's package manager (e.g., `tlmgr` for TeX Live, MiKTeX Console for MiKTeX).
  - **Undefined Control Sequence**: This usually means a LaTeX command was misspelled, or a package that defines the command was not loaded, or there's a syntax error in your `.tex` file. Check the line number indicated in the error message.
  - **File Not Found**: Ensure all necessary files (like images, if you add any, or custom `.sty` files) are in the same directory as your main `.tex` file, or in a path LaTeX can find.
- **Formatting Issues**:
  - If the layout looks strange after your edits, double-check for unclosed brackets `{}`, unclosed environments (`\begin{...}` without a matching `\end{...}`), or incorrect command usage.
- **Font Issues**:
  - If you are using specific fonts (e.g., via `fontspec` package for XeLaTeX/LuaTeX), ensure those fonts are installed on your system. The templates might use common fonts, but if you change them, this could be a factor.

## Notes

- These templates are provided as-is. You are free to modify and use them for your personal, non-commercial purposes.
- The provided PDFs (`reddy_cv.pdf`, `reddy_resume.pdf`) are examples based on the original content and will be overwritten when you compile the `.tex` files with your information.
