/**
 * The theme choices, shared by the server-rendered picker template
 * (ThemePicker.tsx) and the client island that drives it (islands/theme.ts).
 * Plain data only, so the island bundle carries no framework code.
 */
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

/** Which of the three button icons (desktop, sun, moon) stands for a mode. */
export type ThemeIconKind = 'auto' | 'light' | 'dark';

export function themeIconKind(mode: ThemeMode): ThemeIconKind {
  if (mode === 'light' || mode === 'light_high_contrast') return 'light';
  if (mode === 'auto') return 'auto';
  return 'dark';
}
