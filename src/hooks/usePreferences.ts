import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export const Prefs = {
  Panels: {
    PRI_SIDEBAR: 'sidebar-p',
    SEC_SIDEBAR: 'sidebar-s',
    PANEL: 'panel',
  }
}

export interface IPanelPrefs {
  primary: boolean;
  secondary: boolean;
  bottom: boolean;
}

export interface IPrefState {
  panels: IPanelPrefs;
  /** Currently selected primary sidebar section */
  section?: string;
}

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
          section: parsed.section
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
      }
    };
  };

  const [prefState, setPrefState] = useState<IPrefState>(initialPrefs);

  // Update localStorage whenever prefState changes
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefState));
  }, [prefState]);

  return [prefState, setPrefState];
}
