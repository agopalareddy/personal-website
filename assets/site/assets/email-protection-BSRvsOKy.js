import { t as e } from './rolldown-runtime-Czjbc987.js';
var t = e(() => {
  function e() {
    document.querySelectorAll(`[data-email-user][data-email-domain]`).forEach((e) => {
      let t = `${atob(e.getAttribute(`data-email-user`))}@${atob(e.getAttribute(`data-email-domain`))}`;
      e.setAttribute(`href`, `mailto:${t}`);
      let n = e.getAttribute(`data-email-text`);
      (n && (e.textContent = n),
        e.removeAttribute(`data-email-user`),
        e.removeAttribute(`data-email-domain`),
        e.removeAttribute(`data-email-text`),
        e.classList.add(`email-decoded`));
    });
  }
  document.readyState === `loading` ? document.addEventListener(`DOMContentLoaded`, e) : e();
});
export default t();
