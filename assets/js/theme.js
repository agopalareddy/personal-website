/**
 * Premium 3-State Theme Slider System
 * Supporting: Light, Device (System), and Dark modes.
 */
(() => {
  const htmlEl = document.documentElement;
  const THEME_COLORS = { light: '#f7f8fa', dark: '#12141a' };

  const savedTheme = localStorage.getItem('theme') || 'device';

  function getResolvedTheme(theme) {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeColorMeta(resolved) {
    let meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = THEME_COLORS[resolved];
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-active-theme', theme);

    if (theme === 'dark') {
      htmlEl.classList.remove('theme-light');
      htmlEl.classList.add('theme-dark');
    } else if (theme === 'light') {
      htmlEl.classList.remove('theme-dark');
      htmlEl.classList.add('theme-light');
    } else {
      htmlEl.classList.remove('theme-light', 'theme-dark');
    }

    const resolved = getResolvedTheme(theme);
    htmlEl.setAttribute('data-resolved-theme', resolved);
    updateThemeColorMeta(resolved);
  }

  applyTheme(savedTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = localStorage.getItem('theme') || 'device';
    if (current === 'device') {
      applyTheme('device');
    }
  });

  function initSlider() {
    const placeholders = [
      document.getElementById('theme-toggle'),
      document.getElementById('theme-toggle-footer'),
    ].filter((el) => el !== null);

    if (placeholders.length === 0) return;

    // Build the slider DOM programmatically. Using innerHTML with a
    // static template is technically safe here, but the linter doesn't
    // know that and flags it as a potential XSS sink. createElement is
    // verbose but unambiguous. Icons use Font Awesome (already loaded
    // site-wide) rather than hand-rolled SVGs.
    const iconDefs = [
      ['light', 'Light mode', 'Light Theme', 'fa-solid fa-sun'],
      ['device', 'System mode', 'Follow System Theme', 'fa-solid fa-display'],
      ['dark', 'Dark mode', 'Dark Theme', 'fa-solid fa-moon'],
    ];

    placeholders.forEach((placeholder) => {
      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'theme-slider';
      if (placeholder.id === 'theme-toggle-footer') {
        sliderContainer.id = 'theme-toggle-footer';
      }
      sliderContainer.setAttribute('role', 'radiogroup');
      sliderContainer.setAttribute('aria-label', 'Theme selection');

      const track = document.createElement('div');
      track.className = 'theme-slider-track';

      const thumb = document.createElement('div');
      thumb.className = 'theme-slider-thumb';
      track.appendChild(thumb);

      for (const [theme, ariaLabel, title, iconClass] of iconDefs) {
        const btn = document.createElement('button');
        btn.className = 'theme-slider-btn';
        btn.setAttribute('data-theme', theme);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('aria-label', ariaLabel);
        btn.setAttribute('title', title);
        const icon = document.createElement('i');
        icon.className = 'slider-icon ' + iconClass;
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);
        track.appendChild(btn);
      }

      sliderContainer.appendChild(track);
      placeholder.parentNode.replaceChild(sliderContainer, placeholder);
    });

    function updateAllSlidersUI(activeTheme) {
      const allSliders = document.querySelectorAll('.theme-slider');
      allSliders.forEach((slider) => {
        const buttons = slider.querySelectorAll('.theme-slider-btn');
        buttons.forEach((btn) => {
          const isSelected = btn.getAttribute('data-theme') === activeTheme;
          btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
      });
    }

    const currentTheme = localStorage.getItem('theme') || 'device';
    updateAllSlidersUI(currentTheme);

    const allSliders = document.querySelectorAll('.theme-slider');
    allSliders.forEach((slider) => {
      const buttons = slider.querySelectorAll('.theme-slider-btn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const theme = btn.getAttribute('data-theme');
          if (theme === 'device') {
            localStorage.removeItem('theme');
          } else {
            localStorage.setItem('theme', theme);
          }
          applyTheme(theme);
          updateAllSlidersUI(theme);
          const labels = {
            light: 'Light theme active',
            device: 'Following system theme',
            dark: 'Dark theme active',
          };
          const announcer = document.getElementById('a11y-announcer');
          if (announcer) announcer.textContent = labels[theme] || '';
        });
      });
    });
  }

  function initYear() {
    const currentYearElements = document.querySelectorAll('.current-year');
    currentYearElements.forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // Click delegation: clicking a card body (not a button/link) follows the
  // main link. The cursor-following spotlight is handled by cursor-glow.js
  // (global tracking across all .card-surface elements).
  function initCardLinks() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.card-surface');
      if (!card) return;
      if (e.target.closest('.card-btn') || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const mainLink = card.querySelector('h3.project-title a');
      if (mainLink) {
        mainLink.click();
      }
    });
  }

  function init() {
    initSlider();
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
