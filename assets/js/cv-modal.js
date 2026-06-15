// CV / Resume PDF preview modal.
(function () {
  'use strict';

  function isDarkMode() {
    const root = document.documentElement;
    if (root.classList.contains('theme-dark')) return true;
    if (root.getAttribute('data-resolved-theme') === 'dark') return true;
    return (
      root.getAttribute('data-active-theme') === 'device' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  function openDocument(dialog, trigger) {
    const title = trigger.getAttribute('data-doc-title') || 'Document preview';
    const src = trigger.getAttribute('data-doc-src');
    if (!src) return;

    if (window.innerWidth <= 640 || typeof dialog.showModal !== 'function') {
      window.open(src, '_blank', 'noopener');
      return;
    }

    const heading = dialog.querySelector('#document-modal-title');
    const iframe = dialog.querySelector('iframe');
    const openLink = dialog.querySelector('#document-modal-open');

    if (heading) heading.textContent = title;
    if (openLink) {
      openLink.href = src;
      openLink.setAttribute('aria-label', `Open ${title} PDF in a new tab`);
    }
    if (iframe) {
      iframe.title = `${title} PDF preview`;
      iframe.style.colorScheme = isDarkMode() ? 'dark' : 'light';
      iframe.src = src;
    }

    if (!dialog.open) dialog.showModal();
  }

  function closeDocument(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function resetIframe(dialog) {
    const iframe = dialog.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
  }

  document.addEventListener('DOMContentLoaded', function () {
    const dialog = document.getElementById('document-modal');
    if (!dialog) return;

    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('[data-action]');
      if (!trigger) return;

      const action = trigger.getAttribute('data-action');
      if (action === 'open') openDocument(dialog, trigger);
      if (action === 'close') closeDocument(dialog);
    });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function () {
      resetIframe(dialog);
    });
  });
})();
