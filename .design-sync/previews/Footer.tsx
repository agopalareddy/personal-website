import { Footer } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

export function Default() {
  return (
    <Theme>
      <Footer />
    </Theme>
  );
}
