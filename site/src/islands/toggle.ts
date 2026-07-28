// Shared by catalog-filter.ts (filter/TOC panels) and home-skill-toggle.ts
// (home page skill panel) — every aria-expanded toggle button on the site
// flips the same way.
export function bindExpandToggle(btn: HTMLElement | null) {
  btn?.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });
}
