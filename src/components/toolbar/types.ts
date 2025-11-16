import type { AppCommand } from '../../commands';

export type AppToolbarProps = {

  onCheckedValueChange?: (name: string, checkedItems: string[]) => void;
  checkedValues?: Record<string, string[]>;

  /** Emitted when a command was initiated */
  onCommand?: (command: AppCommand) => void;

  /** Whether auto-save is enabled */
  autoSave: boolean;

  /** Whether there are unsaved changes */
  dirty: boolean;

  onToggleAutoSave?: (autoSave: boolean) => void;
}
