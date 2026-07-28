// New island (spec 002): a fixed "scroll to top" button, mounted once in
// Layout.tsx and loaded on every page via render.mjs's commonIslands.
// Plain DOM script, no React — matches email-protection.ts/toggle.ts.
const SHOW_THRESHOLD_PX = 300;

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

  const update = () => {
    setVisible(isPageScrollable() && window.scrollY > SHOW_THRESHOLD_PX);
  };

  window.addEventListener('scroll', update, { passive: true });

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
