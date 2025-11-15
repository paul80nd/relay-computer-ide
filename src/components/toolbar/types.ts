import { type ToolbarProps } from '@fluentui/react-components'

export type AppToolbarProps = ToolbarProps & {

  /**
   * Signature: function(command: string) => void
   * An event is emitted when a command was initated
   */
  onCommand?: (command: string) => void;

}
