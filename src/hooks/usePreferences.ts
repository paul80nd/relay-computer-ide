import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export interface IPrefState {
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
export function usePreferences(): [IPrefState, Dispatch<SetStateAction<IPrefState>>] {

  // Read the initial prefs from localStorage
  const initialPrefs = (): IPrefState => {
    const savedState = localStorage.getItem('prefs');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as Partial<IPrefState>;
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

  const [prefState, setPrefState] = useState<IPrefState>(initialPrefs);

  // Update localStorage whenever prefState changes
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefState));
  }, [prefState]);

  return [prefState, setPrefState];
}

export type CheckedValues = {
  panels: string[];
  section: string[];
};

// Map typed prefs -> Fluent UI checkedValues
export function mapPrefsToCheckedValues(prefState: IPrefState, Panels: typeof Prefs.Panels): CheckedValues {
  return {
    panels: [
      prefState.panels.primary ? Panels.PRI_SIDEBAR : null,
      prefState.panels.secondary ? Panels.SEC_SIDEBAR : null,
      prefState.panels.bottom ? Panels.PANEL : null,
    ].filter(Boolean) as string[],
    section: prefState.section ? [prefState.section] : [],
  };
}
