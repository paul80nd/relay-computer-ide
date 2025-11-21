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
  BookInformationFilled,
  BookInformationRegular,
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
import {
  type IPreferences,
  mapPrefsToCheckedValues,
  Prefs,
  updatePrefsFromCheckedValues,
} from '../../hooks/usePreferences';
import type { SideToolbarProps } from './types.ts';

const Welcome = bundleIcon(QuestionCircleFilled, QuestionCircleRegular);
const Documentation = bundleIcon(BookInformationFilled, BookInformationRegular);
const Emulator = bundleIcon(DeveloperBoardLightningFilled, DeveloperBoardLightningRegular);
const Examples = bundleIcon(FolderLightningFilled, FolderLightningRegular);
const Export = bundleIcon(ShareFilled, ShareRegular);

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '0.3rem .7rem',
  },
  toggle: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground4,
    padding: '.7rem .8rem',
  },
  icon: { minWidth: '1.9rem', minHeight: '1.9rem' },
});

function SideToolbar(props: SideToolbarProps): JSXElement {
  const { prefs, onPrefsChange } = props;

  // Derive checkedValues from prefs
  const checkedValues = mapPrefsToCheckedValues(prefs, Prefs.Panels);

  // Apply changes from the side toolbar to prefs
  const handleCheckedChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    onPrefsChange(
      (prev: IPreferences): IPreferences => updatePrefsFromCheckedValues(prev, name, checkedItems, Prefs.Panels)
    );
  };

  const styles = useStyles();

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
            className={styles.toggle}
            icon={<Examples className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='examples'
          />
        </Tooltip>
        <Tooltip content='Export Code' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            className={styles.toggle}
            icon={<Export className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='export'
          />
        </Tooltip>
        <Tooltip content='Emulator' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            className={styles.toggle}
            aria-label='Underline'
            icon={<Emulator className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='emulator'
          />
        </Tooltip>
         <Tooltip content='Documentation' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            className={styles.toggle}
            aria-label='Italic'
            icon={<Documentation className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='documentation'
          />
        </Tooltip>
        <Tooltip content='Welcome' relationship='description' positioning='after' withArrow>
          <ToolbarRadioButton
            className={styles.toggle}
            aria-label='Italic'
            icon={<Welcome className={styles.icon} />}
            name='section'
            appearance='transparent'
            value='welcome'
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
