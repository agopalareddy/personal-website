// Ported from assets/js/theme.js's initHomeSkillToggle() — dropped during
// the React migration since no island loaded it on the home page, leaving
// the "Technical stack by area" panel permanently expanded (aria-expanded
// hardcoded to "true" in Home.tsx with nothing to ever flip it).
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector<HTMLButtonElement>('.home-skill-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
});
