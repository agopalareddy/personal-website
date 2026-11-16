import type { ReactNode } from 'react';

export interface Crumb {
  label: string;
  href: string;
}

export interface AboutItem {
  label: string;
  value: ReactNode;
  /**
   * Lead facts (category, dates, links) are what a reader wants before the
   * prose. On a narrow screen they show as a strip under the title instead
   * of in the About column, which sits below all of the prose there.
   */
  lead?: boolean;
}

export interface RelatedLink {
  label: string;
  href: string;
  /** Short muted note after the link, e.g. "Project · 2026". */
  note: string;
}

export interface PagerLink {
  label: string;
  href: string;
}

export interface DetailShellProps {
  /** Ancestors of this page, outermost first (e.g. Projects). */
  crumbs: Crumb[];
  title: string;
  /** One-sentence summary shown under the title. */
  subtitle?: ReactNode;
  /** Facts for the About column (category, dates, links, …), in display order. */
  about: AboutItem[];
  /** Accessible name for the About column, e.g. "About this project". */
  aboutLabel: string;
  /** Pages about the same work elsewhere on the site. */
  related?: RelatedLink[];
  /** The neighbouring entries in the same list, by date. */
  pager?: { label: string; newer?: PagerLink; older?: PagerLink };
  /** The page's prose. */
  children: ReactNode;
}

/** Titles longer than this drop a size on phones, where they'd fill the screen. */
const LONG_TITLE = 48;

/**
 * The one template behind every detail page (projects and experience):
 * breadcrumb, title, summary, then prose beside an About column of facts.
 * The column drops under the prose when the content area is narrow; the
 * lead facts then show under the title instead (CSS shows one copy or the
 * other, never both, so assistive tech reads each fact once).
 */
export function DetailShell({
  crumbs,
  title,
  subtitle,
  about,
  aboutLabel,
  related = [],
  pager,
  children,
}: DetailShellProps) {
  const lead = about.filter((item) => item.lead);
  const titleClass = title.length > LONG_TITLE ? 'detail-title detail-title--long' : 'detail-title';
  const aboutClass =
    lead.length === about.length ? 'detail-about detail-about--lead-only' : 'detail-about';

  return (
    <div className="detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((c) => (
            <li key={c.href}>
              <a href={c.href}>{c.label}</a>
            </li>
          ))}
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <h1 className={titleClass}>{title}</h1>
      {subtitle && <p className="detail-subtitle">{subtitle}</p>}

      {lead.length > 0 && (
        <ul className="detail-meta" aria-label={aboutLabel}>
          {lead.map((item) => (
            <li key={item.label}>
              <span className="sr-only">{item.label}: </span>
              {item.value}
            </li>
          ))}
        </ul>
      )}

      <div className="detail-grid">
        <div className="detail-main">
          {children}

          {related.length > 0 && (
            <section className="detail-related">
              <h2>Related</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.href}>
                    <a href={r.href}>{r.label}</a>
                    <span className="detail-related-note">{r.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className={aboutClass} aria-label={aboutLabel}>
          <dl>
            {about.map((item) => (
              <div
                className={
                  item.lead ? 'detail-about-item detail-about-item--lead' : 'detail-about-item'
                }
                key={item.label}
              >
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {pager && (pager.newer || pager.older) && (
        <nav className="detail-pager" aria-label={pager.label}>
          {pager.newer && (
            <a className="detail-pager-link" href={pager.newer.href}>
              <span className="detail-pager-dir">Newer</span>
              <span className="detail-pager-title">{pager.newer.label}</span>
            </a>
          )}
          {pager.older && (
            <a className="detail-pager-link detail-pager-link--older" href={pager.older.href}>
              <span className="detail-pager-dir">Older</span>
              <span className="detail-pager-title">{pager.older.label}</span>
            </a>
          )}
        </nav>
      )}
    </div>
  );
}

export interface DetailLink {
  label: string;
  href: string;
  icon: ReactNode;
}

/** A plain list of links for the About column; external ones open a new tab. */
export function DetailLinks({ links }: { links: DetailLink[] }) {
  return (
    <ul className="detail-links">
      {links.map((l) => {
        const isExternal = /^https?:\/\//.test(l.href);
        return (
          <li key={`${l.href}|${l.label}`}>
            <a
              href={l.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener' : undefined}
            >
              {l.icon}
              <span>
                {l.label}
                {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
