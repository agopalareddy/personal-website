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
  // Fetch SVGs from globally defined OCTICONS object (loaded via assets/js/icons.js)
  // to avoid hand-typing or duplication.
  var sunIcon = typeof OCTICONS !== 'undefined' ? OCTICONS['SUN_16'] : '';
  var moonIcon = typeof OCTICONS !== 'undefined' ? OCTICONS['MOON_16'] : '';
  var desktopIcon = typeof OCTICONS !== 'undefined' ? OCTICONS['DEVICE_DESKTOP_16'] : '';
  var checkIcon = typeof OCTICONS !== 'undefined' ? OCTICONS['CHECK_16'] : '';
  var chevronIcon = typeof OCTICONS !== 'undefined' ? OCTICONS['CHEVRON_DOWN_16'] : '';

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

    var newDoc = new DOMParser().parseFromString(modeIcon(mode), 'image/svg+xml');
    var iconTemplate = newDoc.documentElement;

    pickers.forEach((picker) => {
      // Update summary
      var summary = picker.querySelector('summary');
      if (summary) {
        summary.setAttribute('aria-label', 'Theme: ' + currentObj.label);
        var icons = summary.querySelectorAll('svg');
        if (icons.length > 0 && iconTemplate) {
          icons[0].replaceWith(iconTemplate.cloneNode(true));
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

  function initHomeSkillToggle() {
    var toggle = document.querySelector('.home-skill-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
      });
    }
  }

  function init() {
    initPickers();
    initYear();
    initCardLinks();
    initHomeSkillToggle();
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
