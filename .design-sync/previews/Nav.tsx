import { Nav } from 'personal-website';

// Primer's functional color tokens only activate under this attribute
// selector (normally on <html>, set by Layout.tsx) — previews mount into a
// bare card root, so it's reproduced here per Sidebar/Layout/etc previews.
const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

export function Home() {
  return (
    <Theme>
      <Nav activePage="home" />
    </Theme>
  );
}

export function Projects() {
  return (
    <Theme>
      <Nav activePage="projects" />
    </Theme>
  );
}

export function NoActivePage() {
  return (
    <Theme>
      <Nav />
    </Theme>
  );
}
