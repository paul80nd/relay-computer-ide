import { useEffect, useState } from "react";

/**
 * Handles management of user preferences stored in local browser storage
 */
export function usePreferences() {

  // Read the initial prefs from localStorage
  const initialPrefs = () => {
    const savedState = localStorage.getItem('prefs');
    return savedState ? JSON.parse(savedState) : { panels: [Prefs.Panels.SEC_SIDEBAR] };
  };

  const [prefState, setPrefState] = useState(initialPrefs);

  // Update localStorage whenever prefState changes
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefState));
  }, [prefState]);

  return [prefState, setPrefState];
}

export const Prefs = {
  Panels: {
    PRI_SIDEBAR: 'sidebar-p',
    SEC_SIDEBAR: 'sidebar-s',
    PANEL: 'panel',
  }
}
