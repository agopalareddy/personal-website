import type { ReactNode } from 'react';
import { Icon } from '../common/Icon';

export interface StatusBadgeProps {
  text?: string;
  ariaLabel?: string;
  variant?: 'available' | 'busy' | 'unavailable' | 'custom';
  pulse?: boolean;
}

/**
 * Ported from assets/js/status-badge.js — rendered directly as part of the
 * sidebar now instead of a runtime auto-mount script, since this is
 * server-rendered at build time (research.md R1). This is a strict
 * improvement over today's behavior: the badge used to be entirely absent
 * with JavaScript disabled; it's now always present (FR-004's "equivalent
 * visible content" floor, never less).
 */
function StatusBadge({
  text = 'Open to opportunities',
  ariaLabel = 'Currently open to opportunities',
  variant = 'available',
  pulse = true,
}: StatusBadgeProps) {
  return (
    <div className={`status-badge status-badge--${variant}`} role="status" aria-label={ariaLabel}>
      {pulse && <span className="status-dot" aria-hidden="true" />}
      {text}
    </div>
  );
}

/**
 * Archived 2026-11: the "Open to opportunities" badge is hidden while
 * employed. Flip to `true` to bring it back; StatusBadge and its CSS are
 * kept intact for that.
 */
const SHOW_STATUS_BADGE = false;

/** Ported from scripts/chrome.py's render_sidebar(). */
export function Sidebar({ children }: { children?: ReactNode }) {
  return (
    <aside className="academic-sidebar" aria-label="Author Biography">
      <div className="author-avatar-wrapper">
        {/* Shown at 64–150 CSS px; the two files cover 1x and 2x screens. */}
        <img
          src="/images/profile-384.webp"
          srcSet="/images/profile-192.webp 192w, /images/profile-384.webp 384w"
          sizes="(max-width: 47.99em) 64px, 150px"
          width={384}
          height={384}
          className="author-avatar"
          alt="Aadarsha Gopala Reddy"
          fetchPriority="high"
        />
        {/* A paragraph, not a heading: the page's own h1 comes after this in
            the document, and the heading outline should start there. */}
        <p className="author-name">Aadarsha Gopala Reddy</p>
        <p className="author-bio">
          <span className="author-bio-role">
            IT Training Specialist at the University of Florida.
          </span>{' '}
          <span className="author-bio-more">
            M.S. Computer Science, Washington University in St. Louis
          </span>
        </p>
        {SHOW_STATUS_BADGE && <StatusBadge />}
        <ul className="author-links">
          <li className="author-location">
            <Icon name="LOCATION_16" /> Gainesville, Florida, USA
          </li>
          {/* Each link holds its own icon so the phone layout can show the
              icon alone while the label stays as the accessible name. */}
          <li>
            <a
              href="#"
              className="protected-email"
              data-email-user="YWdy"
              data-email-domain="YWdyZWRkeS5jb20="
              data-email-text="agr [at] agreddy [dot] com"
            >
              <Icon name="MAIL_16" />
              <span className="author-link-label" data-email-label>
                agr [at] agreddy [dot] com
              </span>
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
              <Icon name="LINKEDIN_16" />
              <span className="author-link-label">LinkedIn</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/agopalareddy" target="_blank" rel="noopener">
              <Icon name="MARK_GITHUB_16" />
              <span className="author-link-label">GitHub</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
      {children}
    </aside>
  );
}
