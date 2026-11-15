import { n as e, t } from './rolldown-runtime-Czjbc987.js';
function n(e) {
  e?.addEventListener(`click`, () => {
    let t = e.getAttribute(`aria-expanded`) === `true`;
    e.setAttribute(`aria-expanded`, String(!t));
  });
}
var r = e(() => {}),
  i = t(() => {
    (r(),
      document.addEventListener(`DOMContentLoaded`, () => {
        n(document.querySelector(`.home-skill-toggle`));
      }));
  });
export default i();
