import type { IPrefState } from "../../hooks/usePreferences.ts";

export type SideToolbarProps = {
  /** Current preference state (panels, section, autoSave, etc.) */
  prefState: IPrefState;

  /**
   * Update preferences, functional form to safely derive from the previous state.
   */
  onPrefStateChange: (updater: (prev: IPrefState) => IPrefState) => void;
}
