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

/** Ported from scripts/chrome.py's render_sidebar(). */
export function Sidebar({ children }: { children?: ReactNode }) {
  return (
    <aside className="academic-sidebar" aria-label="Author Biography">
      <div className="author-avatar-wrapper">
        <img src="/images/profile.png" className="author-avatar" alt="Aadarsha Gopala Reddy" />
        <h2 className="author-name">Aadarsha Gopala Reddy</h2>
        <p className="author-bio">
          M.S. Computer Science graduate from Washington University in St. Louis
        </p>
        <StatusBadge />
        <ul className="author-links">
          <li>
            <Icon name="LOCATION_16" /> St. Louis, Missouri, USA
          </li>
          <li>
            <Icon name="MAIL_16" />{' '}
            <a
              href="#"
              className="protected-email"
              data-email-user="YWR1cnMyMDAy"
              data-email-domain="Z21haWwuY29t"
              data-email-text="adurs2002 [at] gmail [dot] com"
            >
              adurs2002 [at] gmail [dot] com
            </a>
          </li>
          <li>
            <Icon name="LINKEDIN_16" />{' '}
            <a href="https://www.linkedin.com/in/agopalareddy" target="_blank" rel="noopener">
              LinkedIn <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <Icon name="MARK_GITHUB_16" />{' '}
            <a href="https://github.com/agopalareddy" target="_blank" rel="noopener">
              GitHub <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
      {children}
    </aside>
  );
}
