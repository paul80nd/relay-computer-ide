
export type OnCommand = (command: string) => void;

export type StatusBarProps = {

  validation: StatusBarValidation;

  position?: monaco.IPosition;

  /**
   * Signature: function(command: string) => void
   * An event is emitted when a command was initated
   */
  onCommand?: OnCommand;
}

export type StatusBarValidation = {
  isValid: boolean;
  warnings: number;
  errors: number;
}
