// CV / Resume preview modal — native HTML <dialog> implementation
// Provides: showModal()/close() with built-in focus trap, Escape handling, and
// ::backdrop overlay. Adds backdrop-click dismissal (native <dialog> does not
// close on backdrop click by default — we detect clicks on the dialog element
// itself, which is the only area outside the inner .modal-window).

(function () {
  'use strict';

  // Resolve dark mode state (used for PDF iframe color-scheme)
  function isDarkMode() {
    const root = document.documentElement;
    if (root.classList.contains('theme-dark')) return true;
    if (
      root.getAttribute('data-active-theme') === 'device' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return true;
    }
    return false;
  }

  // Mobile fallback: open PDF in a new tab instead of embedding the iframe
  function getPdfUrl(id) {
    return id === 'cv-modal' ? '/files/reddy_cv.pdf' : '/files/reddy_resume.pdf';
  }

  function openModal(id) {
    if (window.innerWidth <= 768) {
      window.open(getPdfUrl(id), '_blank');
      return;
    }

    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const iframe = dialog.querySelector('iframe');
    if (iframe) {
      iframe.style.colorScheme = isDarkMode() ? 'dark' : 'light';
      if (iframe.getAttribute('src') === 'about:blank') {
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      }
    }

    if (!dialog.open) dialog.showModal();
  }

  function closeModal(id) {
    const dialog = document.getElementById(id);
    if (dialog && dialog.open) dialog.close();
  }

  // Reset iframe src when dialog finishes closing (also fires via Escape / backdrop)
  function resetIframe(dialog) {
    if (!dialog) return;
    const iframe = dialog.querySelector('iframe');
    if (iframe) iframe.setAttribute('src', 'about:blank');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 1) Open / close triggers (cards + close buttons)
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-modal][data-action]');
      if (!trigger) return;
      const id = trigger.getAttribute('data-modal');
      const action = trigger.getAttribute('data-action');
      if (action === 'open') openModal(id);
      else if (action === 'close') closeModal(id);
    });

    // 2) Per-dialog wiring: backdrop click + iframe reset on close
    document.querySelectorAll('dialog.document-modal').forEach(function (dialog) {
      // Backdrop click — native <dialog> doesn't dismiss on backdrop click,
      // so close when the click target is the dialog element itself (i.e. the
      // user clicked outside .modal-window).
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
      });

      // Native Escape closes the dialog — reset iframe when it finishes.
      dialog.addEventListener('close', function () {
        resetIframe(dialog);
      });
    });

    // 3) Spotlight cursor glow on preview cards (unrelated to modal logic)
    function setupSpotlight() {
      const cards = document.querySelectorAll('.spotlight-card');
      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      });
    }
    setupSpotlight();
  });
})();
