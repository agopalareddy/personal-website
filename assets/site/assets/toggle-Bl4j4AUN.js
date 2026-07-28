import { n as e } from './rolldown-runtime-Czjbc987.js';
function t(e) {
  e?.addEventListener(`click`, () => {
    let t = e.getAttribute(`aria-expanded`) === `true`;
    e.setAttribute(`aria-expanded`, String(!t));
  });
}
var n = e(() => {});
export { n, t };
