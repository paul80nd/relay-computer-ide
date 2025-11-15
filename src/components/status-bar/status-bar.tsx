import {
  Caption1,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
} from '@fluentui/react-components';
import { Warning16Regular, ErrorCircle16Regular, CheckmarkCircle16Regular } from '@fluentui/react-icons';
import type { StatusBarProps } from './types';
import { Commands } from '../../commands';

const useStyles = makeStyles({
  bar: {
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '0 0 0 3rem',
    minHeight: '1.5rem',
  },
  item: { color: tokens.colorNeutralForeground3, padding: 0 },
  success: { color: tokens.colorStatusSuccessForeground1 },
  error: { color: tokens.colorStatusDangerForeground1 },
  warning: { color: tokens.colorStatusWarningForeground1 },
});

function StatusBar({ position, validation, onCommand }: StatusBarProps) {
  const styles = useStyles();
  return (
    <Toolbar className={styles.bar} size='small'>
      <ToolbarGroup role='presentation'>
        {position && (
          <Tooltip content='Goto Line/Column' relationship='description' positioning='above' withArrow>
            <ToolbarButton
              className={styles.item}
              appearance='transparent'
              onClick={() => onCommand && onCommand(Commands.EDITOR_GOTOLINE)}
            >
              <Caption1>
                Ln {position.lineNumber}, Col {position.column}{' '}
              </Caption1>
            </ToolbarButton>
          </Tooltip>
        )}
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        {validation && validation.isValid && (
          <ToolbarButton className={styles.item} appearance='transparent'>
            <CheckmarkCircle16Regular className={styles.success} />
            <Caption1 className={styles.success}>OK</Caption1>
          </ToolbarButton>
        )}
        {validation && !validation.isValid && (
          <Tooltip content='Problems' relationship='description' positioning='above-start' withArrow>
            <ToolbarButton className={styles.item} appearance='transparent'>
              <ErrorCircle16Regular className={styles.error} />
              <Caption1 className={styles.error}>{validation.errors}</Caption1> &nbsp;
              <Warning16Regular className={styles.warning} />
              <Caption1 className={styles.warning}>{validation.warnings}</Caption1>
            </ToolbarButton>
          </Tooltip>
        )}
      </ToolbarGroup>
    </Toolbar>
  );
}

export default StatusBar;
