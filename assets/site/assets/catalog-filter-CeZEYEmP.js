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
      let _ = new Map();
      if (f !== `title-asc`)
        for (let e of s) {
          let t = e.dataset.year;
          t && _.set(t, (_.get(t) ?? 0) + 1);
        }
      let y = document.createDocumentFragment(),
        b;
      for (let e of s) {
        let t = e.dataset.year;
        if (t && _.has(t) && t !== b) {
          let e = _.get(t) ?? 0,
            n = document.createElement(`h2`);
          ((n.className = `timeline-year`),
            (n.id = `year-${t}`),
            (n.textContent = t),
            (n.dataset.count = `${e} ${e === 1 ? p : m}`),
            y.append(n),
            (b = t));
        }
        y.append(e);
      }
      (t.append(y),
        o && (o.textContent = `Showing ${s.length} ${s.length === 1 ? p : m}.`),
        v([..._.keys()]));
    }
    function v(e) {
      if (!r || !i) return;
      if (e.length < 2) {
        ((r.hidden = !0), i.replaceChildren());
        return;
      }
      r.hidden = !1;
      let t = document.createDocumentFragment();
      for (let n of e) {
        let e = document.createElement(`li`);
        e.className = `toc-item`;
        let r = document.createElement(`a`);
        ((r.href = `#year-${n}`),
          (r.className = `toc-year-header`),
          (r.textContent = n),
          e.append(r),
          t.append(e));
      }
      i.replaceChildren(t);
    }
    function y() {
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
    function b() {
      (f.forEach((e) => {
        let t = e.dataset.filter === `all`;
        (e.classList.toggle(`active`, t), e.setAttribute(`aria-pressed`, String(t)));
      }),
        l && (l.value = `all`),
        u && (u.value = `all`),
        d && (d.value = `date-desc`),
        c && (c.value = ``),
        y(),
        _());
    }
    (c?.addEventListener(`input`, () => {
      (y(), _());
    }),
      l?.addEventListener(`change`, () => {
        (y(), _());
      }),
      u?.addEventListener(`change`, () => {
        (y(), _());
      }),
      d?.addEventListener(`change`, () => {
        (y(), _());
      }),
      f.forEach((e) => {
        e.addEventListener(`click`, () => {
          (f.forEach((e) => {
            (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
          }),
            e.classList.add(`active`),
            e.setAttribute(`aria-pressed`, `true`),
            y(),
            _());
        });
      }),
      s?.addEventListener(`click`, b));
    let x = new URLSearchParams(window.location.search),
      S = x.get(`category`);
    if (S) {
      let e = f.find((e) => e.dataset.filter === S);
      e &&
        (f.forEach((e) => {
          (e.classList.remove(`active`), e.setAttribute(`aria-pressed`, `false`));
        }),
        e.classList.add(`active`),
        e.setAttribute(`aria-pressed`, `true`));
    }
    let C = x.get(`group`);
    C && l && (l.value = C);
    let w = x.get(`year`);
    w && u && (u.value = w);
    let T = x.get(`sort`);
    T && d && (d.value = T);
    let E = x.get(`q`);
    (E && c && (c.value = E), _());
  });
});
export default t();
