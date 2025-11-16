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
import { type IPreferences, mapPrefsToCheckedValues, Prefs } from '../../hooks/usePreferences';
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
  const { prefs, onPrefsChange } = props;

  // Map prefs -> Fluent UI checkedValues
  const checkedValues = mapPrefsToCheckedValues(prefs, Prefs.Panels);
  const autoSaveOn = prefs.autoSave ?? true;

  // Handle toolbar/menus changing panels/section
  const handleCheckedChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    onPrefsChange((prev: IPreferences): IPreferences => {
      let next = { ...prev };

      if (name === 'panels') {
        const primaryChecked = checkedItems.includes(Prefs.Panels.PRI_SIDEBAR);
        const secondaryChecked = checkedItems.includes(Prefs.Panels.SEC_SIDEBAR);
        const bottomChecked = checkedItems.includes(Prefs.Panels.PANEL);

        const section = primaryChecked ? next.section : undefined;

        next = {
          ...next,
          panels: {
            primary: primaryChecked,
            secondary: secondaryChecked,
            bottom: bottomChecked,
          },
          section,
        };

        return next;
      }

      if (name === 'section') {
        const [newSection] = checkedItems;
        const currentSection = next.section;

        // Clicking the same radio again -> clear section and close the primary sidebar
        if (currentSection && newSection === currentSection) {
          return {
            ...next,
            section: undefined,
            panels: {
              ...next.panels,
              primary: false,
            },
          };
        }

        // Selecting a new section -> set it and ensure the primary sidebar is open
        if (newSection) {
          return {
            ...next,
            section: newSection,
            panels: {
              ...next.panels,
              primary: true,
            },
          };
        }

        return next;
      }

      // Unknown group: no-op
      return next;
    });
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
        <Code20Color />
        <AppToolbarMenu
          prefs={prefs}
          onPrefsChange={onPrefsChange}
          checkedValues={checkedValues}
          onCheckedValueChange={handleCheckedChange}
          dirty={props.dirty}
          onCommand={props.onCommand}
        />
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        {!autoSaveOn && props.dirty && (
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
