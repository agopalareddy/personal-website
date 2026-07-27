import { t as e } from './rolldown-runtime-Czjbc987.js';
var t = e(() => {
  document.addEventListener(`DOMContentLoaded`, () => {
    let e = document.getElementById(`projectGrid`) || document.getElementById(`experienceGrid`);
    if (!e) return;
    let t = e,
      n = document.getElementById(`filterControls`),
      r = document.getElementById(`tocContainer`),
      i = document.getElementById(`tocList`),
      a = document.getElementById(`emptyState`),
      o = n?.querySelector(`.search-input`) ?? null,
      s = n?.querySelector(`[data-role="group-filter"]`) ?? null,
      c = n?.querySelector(`[data-role="year-filter"]`) ?? null,
      l = n?.querySelector(`[data-role="sort"]`) ?? null,
      u = Array.from(n?.querySelectorAll(`.filter-btn`) ?? []),
      d = Array.from(t.querySelectorAll(`.timeline-card`));
    function f() {
      return u.find((e) => e.classList.contains(`active`))?.dataset.filter ?? `all`;
    }
    function p() {
      let e = f(),
        n = s?.value ?? `all`,
        r = c?.value ?? `all`,
        i = (o?.value ?? ``).trim().toLowerCase(),
        u = d.filter((t) => {
          let a = e === `all` || t.dataset.category === e,
            o = n === `all` || t.dataset.group === n,
            s = r === `all` || t.dataset.year === r,
            c = !i || (t.dataset.search ?? ``).includes(i);
          return a && o && s && c;
        }),
        p = l?.value ?? `date-desc`;
      if (
        (u.sort((e, t) => {
          if (p === `title-asc`)
            return (e.dataset.title ?? ``).localeCompare(t.dataset.title ?? ``);
          let n = e.dataset.date ?? ``,
            r = t.dataset.date ?? ``;
          return p === `date-asc` ? n.localeCompare(r) : r.localeCompare(n);
        }),
        t.querySelectorAll(`.timeline-year`).forEach((e) => e.remove()),
        d.forEach((e) => e.remove()),
        u.length === 0)
      ) {
        (a && (a.hidden = !1), m([]));
        return;
      }
      a && (a.hidden = !0);
      let h = document.createDocumentFragment(),
        g;
      for (let e of u) {
        if (p !== `title-asc` && e.dataset.year && e.dataset.year !== g) {
          let t = document.createElement(`h2`);
          ((t.className = `timeline-year`),
            (t.id = `year-${e.dataset.year}`),
            (t.textContent = e.dataset.year),
            h.append(t),
            (g = e.dataset.year));
        }
        h.append(e);
      }
      (t.append(h), m(u));
    }
    function m(e) {
      if (!r || !i) return;
      if (e.length <= 1) {
        ((r.hidden = !0), i.replaceChildren());
        return;
      }
      ((r.hidden = !1), _());
      let t = document.getElementById(`tocToggleBtn`);
      if (t && !t.hasAttribute(`data-initialized`)) {
        let e = window.innerWidth < 768;
        (t.setAttribute(`aria-expanded`, e ? `false` : `true`),
          t.setAttribute(`data-initialized`, `true`));
      }
      let n = l?.value ?? `date-desc`,
        a = document.createDocumentFragment();
      if (n === `title-asc`) for (let t of e) a.append(h(t));
      else {
        let t,
          n = null;
        for (let r of e) {
          let e = r.dataset.year;
          if (e && e !== t) {
            let r = document.createElement(`li`);
            r.className = `toc-item`;
            let i = document.createElement(`a`);
            ((i.href = `#year-${e}`),
              (i.className = `toc-year-header`),
              (i.textContent = e),
              (n = document.createElement(`ul`)),
              (n.className = `toc-nested-list`),
              r.append(i, n),
              a.append(r),
              (t = e));
          }
          n?.append(h(r));
        }
      }
      (i.replaceChildren(a),
        i.querySelectorAll(`a[href^="#"]`).forEach((e) => {
          e.addEventListener(`click`, (t) => {
            t.preventDefault();
            let n = e.getAttribute(`href`)?.slice(1),
              r = n ? document.getElementById(n) : null;
            if (!r) return;
            let i = window.innerWidth < 768,
              a = document.getElementById(`tocToggleBtn`);
            i &&
              a?.getAttribute(`aria-expanded`) === `true` &&
              a.setAttribute(`aria-expanded`, `false`);
            let o = i ? 120 : 90,
              s = r.getBoundingClientRect().top + window.scrollY - o;
            (window.scrollTo({ top: s, behavior: `smooth` }), history.pushState(null, ``, `#${n}`));
          });
        }));
    }
    function h(e) {
      let t = document.createElement(`li`);
      t.className = `toc-item`;
      let n = document.createElement(`a`);
      return (
        (n.href = `#${e.id}`),
        (n.className = `toc-link`),
        (n.textContent = e.dataset.title ?? ``),
        t.append(n),
        t
      );
    }
    (o?.addEventListener(`input`, p),
      s?.addEventListener(`change`, p),
      c?.addEventListener(`change`, p),
      l?.addEventListener(`change`, p),
      u.forEach((e) => {
        e.addEventListener(`click`, () => {
          (u.forEach((e) => {
            (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
          }),
            e.classList.add(`active`),
            e.setAttribute(`aria-pressed`, `true`),
            p());
        });
      }));
    function g() {
      if (!n) return;
      let e = window.innerWidth < 768,
        t = document.querySelector(`.academic-sidebar`),
        r = document.querySelector(`.academic-content > p`),
        i = document.querySelector(`.mobile-sticky-wrapper`);
      if (e && r) {
        let e = i ?? n;
        (e.parentNode !== r.parentNode || e.previousElementSibling !== r) &&
          r.parentNode?.insertBefore(e, r.nextSibling);
      } else !e && t && n.parentNode !== t && t.append(n);
    }
    function _() {
      if (!r) return;
      let e = window.innerWidth < 768,
        t = document.querySelector(`.academic-sidebar`);
      e && n
        ? (r.parentNode !== n.parentNode || r.previousElementSibling !== n) &&
          n.parentNode?.insertBefore(r, n.nextSibling)
        : !e && t && r.parentNode !== t && t.append(r);
    }
    function v() {
      let e = window.innerWidth < 768,
        t = document.querySelector(`.mobile-sticky-wrapper`);
      if (e) {
        if (!n || !r || (t?.contains(n) && t?.contains(r))) return;
        if (t) {
          let e = t.parentNode;
          for (; t.firstChild;) e?.insertBefore(t.firstChild, t);
          e?.removeChild(t);
        }
        if (n.parentNode === r.parentNode) {
          let e = document.createElement(`div`);
          ((e.className = `mobile-sticky-wrapper`),
            n.parentNode?.insertBefore(e, n),
            e.append(n, r));
        }
      } else if (t) {
        let e = t.parentNode;
        for (; t.firstChild;) e?.insertBefore(t.firstChild, t);
        e?.removeChild(t);
      }
    }
    function y() {
      (g(), _(), v());
    }
    window.matchMedia(`(max-width: 767px)`).addEventListener(`change`, y);
    let b = document.getElementById(`filterToggleBtn`);
    if (b) {
      if (!b.hasAttribute(`data-initialized`)) {
        let e = window.innerWidth < 768;
        (b.setAttribute(`aria-expanded`, e ? `false` : `true`),
          b.setAttribute(`data-initialized`, `true`));
      }
      b.addEventListener(`click`, () => {
        let e = b.getAttribute(`aria-expanded`) === `true`;
        b.setAttribute(`aria-expanded`, String(!e));
      });
    }
    let x = document.getElementById(`tocToggleBtn`);
    (x &&
      x.addEventListener(`click`, () => {
        let e = x.getAttribute(`aria-expanded`) === `true`;
        x.setAttribute(`aria-expanded`, String(!e));
      }),
      g(),
      v(),
      p());
  });
});
export default t();
