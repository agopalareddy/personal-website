// Home page "Show all N" control: reveals the skill groups past the first
// few. The collapsed state is CSS inside `@media (scripting: enabled)`, so
// with JavaScript off every group is simply shown and this button is hidden.
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector<HTMLButtonElement>('.home-skills-toggle');
  const groups = document.getElementById('homeSkillGroups');
  if (!button || !groups) return;

  button.addEventListener('click', () => {
    const expand = groups.dataset.expanded !== 'true';
    groups.dataset.expanded = String(expand);
    button.setAttribute('aria-expanded', String(expand));
    button.textContent =
      (expand ? button.dataset.labelExpanded : button.dataset.labelCollapsed) ?? '';
  });
});
