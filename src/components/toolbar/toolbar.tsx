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
import {
  type IPreferences,
  mapPrefsToCheckedValues,
  Prefs,
  updatePrefsFromCheckedValues,
} from '../../hooks/usePreferences';
import type { AppToolbarProps } from './types';
import AppToolbarMenu from './toolbar-menu';

const PanelLeft = bundleIcon(PanelLeftFilled, PanelLeftRegular);
const PanelRight = bundleIcon(PanelRightFilled, PanelRightRegular);
const PanelBottom = bundleIcon(PanelBottomFilled, PanelBottomRegular);

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '0 .5rem 0 1.2rem',
  },
  toggle: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground4,
  },
  dirtyIndicator: {
    color: tokens.colorStatusWarningForeground1,
  },
});

function AppToolbar(props: AppToolbarProps): JSXElement {
  const styles = useStyles();
  const { prefs, onPrefsChange } = props;

  // Map prefs -> Fluent UI checkedValues
  const checkedValues = mapPrefsToCheckedValues(prefs, Prefs.Panels);
  const autoSaveOn = prefs.autoSave ?? true;

  // Handle toolbar/menus changing panels/section
  const handleCheckedChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    onPrefsChange(
      (prev: IPreferences): IPreferences => updatePrefsFromCheckedValues(prev, name, checkedItems, Prefs.Panels),
    );
  };

  return (
    <Toolbar
      checkedValues={checkedValues}
      onCheckedValueChange={handleCheckedChange}
      aria-label='Default'
      className={styles.toolbar}
      size='small'
    >
      <ToolbarGroup role='presentation'>
        <Code20Color style={{ marginRight: '.5rem' }} />
        <AppToolbarMenu
          prefs={prefs}
          onPrefsChange={onPrefsChange}
          checkedValues={checkedValues}
          onCheckedValueChange={handleCheckedChange}
          dirty={props.dirty}
        />
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        {!autoSaveOn && props.dirty && (
          <Text size={200} className={styles.dirtyIndicator}>
            ◀ Unsaved changes ▶
          </Text>
        )}
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        <Text weight='semibold' size={200} style={{ marginRight: '1rem', color: tokens.colorBrandForeground2 }}>
          Relay Computer IDE
        </Text>
        <Tooltip content='Toggle Primary Side Bar' relationship='description' positioning='below-end' withArrow>
          <ToolbarToggleButton
            className={styles.toggle}
            icon={<PanelLeft />}
            name='panels'
            appearance='transparent'
            value={Prefs.Panels.PRI_SIDEBAR}
          />
        </Tooltip>
        <Tooltip content='Toggle Bottom Panel' relationship='description' positioning='below-start' withArrow>
          <ToolbarToggleButton
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
