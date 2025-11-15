import {
  Caption1,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
} from '@fluentui/react-components';
import type { StatusBarProps } from './types';

const useStyles = makeStyles({
  bar: {
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: 0,
  },
  item: {
    color: tokens.colorNeutralForeground3,
    padding: 0,
  },
});

function StatusBar({ position }: StatusBarProps) {
  const styles = useStyles();
  return (
    <Toolbar className={styles.bar} size='small'>
      <ToolbarGroup role='presentation'>
        {position && (
          <Tooltip content='Goto Line/Column' relationship='description' positioning='above' withArrow>
            <ToolbarButton className={styles.item} name='panels' appearance='transparent' value='customize'>
              <Caption1>Ln {position.lineNumber}, Col {position.column} </Caption1>
            </ToolbarButton>
          </Tooltip>
        )}
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>&nbsp;</ToolbarGroup>
    </Toolbar>
  );
}

export default StatusBar;
