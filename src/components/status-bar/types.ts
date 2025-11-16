import type { AssemblerResult } from "../../assembler";
import type { AppCommand } from "../../commands";

export type StatusBarProps = {

  validation: StatusBarValidation;

  position?: monaco.IPosition;

  assembly?: AssemblerResult;

  /** True when auto-save is enabled */
  autoSave: boolean;

  /** True when there are unsaved changes (only meaningful if autoSave is false) */
  dirty: boolean;

  /** Emitted when a command was initiated */
  onCommand?: (command: AppCommand) => void;
}

export type StatusBarValidation = {
  warnings: number;
  errors: number;
}
