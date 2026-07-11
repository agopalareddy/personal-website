/**
 * GitHub-style 6-mode theme picker.
 * Modes: auto, light, light_high_contrast, dark, dark_dimmed, dark_high_contrast.
 * Persists to localStorage key 'color-scheme'. Migrates legacy 'theme' key.
 */
(() => {
  const htmlEl = document.documentElement;

  // theme-color values per resolved mode
  const THEME_COLORS = {
    auto: null, // resolved dynamically
    light: '#ffffff',
    light_high_contrast: '#ffffff',
    dark: '#0d1117',
    dark_dimmed: '#22272e',
    dark_high_contrast: '#010409',
  };

  // Mode attribute map
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

  // Modes list for UI
  const MODES = [
    { value: 'auto', label: 'Sync with system', icon: 'device-desktop' },
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'light_high_contrast', label: 'Light high contrast', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'dark_dimmed', label: 'Dark dimmed', icon: 'moon' },
    { value: 'dark_high_contrast', label: 'Dark high contrast', icon: 'moon' },
  ];

  // --- Migration from legacy 'theme' key ---
  function migrateLegacy() {
    const legacy = localStorage.getItem('theme');
    if (legacy === null) return null;
    const map = { light: 'light', dark: 'dark', device: 'auto' };
    const migrated = map[legacy] || 'auto';
    localStorage.removeItem('theme');
    return migrated;
  }

  function getStored() {
    let stored = localStorage.getItem('color-scheme');
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
    const attrs = MODE_MAP[mode];
    for (const [attr, val] of Object.entries(attrs)) {
      htmlEl.setAttribute(attr, val);
    }
  }

  function updateMetaThemeColor(mode) {
    let color = THEME_COLORS[mode];
    if (mode === 'auto') {
      color = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0d1117' : '#ffffff';
    }
    // Remove existing dynamic meta (non-media)
    const existing = document.querySelector('meta[name="theme-color"]:not([media])');
    if (existing) existing.remove();
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  }

  function applyTheme(mode) {
    applyAttributes(mode);
    updateMetaThemeColor(mode);
  }

  // Apply on load
  const stored = getStored();
  applyTheme(stored);

  // Listen for system changes in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = localStorage.getItem('color-scheme') || 'auto';
    if (current === 'auto') {
      updateMetaThemeColor('auto');
    }
  });

  // --- Picker initialization ---
  function buildPickerMarkup() {
    const iconSvg = (name) => {
      // Inline minimal SVGs for picker trigger (16px, currentColor)
      const icons = {
        sun: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1.5Zm4.596 2.904a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 0 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.06 0ZM14.5 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 14.5 8Zm-2.904 4.596a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 0 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.06ZM8 14.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A.75.75 0 0 1 8 14.5Zm-4.596-2.904a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 0 1 1.061 1.06l-1.06 1.061a.75.75 0 0 1-1.06 0ZM1.5 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 1.5 8Zm2.904-4.596a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.06ZM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>',
        moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786ZM7.5 7a6.5 6.5 0 0 0-6.148 8.148A6.475 6.475 0 0 0 8.852 2.352 6.5 6.5 0 0 0 7.5 7Z"/></svg>',
        'device-desktop':
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 3.25A1.75 1.75 0 0 0 12.25 1.5h-8.5A1.75 1.75 0 0 0 2 3.25v5.5c0 .966.784 1.75 1.75 1.75h2.5v1.5H4a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H9.75v-1.5h2.5A1.75 1.75 0 0 0 14 8.75Zm-8.5-1a.75.75 0 0 0-.75.75v4.25h6.5V3a.75.75 0 0 0-.75-.75ZM3.5 3.25a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v1.5H3.5Z"/></svg>',
        'chevron-down':
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.78 5.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 6.28a.75.75 0 0 1 1.06-1.06L8 8.939l3.72-3.719a.75.75 0 0 1 1.06 0Z"/></svg>',
        check:
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>',
      };
      return icons[name] || '';
    };
    const currentMode = localStorage.getItem('color-scheme') || 'auto';
    const currentModeObj = MODES.find((m) => m.value === currentMode) || MODES[0];

    const options = MODES.map(
      (m) =>
        `<button class="theme-picker-option" role="menuitemradio" data-theme-value="${m.value}" aria-checked="${m.value === currentMode ? 'true' : 'false'}">${iconSvg(m.icon)}${m.label}${iconSvg('check').replace('octicon octicon', 'check-icon octicon')}</button>`
    ).join('');

    return `<details class="theme-picker"><summary>${iconSvg(currentModeObj.icon)}${iconSvg('chevron-down')}</summary><div class="theme-picker-menu" role="menu">${options}</div></details>`;
  }

  function initPickers() {
    const slots = ['#theme-toggle', '#theme-toggle-footer']
      .map((sel) => document.querySelector(sel))
      .filter(Boolean);

    if (slots.length === 0) return;

    const markup = buildPickerMarkup();
    slots.forEach((slot) => {
      // Parse static picker markup through DOMParser (safe — no user data)
      const doc = new DOMParser().parseFromString(markup, 'text/html');
      slot.replaceChildren(...doc.body.childNodes);
    });

    // Wire events
    document.addEventListener('click', (e) => {
      const option = e.target.closest('.theme-picker-option');
      if (option) {
        const mode = option.dataset.themeValue;
        localStorage.setItem('color-scheme', mode);
        applyTheme(mode);
        syncPickers(mode);
        closeAllPickers();
        announceTheme(mode);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPickers();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-picker')) {
        closeAllPickers();
      }
    });
  }

  function syncPickers(mode) {
    const currentModeObj = MODES.find((m) => m.value === mode) || MODES[0];
    const pickers = document.querySelectorAll('.theme-picker');

    pickers.forEach((picker) => {
      // Update summary icon
      const summary = picker.querySelector('summary');
      if (summary) {
        // Replace first child (mode icon) — crude but functional
        const icons = summary.querySelectorAll('svg');
        if (icons.length > 0) {
          // Keep chevron, replace mode icon
          const iconSvg = (name) => {
            const map = {
              sun: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1.5Zm4.596 2.904a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 0 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.06 0ZM14.5 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 14.5 8Zm-2.904 4.596a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 0 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.06ZM8 14.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A.75.75 0 0 1 8 14.5Zm-4.596-2.904a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 0 1 1.061 1.06l-1.06 1.061a.75.75 0 0 1-1.06 0ZM1.5 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 1.5 8Zm2.904-4.596a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.06ZM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>',
              moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786ZM7.5 7a6.5 6.5 0 0 0-6.148 8.148A6.475 6.475 0 0 0 8.852 2.352 6.5 6.5 0 0 0 7.5 7Z"/></svg>',
              'device-desktop':
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 3.25A1.75 1.75 0 0 0 12.25 1.5h-8.5A1.75 1.75 0 0 0 2 3.25v5.5c0 .966.784 1.75 1.75 1.75h2.5v1.5H4a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H9.75v-1.5h2.5A1.75 1.75 0 0 0 14 8.75Zm-8.5-1a.75.75 0 0 0-.75.75v4.25h6.5V3a.75.75 0 0 0-.75-.75ZM3.5 3.25a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v1.5H3.5Z"/></svg>',
            };
            return map[name] || '';
          };
          const parsed = new DOMParser().parseFromString(
            iconSvg(currentModeObj.icon),
            'image/svg+xml'
          );
          icons[0].replaceWith(parsed.documentElement);
        }
      }
      // Update aria-checked on options
      const options = picker.querySelectorAll('.theme-picker-option');
      options.forEach((opt) => {
        opt.setAttribute('aria-checked', opt.dataset.themeValue === mode ? 'true' : 'false');
      });
    });
  }

  function closeAllPickers() {
    document.querySelectorAll('.theme-picker[open]').forEach((d) => d.removeAttribute('open'));
  }

  function announceTheme(mode) {
    const labels = {
      auto: 'Following system theme',
      light: 'Light theme active',
      light_high_contrast: 'Light high contrast theme active',
      dark: 'Dark theme active',
      dark_dimmed: 'Dark dimmed theme active',
      dark_high_contrast: 'Dark high contrast theme active',
    };
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) announcer.textContent = labels[mode] || '';
  }

  // --- Preserved behaviors from old theme.js ---
  function initYear() {
    document.querySelectorAll('.current-year').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initCardLinks() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.card-surface');
      if (!card) return;
      if (e.target.closest('.card-btn') || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const mainLink = card.querySelector(
        'h3.project-title a, .project-title a, .experience-title a'
      );
      if (mainLink) {
        mainLink.click();
      }
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
