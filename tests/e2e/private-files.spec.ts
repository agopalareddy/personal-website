import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// The repository is public and nginx serves everything tracked under files/
// as is. Cover letters, references and anything with a phone number stay
// local (see .gitignore).

const REPO_ROOT = path.resolve(__dirname, '../..');

const PRIVATE_PATHS = [
  '/files/reddy_cover.pdf',
  '/files/cover_tex/reddy_cover.pdf',
  '/files/cover_tex/reddy_cover.tex',
  '/files/cover_tex/references.pdf',
  '/files/cover_tex/references.tex',
  '/files/Linkedin%20Export.pdf',
  '/files/private_contact.tex',
];

const PHONE_LIKE = /\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b|tel:\+?\d{7,}/;

test.describe('Private files', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'not viewport-dependent');
  });

  test('nothing private is tracked under files/', () => {
    const tracked = execFileSync('git', ['ls-files', '-z', 'files'], { cwd: REPO_ROOT })
      .toString()
      .split('\0')
      .filter(Boolean);
    expect(tracked.length).toBeGreaterThan(0);

    const unexpected = tracked.filter((f) => /cover|reference|linkedin|private_contact/i.test(f));
    expect(unexpected).toEqual([]);

    const withPhone = tracked
      .filter((f) => /\.(tex|sty|md|html|txt)$/.test(f))
      .filter((f) => PHONE_LIKE.test(readFileSync(path.join(REPO_ROOT, f), 'utf8')));
    expect(withPhone).toEqual([]);
  });

  test('the public CV and resume sources are set to the web copy', () => {
    for (const rel of ['files/cv_tex/reddy_cv.tex', 'files/resume_tex/reddy_resume.tex']) {
      const source = readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(source, rel).toMatch(/^\\webcopytrue$/m);
      expect(source, rel).not.toMatch(/^\\webcopyfalse$/m);
    }
  });

  test('the server does not serve them', async ({ page, request }) => {
    const home = await page.goto('/');
    // The local working copy keeps these files (gitignored), and a plain static
    // server would hand them out. Only a deployed checkout can show they are gone.
    const server = (await home?.headerValue('server')) ?? '';
    test.skip(/SimpleHTTP|Python/i.test(server), `local static server ("${server}")`);

    for (const url of PRIVATE_PATHS) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(404);
    }
  });
});
