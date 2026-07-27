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
      o = document.getElementById(`resultsCount`),
      s = document.getElementById(`clearFiltersBtn`),
      c = n?.querySelector(`.search-input`) ?? null,
      l = n?.querySelector(`[data-role="group-filter"]`) ?? null,
      u = n?.querySelector(`[data-role="year-filter"]`) ?? null,
      d = n?.querySelector(`[data-role="sort"]`) ?? null,
      f = Array.from(n?.querySelectorAll(`.filter-btn`) ?? []),
      p = t.id === `experienceGrid` ? `entry` : `project`,
      m = t.id === `experienceGrid` ? `entries` : `projects`,
      h = Array.from(t.querySelectorAll(`.timeline-card`));
    function g() {
      return f.find((e) => e.classList.contains(`active`))?.dataset.filter ?? `all`;
    }
    function _() {
      let e = g(),
        n = l?.value ?? `all`,
        r = u?.value ?? `all`,
        i = (c?.value ?? ``).trim().toLowerCase(),
        s = h.filter((t) => {
          let a = e === `all` || t.dataset.category === e,
            o = n === `all` || t.dataset.group === n,
            s = r === `all` || t.dataset.year === r,
            c = !i || (t.dataset.search ?? ``).includes(i);
          return a && o && s && c;
        }),
        f = d?.value ?? `date-desc`;
      if (
        (s.sort((e, t) => {
          if (f === `title-asc`)
            return (e.dataset.title ?? ``).localeCompare(t.dataset.title ?? ``);
          let n = e.dataset.date ?? ``,
            r = t.dataset.date ?? ``;
          return f === `date-asc` ? n.localeCompare(r) : r.localeCompare(n);
        }),
        t.querySelectorAll(`.timeline-year`).forEach((e) => e.remove()),
        h.forEach((e) => e.remove()),
        s.length === 0)
      ) {
        (a && (a.hidden = !1), o && (o.textContent = `Showing 0 ${m}.`), v([]));
        return;
      }
      a && (a.hidden = !0);
      let _ = document.createDocumentFragment(),
        y;
      for (let e of s) {
        if (f !== `title-asc` && e.dataset.year && e.dataset.year !== y) {
          let t = document.createElement(`h2`);
          ((t.className = `timeline-year`),
            (t.id = `year-${e.dataset.year}`),
            (t.textContent = e.dataset.year),
            _.append(t),
            (y = e.dataset.year));
        }
        _.append(e);
      }
      (t.append(_), o && (o.textContent = `Showing ${s.length} ${s.length === 1 ? p : m}.`), v(s));
    }
    function v(e) {
      if (!r || !i) return;
      if (e.length <= 1) {
        ((r.hidden = !0), i.replaceChildren());
        return;
      }
      ((r.hidden = !1), C());
      let t = document.getElementById(`tocToggleBtn`);
      if (t && !t.hasAttribute(`data-initialized`)) {
        let e = window.innerWidth < 768;
        (t.setAttribute(`aria-expanded`, e ? `false` : `true`),
          t.setAttribute(`data-initialized`, `true`));
      }
      let n = d?.value ?? `date-desc`,
        a = document.createDocumentFragment();
      if (n === `title-asc`) for (let t of e) a.append(y(t));
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
          n?.append(y(r));
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
    function y(e) {
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
    function b() {
      let e = new URLSearchParams(),
        t = g();
      (t !== `all` && e.set(`category`, t),
        l && l.value !== `all` && e.set(`group`, l.value),
        u && u.value !== `all` && e.set(`year`, u.value),
        d && d.value !== `date-desc` && e.set(`sort`, d.value),
        c?.value && e.set(`q`, c.value));
      let n = e.toString();
      history.replaceState(
        null,
        ``,
        n ? `?${n}${location.hash}` : location.pathname + location.hash
      );
    }
    function x() {
      (f.forEach((e) => {
        let t = e.dataset.filter === `all`;
        (e.classList.toggle(`active`, t), e.setAttribute(`aria-pressed`, String(t)));
      }),
        l && (l.value = `all`),
        u && (u.value = `all`),
        d && (d.value = `date-desc`),
        c && (c.value = ``),
        b(),
        _());
    }
    (c?.addEventListener(`input`, () => {
      (b(), _());
    }),
      l?.addEventListener(`change`, () => {
        (b(), _());
      }),
      u?.addEventListener(`change`, () => {
        (b(), _());
      }),
      d?.addEventListener(`change`, () => {
        (b(), _());
      }),
      f.forEach((e) => {
        e.addEventListener(`click`, () => {
          (f.forEach((e) => {
            (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
          }),
            e.classList.add(`active`),
            e.setAttribute(`aria-pressed`, `true`),
            b(),
            _());
        });
      }),
      s?.addEventListener(`click`, x));
    function S() {
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
    function C() {
      if (!r) return;
      let e = window.innerWidth < 768,
        t = document.querySelector(`.academic-sidebar`);
      e && n
        ? (r.parentNode !== n.parentNode || r.previousElementSibling !== n) &&
          n.parentNode?.insertBefore(r, n.nextSibling)
        : !e && t && r.parentNode !== t && t.append(r);
    }
    function w() {
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
    function T() {
      (S(), C(), w());
    }
    window.matchMedia(`(max-width: 767px)`).addEventListener(`change`, T);
    let E = document.getElementById(`filterToggleBtn`);
    if (E) {
      if (!E.hasAttribute(`data-initialized`)) {
        let e = window.innerWidth < 768;
        (E.setAttribute(`aria-expanded`, e ? `false` : `true`),
          E.setAttribute(`data-initialized`, `true`));
      }
      E.addEventListener(`click`, () => {
        let e = E.getAttribute(`aria-expanded`) === `true`;
        E.setAttribute(`aria-expanded`, String(!e));
      });
    }
    let D = document.getElementById(`tocToggleBtn`);
    D &&
      D.addEventListener(`click`, () => {
        let e = D.getAttribute(`aria-expanded`) === `true`;
        D.setAttribute(`aria-expanded`, String(!e));
      });
    let O = new URLSearchParams(window.location.search),
      k = O.get(`category`);
    if (k) {
      let e = f.find((e) => e.dataset.filter === k);
      e &&
        (f.forEach((e) => {
          (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
        }),
        e.classList.add(`active`),
        e.setAttribute(`aria-pressed`, `true`));
    }
    let A = O.get(`group`);
    A && l && (l.value = A);
    let j = O.get(`year`);
    j && u && (u.value = j);
    let M = O.get(`sort`);
    M && d && (d.value = M);
    let N = O.get(`q`);
    (N && c && (c.value = N), S(), w(), _());
  });
});
export default t();
