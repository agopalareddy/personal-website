import { createRoot } from 'react-dom/client';
import { ThemePicker } from '../components/common/ThemePicker';

// Client-only hydration island (research.md R1/R3). The slots are rendered
// empty by Nav.tsx/Footer.tsx — matching assets/js/theme.js's original
// behavior exactly: without JS, no picker UI ever appeared in any slot,
// only the static default theme applied.
//
// CSS decides which slots show: the header one on wide screens; on phones
// the compact one in the top bar plus the labelled one in the footer.
const headerSlot = document.getElementById('theme-toggle');
const topSlot = document.getElementById('theme-toggle-top');
const footerSlot = document.getElementById('theme-toggle-footer');

if (headerSlot) createRoot(headerSlot).render(<ThemePicker />);
if (topSlot) createRoot(topSlot).render(<ThemePicker compact />);
if (footerSlot) createRoot(footerSlot).render(<ThemePicker />);
