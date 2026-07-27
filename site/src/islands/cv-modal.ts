// Ported from assets/js/cv-modal.js. Plain DOM script (native <dialog>
// imperative API, not React state) — only loaded on the CV page.
function isDarkMode(): boolean {
  const root = document.documentElement;
  if (root.classList.contains("theme-dark")) return true;
  if (root.getAttribute("data-resolved-theme") === "dark") return true;
  return (
    root.getAttribute("data-active-theme") === "device" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

const ALLOWED_DOC_SRCS: Record<string, string> = {
  "/files/reddy_cv.pdf": "/files/reddy_cv.pdf",
  "/files/reddy_resume.pdf": "/files/reddy_resume.pdf",
};

function openDocument(dialog: HTMLDialogElement, trigger: HTMLElement) {
  const title = trigger.getAttribute("data-doc-title") || "Document preview";
  const src = trigger.getAttribute("data-doc-src");
  const resolved = src && ALLOWED_DOC_SRCS[src];
  if (!resolved) return;

  if (window.innerWidth <= 640 || typeof dialog.showModal !== "function") {
    const a = document.createElement("a");
    a.href = resolved;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
    return;
  }

  const heading = dialog.querySelector("#document-modal-title");
  const iframe = dialog.querySelector<HTMLIFrameElement>("iframe");
  const openLink = dialog.querySelector<HTMLAnchorElement>("#document-modal-open");

  if (heading) heading.textContent = title;
  if (openLink) {
    openLink.href = src!;
    openLink.setAttribute("aria-label", `Open ${title} PDF in a new tab`);
  }
  if (iframe) {
    iframe.title = `${title} PDF preview`;
    iframe.style.colorScheme = isDarkMode() ? "dark" : "light";
    iframe.src = src!;
  }

  if (!dialog.open) dialog.showModal();
}

function closeDocument(dialog: HTMLDialogElement) {
  if (dialog.open) dialog.close();
}

function resetIframe(dialog: HTMLDialogElement) {
  const iframe = dialog.querySelector<HTMLIFrameElement>("iframe");
  if (iframe) iframe.src = "about:blank";
}

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("document-modal") as HTMLDialogElement | null;
  if (!dialog) return;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) return;

    const trigger = target.closest<HTMLElement>("[data-action]");
    if (!trigger) return;

    const action = trigger.getAttribute("data-action");
    if (action === "open") openDocument(dialog, trigger);
    if (action === "close") closeDocument(dialog);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    resetIframe(dialog);
  });
});
