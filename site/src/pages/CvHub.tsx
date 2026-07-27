import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';

/** Ported from cv/index.html. The preview dialog's interactivity is wired
 * by the cv-modal client island (assets/js/cv-modal.js's port) — this
 * component only renders the static, no-JS-safe markup. */
export function CvHubPage() {
  return (
    <Layout
      activePage="cv"
      bodyClassName="cv-page"
      title="Curriculum Vitae"
      description="Aadarsha Gopala Reddy's Curriculum Vitae. M.S. Computer Science graduate from Washington University in St. Louis. Specialized in Machine Learning, Distributed Data Systems, and Software Development."
      canonicalUrl="https://agreddy.com/cv/"
      ogType="website"
      contentAriaLabel="CV and resume downloads"
    >
      <h1 className="page-intro-title">CV &amp; Resume</h1>
      <p className="page-intro-lead">
        Download or preview a detailed academic CV and a concise industry resume.
      </p>

      <section className="document-list" aria-label="Available documents">
        <article
          className="document-row card-surface"
          data-action="open"
          data-doc-title="Curriculum Vitae"
          data-doc-src="/files/reddy_cv.pdf"
        >
          <div className="doc-icon-wrapper" aria-hidden="true">
            <Icon name="FILE_16" />
          </div>
          <div className="doc-info">
            <div className="document-row-meta">
              <span className="card-category cat-research">Academic</span>
              <span>Updated July 2026</span>
            </div>
            <h2 className="document-row-title">Curriculum Vitae</h2>
            <p className="document-row-description">
              Research, teaching, publications, awards, and full academic record.
            </p>
          </div>
          <div className="document-row-actions">
            <button
              type="button"
              className="doc-row-btn btn-primary modal-trigger"
              data-doc-title="Curriculum Vitae"
              data-doc-src="/files/reddy_cv.pdf"
              data-action="open"
              aria-haspopup="dialog"
              aria-controls="document-modal"
            >
              <Icon name="EYE_16" /> Preview
            </button>
            <a
              href="/files/reddy_cv.pdf"
              target="_blank"
              rel="noopener"
              className="doc-row-btn btn-secondary"
              aria-label="Open Curriculum Vitae PDF in a new tab"
            >
              <Icon name="LINK_EXTERNAL_16" /> Open PDF
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </article>

        <article
          className="document-row card-surface"
          data-action="open"
          data-doc-title="Resume"
          data-doc-src="/files/reddy_resume.pdf"
        >
          <div className="doc-icon-wrapper" aria-hidden="true">
            <Icon name="FILE_16" />
          </div>
          <div className="doc-info">
            <div className="document-row-meta">
              <span className="card-category cat-tools">Industry</span>
              <span>Updated July 2026</span>
            </div>
            <h2 className="document-row-title">Resume</h2>
            <p className="document-row-description">
              Software engineering, ML, data systems, leadership, and selected projects.
            </p>
          </div>
          <div className="document-row-actions">
            <button
              type="button"
              className="doc-row-btn btn-primary modal-trigger"
              data-doc-title="Resume"
              data-doc-src="/files/reddy_resume.pdf"
              data-action="open"
              aria-haspopup="dialog"
              aria-controls="document-modal"
            >
              <Icon name="EYE_16" /> Preview
            </button>
            <a
              href="/files/reddy_resume.pdf"
              target="_blank"
              rel="noopener"
              className="doc-row-btn btn-secondary"
              aria-label="Open Resume PDF in a new tab"
            >
              <Icon name="LINK_EXTERNAL_16" /> Open PDF
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </article>
      </section>

      <dialog id="document-modal" className="document-modal" aria-labelledby="document-modal-title">
        <div className="modal-window card-surface">
          <div className="modal-header">
            <div>
              <p className="section-kicker">PDF Preview</p>
              <h2 id="document-modal-title">Document preview</h2>
            </div>
            <div className="modal-actions">
              <a
                href="/files/reddy_resume.pdf"
                target="_blank"
                rel="noopener"
                className="modal-open-link"
                id="document-modal-open"
              >
                Open PDF <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button className="modal-close" data-action="close" aria-label="Close preview">
                <Icon name="X_16" />
              </button>
            </div>
          </div>
          <div className="modal-body">
            <iframe src="about:blank" title="Document PDF preview" loading="lazy" />
          </div>
        </div>
      </dialog>
    </Layout>
  );
}
