import type { IPreferences } from "../../hooks/usePreferences.ts";

export type SideToolbarProps = {
  /** Current preference state (panels, section, autoSave, etc.) */
  prefs: IPreferences;

  /**
   * Update preferences, functional form to safely derive from the previous state.
   */
  onPrefsChange: (updater: (prev: IPreferences) => IPreferences) => void;
}
