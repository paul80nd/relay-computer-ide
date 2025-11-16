import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export interface IPreferences {
  panels: {
    primary: boolean;
    secondary: boolean;
    bottom: boolean;
  };
  /** Currently selected primary sidebar section */
  section?: string;
  autoSave?: boolean;
}

export const Prefs = {
  Panels: {
    PRI_SIDEBAR: 'sidebar-p',
    SEC_SIDEBAR: 'sidebar-s',
    PANEL: 'panel',
  }
} as const;


/**
 * Handles management of user preferences stored in local browser storage
 */
export function usePreferences(): [IPreferences, Dispatch<SetStateAction<IPreferences>>] {

  // Read the initial prefs from localStorage
  const initialPrefs = (): IPreferences => {
    const savedState = localStorage.getItem('prefs');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as Partial<IPreferences>;
        return {
          panels: {
            primary: parsed.panels?.primary ?? false,
            secondary: parsed.panels?.secondary ?? true,
            bottom: parsed.panels?.bottom ?? false
          },
          section: parsed.section,
          autoSave: parsed.autoSave ?? true,
        };
      } catch {
        // fall through to default
      }
    }

    // Default: secondary sidebar visible, others hidden
    return {
      panels: {
        primary: false,
        secondary: true,
        bottom: false,
      },
      autoSave: true,
    };
  };

  const [prefs, setPrefs] = useState<IPreferences>(initialPrefs);

  // Update localStorage whenever prefState changes
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefs));
  }, [prefs]);

  return [prefs, setPrefs];
}

export type CheckedValues = {
  panels: string[];
  section: string[];
};

// Map typed prefs -> Fluent UI checkedValues
export function mapPrefsToCheckedValues(prefs: IPreferences, Panels: typeof Prefs.Panels): CheckedValues {
  return {
    panels: [
      prefs.panels.primary ? Panels.PRI_SIDEBAR : null,
      prefs.panels.secondary ? Panels.SEC_SIDEBAR : null,
      prefs.panels.bottom ? Panels.PANEL : null,
    ].filter(Boolean) as string[],
    section: prefs.section ? [prefs.section] : [],
  };
}
