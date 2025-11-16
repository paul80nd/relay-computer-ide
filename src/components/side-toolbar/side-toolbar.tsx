import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import {
  bundleIcon,
  DiagramRegular,
  FolderLightningFilled,
  FolderLightningRegular,
  DeveloperBoardLightningFilled,
  DeveloperBoardLightningRegular,
  ShareFilled,
  ShareRegular,
  QuestionCircleRegular,
  QuestionCircleFilled,
} from '@fluentui/react-icons';
import {
  Toolbar,
  tokens,
  Tooltip,
  ToolbarToggleButton,
  makeStyles,
  ToolbarGroup,
  ToolbarRadioButton,
} from '@fluentui/react-components';
import { type IPreferences, mapPrefsToCheckedValues, Prefs } from '../../hooks/usePreferences';
import { useNavigate } from 'react-router-dom';
import type { SideToolbarProps } from './types.ts';

const BookInformation = bundleIcon(QuestionCircleFilled, QuestionCircleRegular);
const Emulator = bundleIcon(DeveloperBoardLightningFilled, DeveloperBoardLightningRegular);
const Examples = bundleIcon(FolderLightningFilled, FolderLightningRegular);
const Export = bundleIcon(ShareFilled, ShareRegular);

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  toggle: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground4,
    padding: '.65rem 1.1rem',
  },
  icon: { minWidth: '2rem', minHeight: '2rem' },
});

function SideToolbar(props: SideToolbarProps): JSXElement {
  const { prefs, onPrefsChange } = props;

  // Derive checkedValues from prefs
  const checkedValues = mapPrefsToCheckedValues(prefs, Prefs.Panels);

  // Apply changes from side toolbar to prefs
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

      return next;
    });
  };

  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Toolbar
      aria-label='Default'
      className={styles.toolbar}
      vertical
      onCheckedValueChange={handleCheckedChange}
      checkedValues={checkedValues}
    >
      <ToolbarGroup>
        <Tooltip content='Code Examples' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            disabled
            className={styles.toggle}
            icon={<Examples className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='examples'
            onClick={() => navigate('/examples')}
          />
        </Tooltip>
        <Tooltip content='Export Code' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            disabled
            className={styles.toggle}
            icon={<Export className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='export'
            onClick={() => navigate('/export')}
          />
        </Tooltip>
        <Tooltip content='Emulator' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            disabled
            className={styles.toggle}
            aria-label='Underline'
            icon={<Emulator className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='emulator'
            onClick={() => navigate('/emulator')}
          />
        </Tooltip>
        <Tooltip content='Welcome / Help' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            disabled
            className={styles.toggle}
            aria-label='Italic'
            icon={<BookInformation className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='welcome'
            onClick={() => navigate('/welcome')}
          />
        </Tooltip>
      </ToolbarGroup>
      <ToolbarGroup role='presentation'>
        <Tooltip content='Toggle Assembler Output' relationship='description' positioning='after' withArrow>
          <ToolbarToggleButton
            className={styles.toggle}
            icon={<DiagramRegular className={styles.icon} />}
            name='panels'
            appearance='transparent'
            value={Prefs.Panels.SEC_SIDEBAR}
          />
        </Tooltip>
      </ToolbarGroup>
    </Toolbar>
  );
}

export default SideToolbar;
