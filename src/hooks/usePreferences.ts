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

export type PanelType =
  | 'sidebar-p'
  | 'sidebar-s'
  | 'panel';

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


/**
 * Applies a Fluent UI checkedValues change (for 'panels' or 'section')
 * to the preference state consistently.
 */
export function updatePrefsFromCheckedValues(
  prev: IPreferences,
  name: string,
  checkedItems: string[],
  panelsEnum: typeof Prefs.Panels
): IPreferences {
  const next = { ...prev };

  if (name === 'panels') {
    const primaryChecked = checkedItems.includes(panelsEnum.PRI_SIDEBAR);
    const secondaryChecked = checkedItems.includes(panelsEnum.SEC_SIDEBAR);
    const bottomChecked = checkedItems.includes(panelsEnum.PANEL);

    const section = primaryChecked ? next.section : undefined;

    return {
      ...next,
      panels: {
        primary: primaryChecked,
        secondary: secondaryChecked,
        bottom: bottomChecked,
      },
      section,
    };
  }

  if (name === 'section') {
    const [newSection] = checkedItems;
    const currentSection = next.section;

    // Clicking the same radio again -> clear section and close the primary sidebar
    if (currentSection && newSection === currentSection) {
      return {
        ...next,
        section: undefined,
        panels: {
          ...next.panels,
          primary: false,
        },
      };
    }

    // Selecting a new section -> set it and ensure the primary sidebar is open
    if (newSection) {
      return {
        ...next,
        section: newSection,
        panels: {
          ...next.panels,
          primary: true,
        },
      };
    }

    return next;
  }

  // Unknown group: no-op
  return next;
}
