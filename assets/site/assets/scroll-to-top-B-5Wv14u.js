import { t as e } from './rolldown-runtime-Czjbc987.js';
var t = e(() => {
  function e() {
    let { scrollHeight: e, clientHeight: t } = document.documentElement;
    return e > t + 1;
  }
  function t() {
    let t = document.getElementById(`scroll-to-top`);
    if (!t) return;
    let n = (e) => {
        (t.classList.toggle(`is-visible`, e),
          t.setAttribute(`aria-hidden`, String(!e)),
          (t.tabIndex = e ? 0 : -1));
      },
      r = () => {
        n(e() && window.scrollY > 300);
      };
    (window.addEventListener(`scroll`, r, { passive: !0 }),
      window.addEventListener(`resize`, r),
      new ResizeObserver(r).observe(document.body),
      t.addEventListener(`click`, () => {
        let e = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        window.scrollTo({ top: 0, behavior: e ? `auto` : `smooth` });
      }),
      r());
  }
  document.readyState === `loading` ? document.addEventListener(`DOMContentLoaded`, t) : t();
});
export default t();
