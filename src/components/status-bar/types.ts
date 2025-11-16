import type { AssemblerResult } from "../../assembler";
import type { AppCommand } from "../../commands";

export type StatusBarProps = {

  validation: StatusBarValidation;

  position?: monaco.IPosition;

  assembly?: AssemblerResult;

  /** Emitted when a command was initated */
  onCommand?: (command: AppCommand) => void;
}

export type StatusBarValidation = {
  warnings: number;
  errors: number;
}
