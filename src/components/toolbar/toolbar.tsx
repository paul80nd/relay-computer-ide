import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import {
  PanelLeftFilled,
  PanelRightFilled,
  bundleIcon,
  PanelRightRegular,
  PanelLeftRegular,
  Code20Color,
  PanelBottomFilled,
  PanelBottomRegular,
  BroadActivityFeedFilled,
  BroadActivityFeedRegular,
} from '@fluentui/react-icons';
import {
  Toolbar,
  tokens,
  Tooltip,
  ToolbarToggleButton,
  ToolbarGroup,
  makeStyles,
  Text,
} from '@fluentui/react-components';
import { Prefs } from '../../hooks/usePreferences';
import type { AppToolbarProps } from './types';
import AppToolbarMenu from './toolbar-menu';

const PanelLeft = bundleIcon(PanelLeftFilled, PanelLeftRegular);
const PanelRight = bundleIcon(PanelRightFilled, PanelRightRegular);
const PanelBottom = bundleIcon(PanelBottomFilled, PanelBottomRegular);
const Panels = bundleIcon(BroadActivityFeedFilled, BroadActivityFeedRegular);

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '0 .5rem 0 .75rem',
  },
  toggle: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground4,
  },
  dirtyIndicator: {
    color: tokens.colorStatusWarningForeground1,
    marginRight: '0.75rem',
  },
});

function AppToolbar(props: AppToolbarProps): JSXElement {
  const styles = useStyles();

  const onChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    if (props.onCheckedValueChange) {
      props.onCheckedValueChange(name, checkedItems);
    }
  };

  return (
    <Toolbar
      checkedValues={props.checkedValues}
      onCheckedValueChange={onChange}
      aria-label='Default'
      className={styles.toolbar}
      size='small'
    >
      <ToolbarGroup role='presentation'>
        <Code20Color />
        <AppToolbarMenu {...props} />
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        {!props.autoSave && props.dirty && (
          <Text size={200} className={styles.dirtyIndicator}>
            ● Unsaved
          </Text>
        )}
        <Text weight='semibold' style={{ marginRight: '1rem' }}>
          Relay Computer IDE
        </Text>
        <Tooltip content='Customize Layout…' relationship='description' positioning='below-end' withArrow>
          <ToolbarToggleButton
            className={styles.toggle}
            icon={<Panels />}
            disabled
            name='panels'
            appearance='transparent'
            value='customize'
          />
        </Tooltip>
        <Tooltip content='Toggle Primary Side Bar' relationship='description' positioning='below-end' withArrow>
          <ToolbarToggleButton
            disabled
            className={styles.toggle}
            icon={<PanelLeft />}
            name='panels'
            appearance='transparent'
            value={Prefs.Panels.PRI_SIDEBAR}
          />
        </Tooltip>
        <Tooltip content='Toggle Bottom Panel' relationship='description' positioning='below-start' withArrow>
          <ToolbarToggleButton
            disabled
            className={styles.toggle}
            icon={<PanelBottom />}
            name='panels'
            appearance='transparent'
            value={Prefs.Panels.PANEL}
          />
        </Tooltip>
        <Tooltip content='Toggle Secondary Side Bar' relationship='description' positioning='below-start' withArrow>
          <ToolbarToggleButton
            className={styles.toggle}
            icon={<PanelRight />}
            name='panels'
            appearance='transparent'
            value={Prefs.Panels.SEC_SIDEBAR}
          />
        </Tooltip>
      </ToolbarGroup>
    </Toolbar>
  );
}

export default AppToolbar;
