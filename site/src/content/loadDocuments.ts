import { execFileSync } from 'node:child_process';
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
}

/**
 * The CV page's documents. Each one's "Updated" date is read from git: the
 * last commit that touched its LaTeX source. The compiled PDFs are left out
 * on purpose — CI recommits them after every source change, and a rebuilt
 * PDF is not an edit.
 */
const DOCUMENTS: Array<Omit<DocumentEntry, 'updatedIso' | 'updatedLabel'> & { sources: string[] }> =
  [
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

export function loadDocuments(): DocumentEntry[] {
  return DOCUMENTS.map(({ sources, ...doc }) => {
    const updatedIso = lastCommitDate(sources);
    const [year, month] = updatedIso.split('-').map(Number);
    return { ...doc, updatedIso, updatedLabel: `${MONTHS[month - 1]} ${year}` };
  });
}
