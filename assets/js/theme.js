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
    // verbose but unambiguous.
    // Icons are defined as plain data (not pre-built DOM) and built fresh
    // per slider instance — otherwise appending the same icon to two
    // sliders (header + footer) would *move* it from the first to the
    // second, leaving the first empty.
    function svg(viewBox, extraClass, children) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'slider-icon ' + extraClass);
      el.setAttribute('viewBox', viewBox);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '2');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      for (const [tag, attrs] of children) {
        const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const k in attrs) child.setAttribute(k, attrs[k]);
        el.appendChild(child);
      }
      return el;
    }

    const iconDefs = [
      [
        'light',
        'Light mode',
        'Light Theme',
        'sun-icon-svg',
        [
          ['circle', { cx: '12', cy: '12', r: '5' }],
          ['line', { x1: '12', y1: '1', x2: '12', y2: '3' }],
          ['line', { x1: '12', y1: '21', x2: '12', y2: '23' }],
          ['line', { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' }],
          ['line', { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' }],
          ['line', { x1: '1', y1: '12', x2: '3', y2: '12' }],
          ['line', { x1: '21', y1: '12', x2: '23', y2: '12' }],
          ['line', { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' }],
          ['line', { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' }],
        ],
      ],
      [
        'device',
        'System mode',
        'Follow System Theme',
        'monitor-icon-svg',
        [
          ['rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }],
          ['line', { x1: '8', y1: '21', x2: '16', y2: '21' }],
          ['line', { x1: '12', y1: '17', x2: '12', y2: '21' }],
        ],
      ],
      [
        'dark',
        'Dark mode',
        'Dark Theme',
        'moon-icon-svg',
        [['path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }]],
      ],
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

      for (const [theme, ariaLabel, title, iconClass, iconChildren] of iconDefs) {
        const btn = document.createElement('button');
        btn.className = 'theme-slider-btn';
        btn.setAttribute('data-theme', theme);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('aria-label', ariaLabel);
        btn.setAttribute('title', title);
        // Fresh icon per slider — see comment above.
        btn.appendChild(svg('0 0 24 24', iconClass, iconChildren));
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
