import { type ToolbarProps } from '@fluentui/react-components'
import type { AppCommand } from '../../commands';

export type AppToolbarProps = ToolbarProps & {

  /** Emitted when a command was initated */
  onCommand?: (command: AppCommand) => void;

}
