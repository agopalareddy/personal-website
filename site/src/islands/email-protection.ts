// Ported from assets/js/email-protection.js. Plain DOM script, not a React
// island — there's no component state here, just decoding base64 email
// parts out of data attributes so the address never sits in HTML source
// (AGENTS.md: "Never expose mailto:... in HTML"). Bundled by Vite and
// loaded on every page, same as the original.
function decodeEmail() {
  const elements = document.querySelectorAll<HTMLAnchorElement>(
    "[data-email-user][data-email-domain]",
  );

  elements.forEach((el) => {
    const user = atob(el.getAttribute("data-email-user")!);
    const domain = atob(el.getAttribute("data-email-domain")!);
    const email = `${user}@${domain}`;

    el.setAttribute("href", `mailto:${email}`);

    const displayText = el.getAttribute("data-email-text");
    if (displayText) {
      el.textContent = displayText;
    }

    el.removeAttribute("data-email-user");
    el.removeAttribute("data-email-domain");
    el.removeAttribute("data-email-text");
    el.classList.add("email-decoded");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", decodeEmail);
} else {
  decodeEmail();
}
