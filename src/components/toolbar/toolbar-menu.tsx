import type { JSXElement, MenuProps } from '@fluentui/react-components';
import {
  CutRegular,
  ClipboardPasteRegular,
  CopyRegular,
} from '@fluentui/react-icons';
import {
  tokens,
  makeStyles,
  Menu,
  MenuTrigger,
  ToolbarButton,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuItemCheckbox,
  MenuGroup,
  MenuGroupHeader,
  MenuItemLink,
  MenuItemRadio,
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { Prefs } from '../../hooks/usePreferences';
import { useNavigate } from 'react-router-dom';
import type { AppToolbarProps } from './types';
import { Commands } from '../../commands';

const useStyles = makeStyles({
  menuTrigger: {
    padding: '0 .5rem',
    minWidth: 0,
    fontWeight: tokens.fontWeightRegular,
  },
});

function AppToolbarMenu(props: AppToolbarProps): JSXElement {
  const styles = useStyles();
  const navigate = useNavigate();

  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMac(userAgent.includes('mac'));
  }, []);

  const [checkedValues, setCheckedValues] = useState<Record<string, string[]>>({
    save: ['auto'],
    view: ['word-wrap', 'secondary-side-bar', 'status'],
  });

  const onChange: MenuProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    setCheckedValues(s => {
      return s ? { ...s, [name]: checkedItems } : { [name]: checkedItems };
    });
  };

  const doCommand = (command: string): void => props.onCommand && props.onCommand(command);

  return (
    <>
      <Menu hasCheckmarks checkedValues={checkedValues} onCheckedValueChange={onChange}>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent' disabled>
            File
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='Ctrl+N'>
              New…
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+O'>
              Open…
            </MenuItem>
            <MenuItem disabled>Open from Examples…</MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+S'>
              Save
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+S'>
              Save As…
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+X'>
              Export…
            </MenuItem>
            <MenuDivider />
            <MenuItemCheckbox disabled name='save' value='auto'>
              Auto Save
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasIcons>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent' disabled>
            Edit
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='Ctrl+Z'>
              Undo
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Y'>
              Redo
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled icon={<CutRegular />} secondaryContent='Ctrl+X'>
              Cut
            </MenuItem>
            <MenuItem disabled icon={<CopyRegular />} secondaryContent='Ctrl+C'>
              Copy
            </MenuItem>
            <MenuItem disabled icon={<ClipboardPasteRegular />} secondaryContent='Ctrl+V'>
              Paste
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+F'>
              Find
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+H'>
              Replace
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+/'>
              Toggle Line Comment
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasIcons>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent' disabled>
            Selection
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='Ctrl+A'>
              Select All
            </MenuItem>
            <MenuItem disabled secondaryContent='Shift+Alt+RightArrow'>
              Expand Selection
            </MenuItem>
            <MenuItem disabled secondaryContent='Shift+Alt+LeftArrow'>
              Shrink Selection
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled>Duplicate Selection </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasCheckmarks {...props}>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            View
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='Ctrl+Shift+P'>
              Command Palette…
            </MenuItem>
            <MenuDivider />
            <Menu hasCheckmarks {...props}>
              <MenuTrigger disableButtonEnhancement>
                <MenuItem>Appearance</MenuItem>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem secondaryContent='F11' disabled>
                    Full Screen
                  </MenuItem>
                  <MenuDivider />
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.PRI_SIDEBAR} disabled>
                    Primary Side Bar
                  </MenuItemCheckbox>
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.SEC_SIDEBAR}>
                    Secondary Side Bar
                  </MenuItemCheckbox>
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.PANEL} disabled>
                    Panel
                  </MenuItemCheckbox>
                  <MenuDivider />
                  <MenuItem disabled>Move Primary Side Bar Right</MenuItem>
                  <MenuDivider />
                  <MenuItemCheckbox disabled name='view' value='mini-map'>
                    Minimap
                  </MenuItemCheckbox>
                </MenuList>
              </MenuPopover>
            </Menu>
            <MenuDivider />
            <MenuItemRadio
              disabled
              name='section'
              value='examples'
              secondaryContent='Ctrl+Shift+E'
              onClick={() => navigate('/examples')}
            >
              Examples
            </MenuItemRadio>
            <MenuItemRadio
              disabled
              name='section'
              value='export'
              secondaryContent='Ctrl+Shift+X'
              onClick={() => navigate('/export')}
            >
              Export
            </MenuItemRadio>
            <MenuItemRadio
              disabled
              name='section'
              value='emulator'
              secondaryContent='Ctrl+Shift+M'
              onClick={() => navigate('/emulator')}
            >
              Emulator
            </MenuItemRadio>
            <MenuItemRadio
              disabled
              name='section'
              value='welcome'
              secondaryContent='Ctrl+Shift+W'
              onClick={() => navigate('/welcome')}
            >
              Welcome
            </MenuItemRadio>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+Shift+D'>
              Documentation
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+M'>
              Problems
            </MenuItem>
            <MenuItemCheckbox name='panels' value={Prefs.Panels.SEC_SIDEBAR} secondaryContent='Ctrl+Shift+U' disabled>
              Output
            </MenuItemCheckbox>
            <MenuDivider />
            <MenuItemCheckbox disabled name='view' value='word-wrap' secondaryContent='Alt+Z'>
              Word Wrap
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasCheckmarks>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            Go
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='F12'>
              Go to Definition
            </MenuItem>
            <MenuItem disabled>Go to Declaration</MenuItem>
            <MenuItem disabled>Go to Type Definition</MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+F12'>
              Go to Implementations
            </MenuItem>
            <MenuItem disabled secondaryContent='Shift+F12'>
              Go to References
            </MenuItem>
            <MenuDivider />
            <MenuItem secondaryContent={isMac ? '^G' : 'Ctrl+G'} onClick={() => doCommand(Commands.EDITOR_GOTOLINE)}>
              Go to Line/Column…
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+\'>
              Go to Bracket
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='F8'>
              Next Problem
            </MenuItem>
            <MenuItem disabled secondaryContent='Shift+F8'>
              Previous Problem
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasCheckmarks>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent' disabled>
            Run
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='F5'>
              Start Debugging
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+F5'>
              Run Without Debugging
            </MenuItem>
            <MenuItem disabled secondaryContent='Shift+F5'>
              Stop Debugging
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+F5'>
              Restart Debugging
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='F10'>
              Step Over
            </MenuItem>
            <MenuItem disabled secondaryContent='F5'>
              Continue
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled secondaryContent='F9'>
              Toggle Breakpoint
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled>Enable All Breakpoints</MenuItem>
            <MenuItem disabled>Disable All Breakpoints</MenuItem>
            <MenuItem disabled>Remove All Breakpoints</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasCheckmarks>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent' disabled>
            Help
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled>Welcome</MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+P'>
              Show All Commands
            </MenuItem>
            <MenuItem disabled>Documentation</MenuItem>
            <MenuDivider />
            <MenuGroup>
              <MenuGroupHeader>Related Sites</MenuGroupHeader>
              <MenuItemLink disabled href='https://www.microsoft.com' target='_blank'>
                Blog
              </MenuItemLink>
              <MenuItemLink disabled href='https://www.microsoft.com' target='_blank'>
                Simulator
              </MenuItemLink>
              <MenuItemLink disabled href='https://www.microsoft.com' target='_blank'>
                GitHub Source
              </MenuItemLink>
            </MenuGroup>
            <MenuDivider />
            <MenuItem disabled>About</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  );
}

export default AppToolbarMenu;
