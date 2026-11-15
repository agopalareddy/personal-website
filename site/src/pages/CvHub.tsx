import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import type { DocumentEntry } from '../content/loadDocuments';

/** Ported from cv/index.html. The preview dialog's interactivity is wired
 * by the cv-modal client island (assets/js/cv-modal.js's port) — this
 * component only renders the static, no-JS-safe markup. */
export function CvHubPage({ documents }: { documents: DocumentEntry[] }) {
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

      {/* Same .catalog-row rows as the Experience and Projects lists, with no
          CSS of their own. The title link is
          stretched over the row; cv-modal.ts turns its click into the preview
          dialog on wide screens. Without JavaScript, and on phones, it is a
          plain link to the PDF. */}
      <section className="document-list" aria-label="Available documents">
        {documents.map((doc) => (
          <article className="catalog-row document-row" key={doc.src}>
            <h2 className="project-title">
              <a
                href={doc.src}
                className="modal-trigger"
                data-action="open"
                data-doc-title={doc.title}
                data-doc-src={doc.src}
                aria-haspopup="dialog"
                aria-controls="document-modal"
              >
                {doc.title}
              </a>
            </h2>
            <span className={`card-category ${doc.categoryClass}`}>{doc.category}</span>
            <span className="card-venue">
              Updated <time dateTime={doc.updatedIso}>{doc.updatedLabel}</time>
            </span>
            <p className="project-excerpt">{doc.description}</p>
            <div className="card-actions">
              <span className="row-tech">PDF</span>
              <a
                href={doc.src}
                target="_blank"
                rel="noopener"
                className="row-link"
                aria-label={`Open ${doc.title} PDF in a new tab`}
              >
                <Icon name="LINK_EXTERNAL_16" /> Open in new tab
              </a>
              <a
                href={doc.src}
                download
                className="row-link"
                aria-label={`Download ${doc.title} PDF`}
              >
                <Icon name="DOWNLOAD_16" /> Download
              </a>
            </div>
          </article>
        ))}
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
            <div
              id="document-modal-viewer"
              className="pdf-viewer"
              role="group"
              aria-label="Document preview"
            />
          </div>
        </div>
      </dialog>
    </Layout>
  );
}
