import { t as e } from './rolldown-runtime-Czjbc987.js';
import { n as t, t as n } from './toggle-Bl4j4AUN.js';
var r = e(() => {
  (t(),
    document.addEventListener(`DOMContentLoaded`, () => {
      let e = document.getElementById(`projectGrid`) || document.getElementById(`experienceGrid`);
      if (!e) return;
      let t = e,
        r = document.getElementById(`filterControls`),
        i = document.getElementById(`tocContainer`),
        a = document.getElementById(`tocList`),
        o = document.getElementById(`emptyState`),
        s = document.getElementById(`resultsCount`),
        c = document.getElementById(`clearFiltersBtn`),
        l = r?.querySelector(`.search-input`) ?? null,
        u = r?.querySelector(`[data-role="group-filter"]`) ?? null,
        d = r?.querySelector(`[data-role="year-filter"]`) ?? null,
        f = r?.querySelector(`[data-role="sort"]`) ?? null,
        p = Array.from(r?.querySelectorAll(`.filter-btn`) ?? []),
        m = t.id === `experienceGrid` ? `entry` : `project`,
        h = t.id === `experienceGrid` ? `entries` : `projects`,
        g = Array.from(t.querySelectorAll(`.timeline-card`));
      function _() {
        return p.find((e) => e.classList.contains(`active`))?.dataset.filter ?? `all`;
      }
      function v() {
        let e = _(),
          n = u?.value ?? `all`,
          r = d?.value ?? `all`,
          i = (l?.value ?? ``).trim().toLowerCase(),
          a = g.filter((t) => {
            let a = e === `all` || t.dataset.category === e,
              o = n === `all` || t.dataset.group === n,
              s = r === `all` || t.dataset.year === r,
              c = !i || (t.dataset.search ?? ``).includes(i);
            return a && o && s && c;
          }),
          c = f?.value ?? `date-desc`;
        if (
          (a.sort((e, t) => {
            if (c === `title-asc`)
              return (e.dataset.title ?? ``).localeCompare(t.dataset.title ?? ``);
            let n = e.dataset.date ?? ``,
              r = t.dataset.date ?? ``;
            return c === `date-asc` ? n.localeCompare(r) : r.localeCompare(n);
          }),
          t.querySelectorAll(`.timeline-year`).forEach((e) => e.remove()),
          g.forEach((e) => e.remove()),
          a.length === 0)
        ) {
          (o && (o.hidden = !1), s && (s.textContent = `Showing 0 ${h}.`), y([]));
          return;
        }
        o && (o.hidden = !0);
        let p = document.createDocumentFragment(),
          v;
        for (let e of a) {
          if (c !== `title-asc` && e.dataset.year && e.dataset.year !== v) {
            let t = document.createElement(`h2`);
            ((t.className = `timeline-year`),
              (t.id = `year-${e.dataset.year}`),
              (t.textContent = e.dataset.year),
              p.append(t),
              (v = e.dataset.year));
          }
          p.append(e);
        }
        (t.append(p),
          s && (s.textContent = `Showing ${a.length} ${a.length === 1 ? m : h}.`),
          y(a));
      }
      function y(e) {
        if (!i || !a) return;
        if (e.length <= 1) {
          ((i.hidden = !0), a.replaceChildren());
          return;
        }
        ((i.hidden = !1), w());
        let t = document.getElementById(`tocToggleBtn`);
        if (t && !t.hasAttribute(`data-initialized`)) {
          let e = window.innerWidth < 768;
          (t.setAttribute(`aria-expanded`, e ? `false` : `true`),
            t.setAttribute(`data-initialized`, `true`));
        }
        let n = f?.value ?? `date-desc`,
          r = document.createDocumentFragment();
        if (n === `title-asc`) for (let t of e) r.append(b(t));
        else {
          let t,
            n = null;
          for (let i of e) {
            let e = i.dataset.year;
            if (e && e !== t) {
              let i = document.createElement(`li`);
              i.className = `toc-item`;
              let a = document.createElement(`a`);
              ((a.href = `#year-${e}`),
                (a.className = `toc-year-header`),
                (a.textContent = e),
                (n = document.createElement(`ul`)),
                (n.className = `toc-nested-list`),
                i.append(a, n),
                r.append(i),
                (t = e));
            }
            n?.append(b(i));
          }
        }
        (a.replaceChildren(r),
          a.querySelectorAll(`a[href^="#"]`).forEach((e) => {
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
              (window.scrollTo({ top: s, behavior: `smooth` }),
                history.pushState(null, ``, `#${n}`));
            });
          }));
      }
      function b(e) {
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
      function x() {
        let e = new URLSearchParams(),
          t = _();
        (t !== `all` && e.set(`category`, t),
          u && u.value !== `all` && e.set(`group`, u.value),
          d && d.value !== `all` && e.set(`year`, d.value),
          f && f.value !== `date-desc` && e.set(`sort`, f.value),
          l?.value && e.set(`q`, l.value));
        let n = e.toString();
        history.replaceState(
          null,
          ``,
          n ? `?${n}${location.hash}` : location.pathname + location.hash
        );
      }
      function S() {
        (p.forEach((e) => {
          let t = e.dataset.filter === `all`;
          (e.classList.toggle(`active`, t), e.setAttribute(`aria-pressed`, String(t)));
        }),
          u && (u.value = `all`),
          d && (d.value = `all`),
          f && (f.value = `date-desc`),
          l && (l.value = ``),
          x(),
          v());
      }
      (l?.addEventListener(`input`, () => {
        (x(), v());
      }),
        u?.addEventListener(`change`, () => {
          (x(), v());
        }),
        d?.addEventListener(`change`, () => {
          (x(), v());
        }),
        f?.addEventListener(`change`, () => {
          (x(), v());
        }),
        p.forEach((e) => {
          e.addEventListener(`click`, () => {
            (p.forEach((e) => {
              (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
            }),
              e.classList.add(`active`),
              e.setAttribute(`aria-pressed`, `true`),
              x(),
              v());
          });
        }),
        c?.addEventListener(`click`, S));
      function C() {
        if (!r) return;
        let e = window.innerWidth < 768,
          t = document.querySelector(`.academic-sidebar`),
          n = document.querySelector(`.academic-content > p`),
          i = document.querySelector(`.mobile-sticky-wrapper`);
        if (e && n) {
          let e = i ?? r;
          (e.parentNode !== n.parentNode || e.previousElementSibling !== n) &&
            n.parentNode?.insertBefore(e, n.nextSibling);
        } else !e && t && r.parentNode !== t && t.append(r);
      }
      function w() {
        if (!i) return;
        let e = window.innerWidth < 768,
          t = document.querySelector(`.academic-sidebar`);
        e && r
          ? (i.parentNode !== r.parentNode || i.previousElementSibling !== r) &&
            r.parentNode?.insertBefore(i, r.nextSibling)
          : !e && t && i.parentNode !== t && t.append(i);
      }
      function T() {
        let e = window.innerWidth < 768,
          t = document.querySelector(`.mobile-sticky-wrapper`);
        if (e) {
          if (!r || !i || (t?.contains(r) && t?.contains(i))) return;
          if (t) {
            let e = t.parentNode;
            for (; t.firstChild;) e?.insertBefore(t.firstChild, t);
            e?.removeChild(t);
          }
          if (r.parentNode === i.parentNode) {
            let e = document.createElement(`div`);
            ((e.className = `mobile-sticky-wrapper`),
              r.parentNode?.insertBefore(e, r),
              e.append(r, i));
          }
        } else if (t) {
          let e = t.parentNode;
          for (; t.firstChild;) e?.insertBefore(t.firstChild, t);
          e?.removeChild(t);
        }
      }
      function E() {
        (C(), w(), T());
      }
      window.matchMedia(`(max-width: 767px)`).addEventListener(`change`, E);
      let D = document.getElementById(`filterToggleBtn`);
      if (D) {
        if (!D.hasAttribute(`data-initialized`)) {
          let e = window.innerWidth < 768;
          (D.setAttribute(`aria-expanded`, e ? `false` : `true`),
            D.setAttribute(`data-initialized`, `true`));
        }
        n(D);
      }
      n(document.getElementById(`tocToggleBtn`));
      let O = new URLSearchParams(window.location.search),
        k = O.get(`category`);
      if (k) {
        let e = p.find((e) => e.dataset.filter === k);
        e &&
          (p.forEach((e) => {
            (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
          }),
          e.classList.add(`active`),
          e.setAttribute(`aria-pressed`, `true`));
      }
      let A = O.get(`group`);
      A && u && (u.value = A);
      let j = O.get(`year`);
      j && d && (d.value = j);
      let M = O.get(`sort`);
      M && f && (f.value = M);
      let N = O.get(`q`);
      (N && l && (l.value = N), C(), T(), v());
    }));
});
export default r();
