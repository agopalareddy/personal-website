import { THEME_MODES, themeIconKind, type ThemeMode } from '../components/common/themeModes';

// The theme picker, in plain DOM code. Nav.tsx renders the picker's markup
// once inside <template id="theme-picker-template">; this island clones it
// into each slot and keeps the copies in step. CSS decides which slots show:
// the header one on wide screens; on phones the compact one in the top bar
// plus the labelled one in the footer.
//
// The inline snippet in <head> (theme-inline-snippet.ts) has already set the
// theme attributes before first paint; this file handles everything after.

const MODE_ATTRS: Record<ThemeMode, Record<string, string>> = {
  auto: { 'data-color-mode': 'auto', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
  light: { 'data-color-mode': 'light', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
  light_high_contrast: {
    'data-color-mode': 'light',
    'data-light-theme': 'light_high_contrast',
    'data-dark-theme': 'dark',
  },
  dark: { 'data-color-mode': 'dark', 'data-light-theme': 'light', 'data-dark-theme': 'dark' },
  dark_dimmed: {
    'data-color-mode': 'dark',
    'data-light-theme': 'light',
    'data-dark-theme': 'dark_dimmed',
  },
  dark_high_contrast: {
    'data-color-mode': 'dark',
    'data-light-theme': 'light',
    'data-dark-theme': 'dark_high_contrast',
  },
};

const THEME_COLORS: Record<ThemeMode, string | null> = {
  auto: null,
  light: '#ffffff',
  light_high_contrast: '#ffffff',
  dark: '#0d1117',
  dark_dimmed: '#22272e',
  dark_high_contrast: '#010409',
};

const ANNOUNCE_LABELS: Record<ThemeMode, string> = {
  auto: 'Following system theme',
  light: 'Light theme active',
  light_high_contrast: 'Light high contrast theme active',
  dark: 'Dark theme active',
  dark_dimmed: 'Dark dimmed theme active',
  dark_high_contrast: 'Dark high contrast theme active',
};

const STORAGE_KEY = 'color-scheme';
const LEGACY_KEY = 'theme';

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && value in MODE_ATTRS;
}

function getStored(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isThemeMode(stored)) return stored;
  // Pre-2026 visitors: the old slider stored light/dark/device under "theme".
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy !== null) {
    const map: Record<string, ThemeMode> = { light: 'light', dark: 'dark', device: 'auto' };
    const migrated = map[legacy] ?? 'auto';
    localStorage.removeItem(LEGACY_KEY);
    localStorage.setItem(STORAGE_KEY, migrated);
    return migrated;
  }
  return 'auto';
}

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  for (const [attr, value] of Object.entries(MODE_ATTRS[mode])) {
    html.setAttribute(attr, value);
  }
  const color = THEME_COLORS[mode] ?? (systemDark.matches ? '#0d1117' : '#ffffff');
  document.querySelector('meta[name="theme-color"]:not([media])')?.remove();
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = color;
  document.head.appendChild(meta);
}

const pickers: HTMLDetailsElement[] = [];

/** Makes every mounted picker show `mode` as the current choice. */
function syncPickers(mode: ThemeMode) {
  const label = THEME_MODES.find((m) => m.value === mode)?.label ?? '';
  const kind = themeIconKind(mode);
  for (const picker of pickers) {
    picker.querySelector('summary')?.setAttribute('aria-label', `Theme: ${label}`);
    picker.querySelectorAll<HTMLElement>('[data-theme-icon]').forEach((icon) => {
      icon.hidden = icon.dataset.themeIcon !== kind;
    });
    picker.querySelectorAll<HTMLElement>('[data-theme-value]').forEach((option) => {
      option.setAttribute('aria-checked', String(option.dataset.themeValue === mode));
    });
  }
}

function closeAll(except?: Node | null) {
  for (const picker of pickers) {
    if (!except || !picker.contains(except)) picker.open = false;
  }
}

function setMode(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
  syncPickers(mode);
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) announcer.textContent = ANNOUNCE_LABELS[mode];
}

/** Clones the template into `slotId`. `compact` leaves a bare icon button. */
function mount(template: HTMLTemplateElement, slotId: string, compact = false) {
  const slot = document.getElementById(slotId);
  const picker = template.content.querySelector('details')?.cloneNode(true);
  if (!slot || !(picker instanceof HTMLDetailsElement)) return;

  if (compact) {
    picker.classList.add('theme-picker--compact');
    picker.querySelector('[data-theme-label]')?.remove();
    picker.querySelector('[data-theme-chevron]')?.remove();
  }

  picker.addEventListener('click', (e) => {
    const option = (e.target as Element).closest<HTMLElement>('[data-theme-value]');
    const value = option?.dataset.themeValue ?? null;
    if (!isThemeMode(value)) return;
    setMode(value);
    picker.open = false;
  });

  slot.appendChild(picker);
  pickers.push(picker);
}

const template = document.getElementById('theme-picker-template');
if (template instanceof HTMLTemplateElement) {
  mount(template, 'theme-toggle');
  mount(template, 'theme-toggle-top', true);
  mount(template, 'theme-toggle-footer');

  const initial = getStored();
  applyTheme(initial);
  syncPickers(initial);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  document.addEventListener('click', (e) => closeAll(e.target as Node));
  systemDark.addEventListener('change', () => {
    if (localStorage.getItem(STORAGE_KEY) === 'auto') applyTheme('auto');
  });
}
