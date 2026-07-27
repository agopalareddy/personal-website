import { useEffect, useRef } from "react";
import { Icon, type IconName } from "./Icon";
import { THEME_MODES, useTheme, type ThemeMode } from "../../hooks/useTheme";

function modeIcon(mode: ThemeMode): IconName {
  if (mode === "light" || mode === "light_high_contrast") return "SUN_16";
  if (mode === "dark" || mode === "dark_dimmed" || mode === "dark_high_contrast") return "MOON_16";
  return "DEVICE_DESKTOP_16";
}

/** Ported from assets/js/theme.js's buildPickerDOM()/syncPickers(). */
export function ThemePicker() {
  const { mode, setMode } = useTheme();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const current = THEME_MODES.find((m) => m.value === mode) ?? THEME_MODES[0];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && detailsRef.current) detailsRef.current.open = false;
    };
    const onClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.open = false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  return (
    <details className="theme-picker" ref={detailsRef}>
      <summary aria-label={`Theme: ${current.label}`}>
        <Icon name={modeIcon(mode)} />
        <span>Theme</span>
        <Icon name="CHEVRON_DOWN_16" />
      </summary>
      <div className="theme-picker-menu" role="menu">
        {THEME_MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            className="theme-picker-option"
            role="menuitemradio"
            data-theme-value={m.value}
            aria-checked={m.value === mode}
            onClick={() => {
              setMode(m.value);
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          >
            <span className="theme-picker-option-icon">
              <Icon name={modeIcon(m.value)} />
            </span>
            <span>{m.label}</span>
            <span className="theme-picker-option-check">
              <Icon name="CHECK_16" />
            </span>
          </button>
        ))}
      </div>
    </details>
  );
}
