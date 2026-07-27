import type { ReactNode } from 'react';
import { Head, type HeadProps } from './Head';
import { Nav, type ActivePage } from './Nav';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export interface LayoutProps extends HeadProps {
  activePage?: ActivePage;
  contentAriaLabel?: string;
  bodyClassName?: string;
  /** 404.html and similarly plain pages skip the academic-layout sidebar entirely. */
  hideSidebar?: boolean;
  /** Catalog pages' filter/TOC panel (CatalogFilter), rendered inside the sidebar after the author bio. */
  sidebarExtra?: ReactNode;
  children: ReactNode;
}

/**
 * The one reusable chrome unit (FR-003) — ported from scripts/chrome.py's
 * render_page_wrapper(). Rendered to static HTML at build time
 * (site/build/render.mjs); render.mjs prepends "<!doctype html>" since JSX
 * has no doctype node.
 */
export function Layout({
  activePage,
  contentAriaLabel,
  bodyClassName,
  hideSidebar,
  sidebarExtra,
  children,
  ...headProps
}: LayoutProps) {
  return (
    <html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
      <Head {...headProps} />
      <body className={bodyClassName}>
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>

        <Nav activePage={activePage} />

        <div id="main-content" tabIndex={-1}>
          <main className="container">
            {hideSidebar ? (
              children
            ) : (
              <div className="academic-layout">
                <Sidebar>{sidebarExtra}</Sidebar>
                <article className="academic-content" aria-label={contentAriaLabel}>
                  {children}
                </article>
              </div>
            )}
          </main>
        </div>

        <Footer />

        <div id="a11y-announcer" className="sr-only" aria-live="polite" />

        <script src="/assets/js/sw-register.js" />
      </body>
    </html>
  );
}
