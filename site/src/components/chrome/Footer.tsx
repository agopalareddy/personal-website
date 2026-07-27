/**
 * Ported from scripts/chrome.py's render_footer(). The copyright year is
 * computed at build/render time (site is rebuilt frequently — AGENTS.md's
 * deploy flow) instead of client-side (assets/js/theme.js's initYear()) —
 * one fewer runtime dependency for a value that only needs to be correct as
 * of the last build.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <span className="footer-copyright">
          &copy; <span className="current-year">{year}</span> Aadarsha Gopala Reddy
        </span>
        <nav aria-label="Footer Navigation">
          <ul className="footer-links">
            <li className="footer-cv-link">
              <a href="/cv/">CV/Resume</a>
            </li>
            <li>
              <a
                href="#"
                className="protected-email"
                data-email-user="YWR1cnMyMDAy"
                data-email-domain="Z21haWwuY29t"
              >
                Email
              </a>
              <noscript>
                (requires JavaScript —{' '}
                <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">
                  message me on LinkedIn
                </a>{' '}
                instead)
              </noscript>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">
                LinkedIn <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/agopalareddy" target="_blank" rel="noopener">
                GitHub <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="/accessibility.html">Accessibility</a>
            </li>
          </ul>
        </nav>
        {/* Hydration mount point for the ThemePicker island (T014/T016) */}
        <div id="theme-toggle-footer" />
      </div>
    </footer>
  );
}
