import type { JSXElement } from '@fluentui/react-components';
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
import type { ToolbarProps } from '@fluentui/react-components';
import { Prefs } from '../hooks/usePreferences';
import { useNavigate } from 'react-router-dom';

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

export const AppSideToolbar = (props: Partial<ToolbarProps>): JSXElement => {
  const styles = useStyles();
  const navigate = useNavigate();
  return (
    <Toolbar aria-label='Default' className={styles.toolbar} vertical {...props}>
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
};
