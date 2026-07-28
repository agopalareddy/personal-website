import { Layout } from 'personal-website';

// No Theme wrapper needed here (unlike the other previews) — Layout's own
// root <html> element already carries data-color-mode/data-light-theme/
// data-dark-theme (see site/src/components/chrome/Layout.tsx), so it applies
// Primer's color tokens itself. Wrapping it in an extra attribute div nests
// a second <html> and collapses the card to 0 height — confirmed via
// .render-check.json (maxHeight: 0) before this was found.
export function Default() {
  return (
    <Layout
      activePage="home"
      title="Aadarsha Gopala Reddy"
      description="Personal site of Aadarsha Gopala Reddy — M.S. Computer Science, Washington University in St. Louis."
      canonicalUrl="https://agreddy.com/"
    >
      <h1 className="page-intro-title">Aadarsha Gopala Reddy</h1>
      <p className="page-intro-lead">
        M.S. Computer Science graduate from Washington University in St. Louis, focused on
        applied ML research and systems engineering.
      </p>
    </Layout>
  );
}

export function HideSidebar() {
  return (
    <Layout
      title="Page Not Found"
      description="404 — the page you're looking for doesn't exist."
      canonicalUrl="https://agreddy.com/404.html"
      hideSidebar
    >
      <h1 className="page-intro-title">404 — Page Not Found</h1>
      <p className="page-intro-lead">The page you're looking for doesn't exist.</p>
    </Layout>
  );
}
