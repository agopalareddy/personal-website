/**
 * GitHub-style 6-mode theme picker.
 * Modes: auto, light, light_high_contrast, dark, dark_dimmed, dark_high_contrast.
 * Persists to localStorage key 'color-scheme'. Migrates legacy 'theme' key.
 *
 * Desktop: picker in header (#theme-toggle). Footer picker hidden.
 * Mobile:  picker in footer (#theme-toggle-footer). Header picker hidden.
 */
(() => {
  const htmlEl = document.documentElement;

  const THEME_COLORS = {
    auto: null,
    light: '#ffffff',
    light_high_contrast: '#ffffff',
    dark: '#0d1117',
    dark_dimmed: '#22272e',
    dark_high_contrast: '#010409',
  };

  const MODE_MAP = {
    auto: { 'data-color-mode': 'auto', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
    light: { 'data-color-mode': 'light', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
    light_high_contrast: {
      'data-color-mode': 'light',
      'data-light-theme': 'light_high_contrast',
      'data-dark-theme': 'dark',
    },
    dark: { 'data-color-mode': 'dark', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
    dark_dimmed: {
      'data-color-mode': 'dark',
      'data-light-theme': 'light',
      'data-dark-theme': 'dark_dimmed',
    },
    dark_high_contrast: {
      'data-color-mode': 'dark',
      'data-light-theme': 'light',
      'data-dark-theme': 'dark_high_contrast',
    },
  };

  const MODES = [
    { value: 'auto', label: 'Sync with system' },
    { value: 'light', label: 'Light' },
    { value: 'light_high_contrast', label: 'Light high contrast' },
    { value: 'dark', label: 'Dark' },
    { value: 'dark_dimmed', label: 'Dark dimmed' },
    { value: 'dark_high_contrast', label: 'Dark high contrast' },
  ];

  // --- SVG helpers ---
  function makeSvg(pathD, size) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 ' +
      size +
      ' ' +
      size +
      '" fill="currentColor"><path d="' +
      pathD +
      '"/></svg>'
    );
  }

  // Vendored @primer/octicons paths (from scripts/icons.py ICONS dict).
  // Use these instead of hand-drawn SVGs to ensure visual consistency
  // across the site. Source: node_modules/@primer/octicons/build/data.json
  // via scripts/vendor-primer.mjs.
  var sunPath =
    'M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z';
  var sunIcon = makeSvg(sunPath, 16);

  var moonPath =
    'M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z';
  var moonIcon = makeSvg(moonPath, 16);

  var desktopPath =
    'M14.25 1c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 14.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.752.752 0 0 1 11.25 16h-6.5a.75.75 0 0 1-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 0 1 0 10.25v-7.5C0 1.784.784 1 1.75 1ZM1.75 2.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25ZM9.018 12H6.982a5.72 5.72 0 0 1-.765 2.5h3.566a5.72 5.72 0 0 1-.765-2.5Z';
  var desktopIcon = makeSvg(desktopPath, 16);

  var checkPath =
    'M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z';
  var checkIcon = makeSvg(checkPath, 16);

  var chevronPath =
    'M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z';
  var chevronIcon = makeSvg(chevronPath, 16);

  function modeIcon(mode) {
    if (mode === 'light' || mode === 'light_high_contrast') return sunIcon;
    if (mode === 'dark' || mode === 'dark_dimmed' || mode === 'dark_high_contrast') return moonIcon;
    return desktopIcon;
  }

  // --- Migration from legacy 'theme' key ---
  function migrateLegacy() {
    var legacy = localStorage.getItem('theme');
    if (legacy === null) return null;
    var map = { light: 'light', dark: 'dark', device: 'auto' };
    var migrated = map[legacy] || 'auto';
    localStorage.removeItem('theme');
    return migrated;
  }

  function getStored() {
    var stored = localStorage.getItem('color-scheme');
    if (stored === null) {
      stored = migrateLegacy();
      if (stored) {
        localStorage.setItem('color-scheme', stored);
        return stored;
      }
      return 'auto';
    }
    return stored;
  }

  function applyAttributes(mode) {
    var attrs = MODE_MAP[mode];
    for (var attr in attrs) {
      htmlEl.setAttribute(attr, attrs[attr]);
    }
  }

  function updateMetaThemeColor(mode) {
    var color = THEME_COLORS[mode];
    if (mode === 'auto') {
      color = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0d1117' : '#ffffff';
    }
    var existing = document.querySelector('meta[name="theme-color"]:not([media])');
    if (existing) existing.remove();
    var meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  }

  function applyTheme(mode) {
    applyAttributes(mode);
    updateMetaThemeColor(mode);
  }

  // Apply on load
  var stored = getStored();
  applyTheme(stored);

  // Listen for system changes in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    var current = localStorage.getItem('color-scheme') || 'auto';
    if (current === 'auto') {
      updateMetaThemeColor('auto');
    }
  });

  // --- Build picker DOM (no innerHTML) ---
  function buildPickerDOM() {
    var currentMode = localStorage.getItem('color-scheme') || 'auto';
    var currentObj = MODES.find((m) => m.value === currentMode) || MODES[0];

    // Create <details>
    var details = document.createElement('details');
    details.className = 'theme-picker';

    // Summary: mode icon + "Theme" label + chevron
    var summary = document.createElement('summary');
    summary.setAttribute('aria-label', 'Theme: ' + currentObj.label);
    // Mode icon
    var sIconDoc = new DOMParser().parseFromString(modeIcon(currentMode), 'text/html');
    if (sIconDoc.body && sIconDoc.body.firstChild) summary.appendChild(sIconDoc.body.firstChild);
    // "Theme" label
    var labelSpan = document.createElement('span');
    labelSpan.textContent = 'Theme';
    summary.appendChild(labelSpan);
    // Chevron
    var chDoc = new DOMParser().parseFromString(chevronIcon, 'text/html');
    if (chDoc.body && chDoc.body.firstChild) summary.appendChild(chDoc.body.firstChild);
    details.appendChild(summary);

    // Menu
    var menu = document.createElement('div');
    menu.className = 'theme-picker-menu';
    menu.setAttribute('role', 'menu');

    MODES.forEach((m) => {
      var btn = document.createElement('button');
      btn.className = 'theme-picker-option';
      btn.setAttribute('role', 'menuitemradio');
      btn.setAttribute('data-theme-value', m.value);
      btn.setAttribute('aria-checked', m.value === currentMode ? 'true' : 'false');

      // Mode icon
      var mi = document.createElement('span');
      mi.className = 'theme-picker-option-icon';
      var miDoc = new DOMParser().parseFromString(modeIcon(m.value), 'image/svg+xml');
      if (miDoc.documentElement) mi.appendChild(miDoc.documentElement);
      btn.appendChild(mi);

      // Label
      var label = document.createElement('span');
      label.textContent = m.label;
      btn.appendChild(label);

      // Check mark (always present, visibility controlled by CSS aria-checked)
      var ck = document.createElement('span');
      ck.className = 'theme-picker-option-check';
      var ckDoc = new DOMParser().parseFromString(checkIcon, 'image/svg+xml');
      if (ckDoc.documentElement) ck.appendChild(ckDoc.documentElement);
      btn.appendChild(ck);

      menu.appendChild(btn);
    });

    details.appendChild(menu);
    return details;
  }

  function syncPickers(mode) {
    var currentObj = MODES.find((m) => m.value === mode) || MODES[0];
    var pickers = document.querySelectorAll('.theme-picker');

    pickers.forEach((picker) => {
      // Update summary
      var summary = picker.querySelector('summary');
      if (summary) {
        summary.setAttribute('aria-label', 'Theme: ' + currentObj.label);
        var icons = summary.querySelectorAll('svg');
        if (icons.length > 0) {
          var newDoc = new DOMParser().parseFromString(modeIcon(mode), 'image/svg+xml');
          if (newDoc.documentElement) icons[0].replaceWith(newDoc.documentElement);
        }
      }
      // Update aria-checked on options
      var options = picker.querySelectorAll('.theme-picker-option');
      options.forEach((opt) => {
        opt.setAttribute('aria-checked', opt.dataset.themeValue === mode ? 'true' : 'false');
      });
    });
  }

  function closeAllPickers() {
    document.querySelectorAll('.theme-picker[open]').forEach((d) => {
      d.removeAttribute('open');
    });
  }

  function announceTheme(mode) {
    var labels = {
      auto: 'Following system theme',
      light: 'Light theme active',
      light_high_contrast: 'Light high contrast theme active',
      dark: 'Dark theme active',
      dark_dimmed: 'Dark dimmed theme active',
      dark_high_contrast: 'Dark high contrast theme active',
    };
    var announcer = document.getElementById('a11y-announcer');
    if (announcer) announcer.textContent = labels[mode] || '';
  }

  // --- Initialize ---
  function initPickers() {
    var headerSlot = document.getElementById('theme-toggle');
    var footerSlot = document.getElementById('theme-toggle-footer');

    if (!headerSlot && !footerSlot) return;

    if (headerSlot) {
      var picker = buildPickerDOM();
      headerSlot.appendChild(picker);
    }
    if (footerSlot) {
      var picker2 = buildPickerDOM();
      footerSlot.appendChild(picker2);
    }

    // Click handler for option selection
    document.addEventListener('click', (e) => {
      var option = e.target.closest('.theme-picker-option');
      if (option) {
        var mode = option.dataset.themeValue;
        localStorage.setItem('color-scheme', mode);
        applyTheme(mode);
        syncPickers(mode);
        closeAllPickers();
        announceTheme(mode);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllPickers();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-picker')) closeAllPickers();
    });
  }

  // --- Preserved behaviors ---
  function initYear() {
    document.querySelectorAll('.current-year').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initCardLinks() {
    document.addEventListener('click', (e) => {
      var card = e.target.closest('.card-surface');
      if (!card) return;
      if (e.target.closest('.card-btn') || e.target.closest('a') || e.target.closest('button'))
        return;
      var mainLink = card.querySelector(
        'h3.project-title a, .project-title a, .experience-title a'
      );
      if (mainLink) mainLink.click();
    });
  }

  function init() {
    initPickers();
    initYear();
    initCardLinks();
    document.body.classList.add('page-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('pageshow', () => {
    document.body.classList.add('page-loaded');
  });
})();
