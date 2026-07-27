import { useCallback, useEffect, useState } from 'react';

export type ThemeMode =
  'auto' | 'light' | 'light_high_contrast' | 'dark' | 'dark_dimmed' | 'dark_high_contrast';

export const THEME_MODES: Array<{ value: ThemeMode; label: string }> = [
  { value: 'auto', label: 'Sync with system' },
  { value: 'light', label: 'Light' },
  { value: 'light_high_contrast', label: 'Light high contrast' },
  { value: 'dark', label: 'Dark' },
  { value: 'dark_dimmed', label: 'Dark dimmed' },
  { value: 'dark_high_contrast', label: 'Dark high contrast' },
];

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
const THEME_CHANGE_EVENT = 'site:theme-change';

function migrateLegacy(): ThemeMode | null {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy === null) return null;
  const map: Record<string, ThemeMode> = { light: 'light', dark: 'dark', device: 'auto' };
  const migrated = map[legacy] ?? 'auto';
  localStorage.removeItem(LEGACY_KEY);
  return migrated;
}

function getStored(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored) return stored;
  const migrated = migrateLegacy();
  if (migrated) {
    localStorage.setItem(STORAGE_KEY, migrated);
    return migrated;
  }
  return 'auto';
}

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  for (const [attr, value] of Object.entries(MODE_ATTRS[mode])) {
    html.setAttribute(attr, value);
  }
  let color = THEME_COLORS[mode];
  if (mode === 'auto') {
    color = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0d1117' : '#ffffff';
  }
  const existing = document.querySelector('meta[name="theme-color"]:not([media])');
  existing?.remove();
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = color ?? '#ffffff';
  document.head.appendChild(meta);
}

function announceTheme(mode: ThemeMode) {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) announcer.textContent = ANNOUNCE_LABELS[mode];
}

/**
 * Ported from assets/js/theme.js. Each ThemePicker island (header + footer,
 * research.md R1/R3) mounts its own instance of this hook; instances stay
 * in sync via a window CustomEvent since they're independent React roots,
 * not a shared component tree (matching theme.js's original syncPickers()
 * behavior across both slots).
 */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof window === 'undefined' ? 'auto' : getStored()
  );

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    const onSystemChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) === 'auto') {
        applyTheme('auto');
      }
    };
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', onSystemChange);

    const onExternalChange = (e: Event) => {
      const next = (e as CustomEvent<ThemeMode>).detail;
      setModeState(next);
    };
    window.addEventListener(THEME_CHANGE_EVENT, onExternalChange);

    return () => {
      mql.removeEventListener('change', onSystemChange);
      window.removeEventListener(THEME_CHANGE_EVENT, onExternalChange);
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
    announceTheme(next);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
  }, []);

  return { mode, setMode };
}
