
export type OnCommand = (command: string) => void;

export type StatusBarProps = {

  position?: monaco.IPosition

  /**
   * Signature: function(command: string) => void
   * An event is emitted when a command was initated
   */
  onCommand?: OnCommand;
}
