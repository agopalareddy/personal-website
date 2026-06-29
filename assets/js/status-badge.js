/**
 * status-badge.js
 *
 * Reusable "open to opportunities" (or custom) status badge for the
 * academic sidebar. Auto-mounts on every page that has
 * `<aside class="academic-sidebar">` so the sidebar stays uniform across
 * the site without duplicating markup in every HTML file.
 *
 * Customization via data attributes on the <aside>:
 *
 *   data-status-badge        Text. Default: "Open to opportunities".
 *                            Set to "off" / "false" to skip mounting.
 *   data-status-aria-label   Accessible label (for screen readers).
 *                            Default: "Currently open to opportunities".
 *   data-status-variant      "available" (default) | "busy" | "unavailable" | "custom".
 *                            Drives the color palette.
 *   data-status-pulse        "true" (default) | "false". Animated dot.
 *   data-status-icon         Optional Font Awesome class, e.g. "fas fa-briefcase".
 *
 * Programmatic API:
 *
 *   StatusBadge.mount(sidebarEl, { text, variant, pulse, icon, ariaLabel });
 *   StatusBadge.unmount(sidebarEl);
 *
 * The component is idempotent: mounting twice on the same sidebar is a
 * no-op. If a page already has a hardcoded `.status-badge`, the auto-mount
 * skips it (the existing markup wins). That keeps `index.html` working
 * with its inline badge until the HTML is updated to use the component too.
 */
(() => {
  'use strict';

  var MOUNTED = new WeakSet();

  var DEFAULTS = {
    text: 'Open to opportunities',
    ariaLabel: 'Currently open to opportunities',
    variant: 'available',
    pulse: true,
    icon: null,
  };

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function createBadge(options) {
    var badge = el('div', {
      class: 'status-badge status-badge--' + (options.variant || 'available'),
      role: 'status',
      'aria-label': options.ariaLabel,
    });

    if (options.pulse) {
      badge.appendChild(el('span', { class: 'status-dot', 'aria-hidden': 'true' }));
    }

    if (options.icon) {
      badge.appendChild(el('i', { class: options.icon, 'aria-hidden': 'true' }));
    }

    badge.appendChild(document.createTextNode(options.text || ''));
    return badge;
  }

  function readOptions(sidebar, overrides) {
    var raw = sidebar.getAttribute('data-status-badge');
    if (raw === 'off' || raw === 'false') return null;
    var data = sidebar.dataset;
    return {
      text: (overrides && overrides.text) || data.statusBadge || DEFAULTS.text,
      ariaLabel: (overrides && overrides.ariaLabel) || data.statusAriaLabel || DEFAULTS.ariaLabel,
      variant: (overrides && overrides.variant) || data.statusVariant || DEFAULTS.variant,
      pulse: overrides && 'pulse' in overrides ? overrides.pulse : data.statusPulse !== 'false',
      icon: (overrides && overrides.icon) || data.statusIcon || DEFAULTS.icon,
    };
  }

  // Insertion point: inside .author-avatar-wrapper, before .author-links.
  // The wrapper is the glassmorphic "profile" card — it owns the
  // badge's grid-area on mobile and gets display: none on non-home
  // mobile (so the badge travels with it). Falls back to appending
  // to the sidebar if the wrapper is missing. Ponytail: the bio's
  // parent is almost always the wrapper, so insert before
  // .author-links inside the wrapper — this puts the badge in the
  // wrapper's `badge` grid cell on mobile and as a flow child on
  // desktop, and hides it whenever the wrapper is hidden.
  function findInsertionPoint(sidebar) {
    var wrapper = sidebar.querySelector('.author-avatar-wrapper');
    if (wrapper) {
      var links = wrapper.querySelector('.author-links');
      if (links) return links;
    }
    return null;
  }

  function mount(sidebar, overrides) {
    if (!sidebar || MOUNTED.has(sidebar)) return null;
    if (sidebar.querySelector('.status-badge')) {
      MOUNTED.add(sidebar);
      return null;
    }
    var options = readOptions(sidebar, overrides);
    if (!options) return null;

    var badge = createBadge(options);
    var anchor = findInsertionPoint(sidebar);
    if (anchor) {
      sidebar.insertBefore(badge, anchor);
    } else {
      sidebar.appendChild(badge);
    }
    MOUNTED.add(sidebar);
    return badge;
  }

  function unmount(sidebar) {
    if (!sidebar) return;
    var existing = sidebar.querySelector('.status-badge');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    MOUNTED.delete(sidebar);
  }

  function init() {
    var sidebars = document.querySelectorAll('.academic-sidebar');
    for (var i = 0; i < sidebars.length; i++) mount(sidebars[i]);
  }

  window.StatusBadge = { mount: mount, unmount: unmount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
