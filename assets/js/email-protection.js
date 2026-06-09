/**
 * Email Protection — Obfuscates email addresses from scrapers.
 * Replaces placeholder elements with clickable mailto: links using
 * base64-decoded email parts stored in data attributes.
 *
 * Bots don't execute JS — your email is invisible in raw HTML source.
 */
(function () {
  'use strict';

  function decodeEmail() {
    const elements = document.querySelectorAll('[data-email-user][data-email-domain]');

    elements.forEach(function (el) {
      const user = atob(el.getAttribute('data-email-user'));
      const domain = atob(el.getAttribute('data-email-domain'));
      const email = user + '@' + domain;

      el.setAttribute('href', 'mailto:' + email);

      const displayText = el.getAttribute('data-email-text');
      if (displayText) {
        // Replace with obfuscated display text (top contact section pattern)
        el.textContent = displayText;
      }
      // Otherwise leave existing content alone — footer icons, inline
      // "reach out" text, etc. — never inject raw email as visible text.

      el.removeAttribute('data-email-user');
      el.removeAttribute('data-email-domain');
      el.removeAttribute('data-email-text');
      el.classList.add('email-decoded');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decodeEmail);
  } else {
    decodeEmail();
  }
})();
