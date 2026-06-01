import type { IPreferences } from '../../hooks/usePreferences.ts';

export type AppToolbarProps = {
  /** Current preference state (panels, section, autoSave, etc.) */
  prefs: IPreferences;

  /**
   * Update preferences.
   * Use the functional form so consumers can safely update based on the previous state.
   */
  onPrefsChange: (updater: (prev: IPreferences) => IPreferences) => void;

  /** Whether there are unsaved changes */
  dirty: boolean;
};
