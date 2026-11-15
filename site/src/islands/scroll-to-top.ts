// New island (spec 002): a fixed "scroll to top" button, mounted once in
// Layout.tsx and loaded on every page via render.mjs's commonIslands.
// Plain DOM script, no React — matches email-protection.ts.
const SHOW_THRESHOLD_PX = 300;

// On phones the button sits over the text column, so it only shows while the
// reader is scrolling back up (the moment they might want the top) and gets
// out of the way while they read downward. Same breakpoint as the CSS.
const PHONE_QUERY = '(max-width: 47.99em)';
// Ignore sub-pixel jitter and rubber-band bounce when reading direction.
const DIRECTION_EPSILON_PX = 4;

function isPageScrollable(): boolean {
  const { scrollHeight, clientHeight } = document.documentElement;
  // +1 epsilon avoids a false positive from 1px rounding at the boundary.
  return scrollHeight > clientHeight + 1;
}

function initScrollToTop() {
  const button = document.getElementById('scroll-to-top');
  if (!button) return;

  const setVisible = (visible: boolean) => {
    button.classList.toggle('is-visible', visible);
    button.setAttribute('aria-hidden', String(!visible));
    button.tabIndex = visible ? 0 : -1;
  };

  const phone = window.matchMedia(PHONE_QUERY);
  let lastY = window.scrollY;
  let scrollingUp = false;

  const update = () => {
    const pastThreshold = isPageScrollable() && window.scrollY > SHOW_THRESHOLD_PX;
    setVisible(pastThreshold && (!phone.matches || scrollingUp));
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) >= DIRECTION_EPSILON_PX) {
      scrollingUp = y < lastY;
      lastY = y;
    }
    update();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Catches layout changes scroll events don't fire for (spec.md edge
  // cases): viewport resize (window 'resize' — body's own box doesn't
  // necessarily change size just because the viewport did, so this can't
  // rely on ResizeObserver alone) and async content growth changing the
  // page's own height (images/fonts loading in — ResizeObserver on body).
  window.addEventListener('resize', update);
  new ResizeObserver(update).observe(document.body);

  button.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollToTop);
} else {
  initScrollToTop();
}
