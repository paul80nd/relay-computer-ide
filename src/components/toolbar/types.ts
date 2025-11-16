import type { AppCommand } from '../../commands';
import type { IPrefState } from "../../hooks/usePreferences.ts";

export type AppToolbarProps = {

  /** Current preference state (panels, section, autoSave, etc.) */
  prefState: IPrefState;

  /**
   * Update preferences.
   * Use the functional form so consumers can safely update based on the previous state.
   */
  onPrefStateChange: (updater: (prev: IPrefState) => IPrefState) => void;

  /** Emitted when a command was initiated */
  onCommand?: (command: AppCommand) => void;

  /** Whether auto-save is enabled */
  autoSave: boolean;

  /** Whether there are unsaved changes */
  dirty: boolean;

  onToggleAutoSave?: (autoSave: boolean) => void;
}
