import {
  Caption1,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
} from '@fluentui/react-components';
import { Warning16Regular, ErrorCircle16Regular } from '@fluentui/react-icons';
import type { StatusBarProps } from './types';
import { editorCommands, panelCommands } from '../../commands';
import { pluralize } from '../../utils';
import { useCommandBus } from '../../hooks/useCommandBus.ts';

const useStyles = makeStyles({
  bar: {
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '0 .5rem 0 3rem',
    minHeight: '1.5rem',
  },
  item: { color: tokens.colorNeutralForeground3, padding: '0 .4rem', minWidth: '2rem' },
  error: { color: tokens.colorStatusDangerForeground1 },
  warning: { color: tokens.colorStatusWarningForeground1 },
});

function StatusBar({ position, validation, assembly, autoSave, dirty }: StatusBarProps) {
  const styles = useStyles();
  const { execute } = useCommandBus();

  const bytes = Math.max((assembly?.bytes?.length ?? 0) - 2, 0);

  const renderSaveLabel = () => {
    if (autoSave) {
      return <>Auto Save: On</>;
    } else if (dirty) {
      return <span className={styles.warning}>Unsaved changes</span>;
    } else {
      return <>All changes saved</>;
    }
  };

  return (
    <Toolbar className={styles.bar} size='small'>
      <ToolbarGroup role='presentation'>
        <Tooltip
          content={`Problems (${pluralize(validation.errors, 'error', 'errors')}, ${pluralize(
            validation.warnings,
            'warning',
            'warnings'
          )})`}
          relationship='description'
          positioning='above-start'
          withArrow
        >
          <ToolbarButton className={styles.item} appearance='transparent'>
            <ErrorCircle16Regular className={validation.errors === 0 ? undefined : styles.error} />
            <Caption1 className={validation.errors === 0 ? undefined : styles.error}>{validation.errors}</Caption1>
            &nbsp;
            <Warning16Regular className={validation.warnings === 0 ? undefined : styles.warning} />
            <Caption1 className={validation.warnings === 0 ? undefined : styles.warning}>
              {validation.warnings}
            </Caption1>
          </ToolbarButton>
        </Tooltip>
        <Caption1 className={styles.item}>{renderSaveLabel()}</Caption1>
        {position && (
          <Tooltip content='Goto Line/Column' relationship='description' positioning='above' withArrow>
            <ToolbarButton
              className={styles.item}
              appearance='transparent'
              onClick={() => execute(editorCommands.gotoLine())}
            >
              <Caption1>
                Ln {position.lineNumber}, Col {position.column}{' '}
              </Caption1>
            </ToolbarButton>
          </Tooltip>
        )}
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        {assembly && assembly.bytes && (
          <Tooltip
            content={`Assembler outputted ${pluralize(bytes, 'byte', 'bytes')}`}
            relationship='description'
            positioning='above-start'
            withArrow
          >
            <ToolbarButton
              className={styles.item}
              appearance='transparent'
              onClick={() => execute(panelCommands.show('sidebar-s'))}
            >
              <Caption1>Bytes: {bytes}</Caption1>
            </ToolbarButton>
          </Tooltip>
        )}
      </ToolbarGroup>
    </Toolbar>
  );
}

export default StatusBar;
