import type { AssemblerResult } from "../../assembler";

export type OnCommand = (command: string) => void;

export type StatusBarProps = {

  validation: StatusBarValidation;

  position?: monaco.IPosition;

  assembly?: AssemblerResult;

  /**
   * Signature: function(command: string) => void
   * An event is emitted when a command was initated
   */
  onCommand?: OnCommand;
}

export type StatusBarValidation = {
  warnings: number;
  errors: number;
}
