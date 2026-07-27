import { t as e } from './rolldown-runtime-Czjbc987.js';
var t = e(() => {
  function e() {
    let e = document.documentElement;
    return e.classList.contains(`theme-dark`) || e.getAttribute(`data-resolved-theme`) === `dark`
      ? !0
      : e.getAttribute(`data-active-theme`) === `device` &&
          window.matchMedia(`(prefers-color-scheme: dark)`).matches;
  }
  var t = {
    '/files/reddy_cv.pdf': `/files/reddy_cv.pdf`,
    '/files/reddy_resume.pdf': `/files/reddy_resume.pdf`,
  };
  function n(n, r) {
    let i = r.getAttribute(`data-doc-title`) || `Document preview`,
      a = r.getAttribute(`data-doc-src`),
      o = a && t[a];
    if (!o) return;
    if (window.innerWidth <= 640 || typeof n.showModal != `function`) {
      let e = document.createElement(`a`);
      ((e.href = o), (e.target = `_blank`), (e.rel = `noopener`), e.click());
      return;
    }
    let s = n.querySelector(`#document-modal-title`),
      c = n.querySelector(`iframe`),
      l = n.querySelector(`#document-modal-open`);
    (s && (s.textContent = i),
      l && ((l.href = a), l.setAttribute(`aria-label`, `Open ${i} PDF in a new tab`)),
      c &&
        ((c.title = `${i} PDF preview`),
        (c.style.colorScheme = e() ? `dark` : `light`),
        (c.src = a)),
      n.open || n.showModal());
  }
  function r(e) {
    e.open && e.close();
  }
  function i(e) {
    let t = e.querySelector(`iframe`);
    t && (t.src = `about:blank`);
  }
  document.addEventListener(`DOMContentLoaded`, () => {
    let e = document.getElementById(`document-modal`);
    e &&
      (document.addEventListener(`click`, (t) => {
        let i = t.target;
        if (i.closest(`a`)) return;
        let a = i.closest(`[data-action]`);
        if (!a) return;
        let o = a.getAttribute(`data-action`);
        (o === `open` && n(e, a), o === `close` && r(e));
      }),
      e.addEventListener(`click`, (t) => {
        t.target === e && e.close();
      }),
      e.addEventListener(`close`, () => {
        i(e);
      }));
  });
});
export default t();
