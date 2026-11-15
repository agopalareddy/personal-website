import type { ReactNode } from 'react';

export interface Crumb {
  label: string;
  href: string;
}

export interface AboutItem {
  label: string;
  value: ReactNode;
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
  /** The page's prose. */
  children: ReactNode;
}

/**
 * The one template behind every detail page (projects and experience):
 * breadcrumb, title, summary, then prose beside an About column of facts.
 * The column drops under the prose when the content area is narrow.
 */
export function DetailShell({
  crumbs,
  title,
  subtitle,
  about,
  aboutLabel,
  children,
}: DetailShellProps) {
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

      <h1 className="detail-title">{title}</h1>
      {subtitle && <p className="detail-subtitle">{subtitle}</p>}

      <div className="detail-grid">
        <div className="detail-main">{children}</div>
        <aside className="detail-about" aria-label={aboutLabel}>
          <dl>
            {about.map((item) => (
              <div className="detail-about-item" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
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
