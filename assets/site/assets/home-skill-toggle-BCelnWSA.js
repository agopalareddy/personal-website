import { t as e } from './rolldown-runtime-Czjbc987.js';
var t = e(() => {
  document.addEventListener(`DOMContentLoaded`, () => {
    let e = document.querySelector(`.home-skill-toggle`);
    e &&
      e.addEventListener(`click`, () => {
        let t = e.getAttribute(`aria-expanded`) === `true`;
        e.setAttribute(`aria-expanded`, String(!t));
      });
  });
});
export default t();
