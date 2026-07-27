import { createRoot } from "react-dom/client";
import { ThemePicker } from "../components/common/ThemePicker";

// Client-only hydration island (research.md R1/R3). The header/footer slots
// are rendered empty by Layout.tsx — matching assets/js/theme.js's original
// behavior exactly: without JS, no picker UI ever appeared in either slot,
// only the static default theme applied.
const headerSlot = document.getElementById("theme-toggle");
const footerSlot = document.getElementById("theme-toggle-footer");

if (headerSlot) createRoot(headerSlot).render(<ThemePicker />);
if (footerSlot) createRoot(footerSlot).render(<ThemePicker />);
