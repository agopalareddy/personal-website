// Ported from assets/js/cv-modal.js. Plain DOM script (native <dialog>
// imperative API, not React state) — only loaded on the CV page.
//
// Renders via pdf.js onto <canvas> instead of an <iframe src="...pdf">.
// Firefox (and Chrome, if the user has "Download PDFs" enabled) treats a
// same-origin PDF navigation inside an iframe as a download rather than an
// inline view — a browser-level MIME handler preference no response header
// can override. Fetching the bytes ourselves and drawing them sidesteps
// that entirely: there's no PDF navigation for the browser to intercept.
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ALLOWED_DOC_SRCS: Record<string, string> = {
  '/files/reddy_cv.pdf': '/files/reddy_cv.pdf',
  '/files/reddy_resume.pdf': '/files/reddy_resume.pdf',
};

let renderToken = 0;

async function renderPdf(viewer: HTMLElement, src: string) {
  const token = ++renderToken;
  viewer.replaceChildren();
  viewer.classList.add('pdf-loading');

  try {
    const pdf = await pdfjsLib.getDocument({ url: src }).promise;
    if (token !== renderToken) return;
    viewer.classList.remove('pdf-loading');

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      if (token !== renderToken) return;

      const unscaled = page.getViewport({ scale: 1 });
      const targetWidth = Math.max(viewer.clientWidth - 32, 320);
      const viewport = page.getViewport({ scale: targetWidth / unscaled.width });

      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-page';
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      if (token !== renderToken) return;
      viewer.appendChild(canvas);
    }
  } catch {
    if (token !== renderToken) return;
    viewer.classList.remove('pdf-loading');
    const fallback = document.createElement('a');
    fallback.href = src;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.className = 'pdf-error-fallback';
    fallback.textContent = 'Preview failed to load — open the PDF in a new tab instead.';
    viewer.appendChild(fallback);
  }
}

function openDocument(dialog: HTMLDialogElement, trigger: HTMLElement) {
  const title = trigger.getAttribute('data-doc-title') || 'Document preview';
  const src = trigger.getAttribute('data-doc-src');
  const resolved = src && ALLOWED_DOC_SRCS[src];
  if (!resolved) return;

  if (window.innerWidth <= 640 || typeof dialog.showModal !== 'function') {
    const a = document.createElement('a');
    a.href = resolved;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
    return;
  }

  const heading = dialog.querySelector('#document-modal-title');
  const viewer = dialog.querySelector<HTMLElement>('#document-modal-viewer');
  const openLink = dialog.querySelector<HTMLAnchorElement>('#document-modal-open');

  if (heading) heading.textContent = title;
  if (openLink) {
    openLink.href = src!;
    openLink.setAttribute('aria-label', `Open ${title} PDF in a new tab`);
  }

  if (!dialog.open) dialog.showModal();
  if (viewer) {
    viewer.setAttribute('aria-label', `${title} PDF preview`);
    renderPdf(viewer, src!);
  }
}

function closeDocument(dialog: HTMLDialogElement) {
  if (dialog.open) dialog.close();
}

function resetViewer(dialog: HTMLDialogElement) {
  renderToken++;
  const viewer = dialog.querySelector<HTMLElement>('#document-modal-viewer');
  if (viewer) viewer.replaceChildren();
}

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('document-modal') as HTMLDialogElement | null;
  if (!dialog) return;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('a')) return;

    const trigger = target.closest<HTMLElement>('[data-action]');
    if (!trigger) return;

    const action = trigger.getAttribute('data-action');
    if (action === 'open') openDocument(dialog, trigger);
    if (action === 'close') closeDocument(dialog);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    resetViewer(dialog);
  });
});
