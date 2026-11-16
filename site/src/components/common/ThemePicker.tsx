import { Icon, type IconName } from './Icon';
import { THEME_MODES, themeIconKind, type ThemeIconKind } from './themeModes';

const KIND_ICONS: Record<ThemeIconKind, IconName> = {
  auto: 'DEVICE_DESKTOP_16',
  light: 'SUN_16',
  dark: 'MOON_16',
};

/**
 * The theme picker's markup, rendered once per page inside a <template>.
 * site/src/islands/theme.ts clones it into each slot (#theme-toggle,
 * #theme-toggle-top, #theme-toggle-footer) and wires up the behavior, so the
 * browser downloads no framework code for it. Without JavaScript the template
 * stays inert and no picker shows, as before.
 *
 * The summary holds all three icons; the island shows the one for the
 * current mode.
 */
export function ThemePickerTemplate() {
  return (
    <template id="theme-picker-template">
      <details className="theme-picker">
        <summary aria-label="Theme">
          {(Object.keys(KIND_ICONS) as ThemeIconKind[]).map((kind) => (
            <span
              className="theme-picker-icon"
              data-theme-icon={kind}
              hidden={kind !== 'auto'}
              key={kind}
            >
              <Icon name={KIND_ICONS[kind]} />
            </span>
          ))}
          <span data-theme-label>Theme</span>
          <span className="theme-picker-icon" data-theme-chevron>
            <Icon name="CHEVRON_DOWN_16" />
          </span>
        </summary>
        <div className="theme-picker-menu" role="menu">
          {THEME_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              className="theme-picker-option"
              role="menuitemradio"
              data-theme-value={m.value}
              aria-checked={m.value === 'auto'}
            >
              <span className="theme-picker-option-icon">
                <Icon name={KIND_ICONS[themeIconKind(m.value)]} />
              </span>
              <span>{m.label}</span>
              <span className="theme-picker-option-check">
                <Icon name="CHECK_16" />
              </span>
            </button>
          ))}
        </div>
      </details>
    </template>
  );
}
