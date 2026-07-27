import { Layout } from '../components/chrome/Layout';

/** Ported from 404.html — the only page that skips the sidebar entirely. */
export function NotFoundPage() {
  return (
    <Layout
      activePage={undefined}
      hideSidebar
      title="Page Not Found"
      description="Page not found. Academic engineering portfolio of Aadarsha Gopala Reddy."
      canonicalUrl="https://agreddy.com/404.html"
      ogType="website"
    >
      <div className="error-page-content">
        <p className="error-code" aria-hidden="true">
          404
        </p>
        <h1>This page isn't here.</h1>
        <p className="error-message">
          It may have moved, or never existed. Try one of these instead.
        </p>
        <div className="error-recovery">
          <a href="/" className="site-action-btn">
            Go home
          </a>
          <a href="/projects/" className="doc-row-btn btn-secondary">
            View projects
          </a>
          <a href="/cv/" className="doc-row-btn btn-secondary">
            CV &amp; Resume
          </a>
        </div>
      </div>
    </Layout>
  );
}
