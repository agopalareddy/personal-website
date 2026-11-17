import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface DocumentEntry {
  title: string;
  /** Public URL of the PDF. */
  src: string;
  category: string;
  categoryClass: string;
  description: string;
  /** ISO date (YYYY-MM-DD) of the last commit to the document's LaTeX source. */
  updatedIso: string;
  /** The same date as "November 2026". */
  updatedLabel: string;
  /** Page count of the PDF. */
  pages: number;
  /** Public URL of a small JPEG of page 1, made from the PDF at build time. */
  thumbSrc: string;
  thumbWidth: number;
  thumbHeight: number;
  /** Top-level section headings, read from the LaTeX source. */
  sections: string[];
}

/**
 * The CV page's documents. Each one's "Updated" date is read from git: the
 * last commit that touched its LaTeX source. The compiled PDFs are left out
 * on purpose — CI recommits them after every source change, and a rebuilt
 * PDF is not an edit.
 */
const DOCUMENTS: Array<
  Pick<DocumentEntry, 'title' | 'src' | 'category' | 'categoryClass' | 'description'> & {
    sources: string[];
  }
> = [
  {
    title: 'Curriculum Vitae',
    src: '/files/reddy_cv.pdf',
    category: 'Academic',
    categoryClass: 'cat-research',
    description: 'Research, teaching, publications, awards, and full academic record.',
    sources: ['files/cv_tex/reddy_cv.tex', 'files/cv_tex/reddy_cv.sty'],
  },
  {
    title: 'Resume',
    src: '/files/reddy_resume.pdf',
    category: 'Industry',
    categoryClass: 'cat-tools',
    description: 'Software engineering, ML, data systems, leadership, and selected projects.',
    sources: ['files/resume_tex/reddy_resume.tex', 'files/resume_tex/reddy_resume.sty'],
  },
];

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf-8' }).trim();
}

/** Date (YYYY-MM-DD) of the last commit that touched any of `paths`. */
function lastCommitDate(paths: string[]): string {
  // A shallow clone only knows its newest commits, so it would report the
  // date of the clone's oldest commit instead of the real one. Fail rather
  // than publish a wrong date.
  if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
    throw new Error(
      'loadDocuments: this is a shallow git clone, so document dates cannot be read. Run `git fetch --unshallow` and build again.'
    );
  }
  const date = git(['log', '-1', '--format=%cs', '--', ...paths]);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`loadDocuments: no git history found for ${paths.join(', ')}`);
  }
  return date;
}

/** Long side of the page-1 thumbnail, in px (shown at ~96px, so 3x). */
const THUMB_LONG_SIDE = 360;

/** Page count and page-1 size (pt) from `pdfinfo` (poppler-utils). */
function pdfFacts(pdf: string): { pages: number; width: number; height: number } {
  const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf-8' });
  const pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1]);
  const size = /^Page size:\s+([\d.]+) x ([\d.]+) pts/m.exec(info);
  if (!pages || !size) throw new Error(`loadDocuments: pdfinfo could not read ${pdf}`);
  return { pages, width: Number(size[1]), height: Number(size[2]) };
}

/**
 * Writes `<out>.jpg`, page 1 of `pdf` scaled to THUMB_LONG_SIDE. pdftoppm's
 * output is the same bytes for the same PDF, so an unchanged PDF leaves no
 * diff behind.
 */
function writeThumb(pdf: string, out: string): void {
  mkdirSync(dirname(out), { recursive: true });
  execFileSync('pdftoppm', [
    '-jpeg',
    '-jpegopt',
    'quality=82',
    '-f',
    '1',
    '-l',
    '1',
    '-singlefile',
    '-scale-to',
    String(THUMB_LONG_SIDE),
    pdf,
    out,
  ]);
}

/**
 * `\section{...}` headings in a LaTeX file, in sentence case:
 * `\section{\sectionlink{url}{TEACHING \& MENTORSHIP}}` → "Teaching & mentorship".
 */
function texSections(texPath: string): string[] {
  const tex = readFileSync(texPath, 'utf-8');
  return [...tex.matchAll(/^\\section\*?\{(.+)\}\s*$/gm)].map(([, body]) => {
    const text = body
      .replace(/\\sectionlink\{[^}]*\}\{([^}]*)\}/, '$1')
      .replace(/\\&/g, '&')
      .trim()
      .toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  });
}

export function loadDocuments(): DocumentEntry[] {
  return DOCUMENTS.map(({ sources, ...doc }) => {
    const updatedIso = lastCommitDate(sources);
    const [year, month] = updatedIso.split('-').map(Number);

    const pdf = join(REPO_ROOT, doc.src);
    const { pages, width, height } = pdfFacts(pdf);
    const thumbSrc = `/images/cv/${basename(doc.src, '.pdf')}.jpg`;
    writeThumb(pdf, join(REPO_ROOT, thumbSrc.replace(/\.jpg$/, '')));
    const scale = THUMB_LONG_SIDE / Math.max(width, height);

    const tex = sources.find((s) => s.endsWith('.tex'));
    if (!tex) throw new Error(`loadDocuments: ${doc.title} has no .tex source`);

    return {
      ...doc,
      updatedIso,
      updatedLabel: `${MONTHS[month - 1]} ${year}`,
      pages,
      thumbSrc,
      thumbWidth: Math.round(width * scale),
      thumbHeight: Math.round(height * scale),
      sections: texSections(join(REPO_ROOT, tex)),
    };
  });
}
