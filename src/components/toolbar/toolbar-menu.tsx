import { type JSXElement, type MenuProps, type ToolbarProps } from '@fluentui/react-components';
import { CutRegular, ClipboardPasteRegular, CopyRegular } from '@fluentui/react-icons';
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
import { useEffect, useMemo, useState } from 'react';
import { Prefs, type SectionType } from '../../hooks/usePreferences';
import type { AppToolbarProps } from './types';
import { appCommands, editorCommands, panelCommands } from '../../commands';
import { useCommandBus } from '../../hooks/useCommandBus.ts';
import { Links } from '../../links.ts';

const useStyles = makeStyles({
  menuTrigger: {
    padding: '0 .5rem',
    minWidth: 0,
    fontWeight: tokens.fontWeightRegular,
  },
});

// Note: We reuse AppToolbarProps but only rely on:
// - checkedValues, onCheckedValueChange (injected by AppToolbar)
// - autoSave, dirty, onToggleAutoSave, onCommand
function AppToolbarMenu(
  props: AppToolbarProps & {
    checkedValues: Record<string, string[]>;
    onCheckedValueChange: ToolbarProps['onCheckedValueChange'];
  }
): JSXElement {
  const styles = useStyles();
  const { execute } = useCommandBus();

  // Platform detection – derived once
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('mac'),
    []
  );

  const autoSaveOn = props.prefs.autoSave ?? true;

  // Local state for File menu (save group)
  const [fileMenuCheckedValues, setFileMenuCheckedValues] = useState<Record<string, string[]>>({
    save: autoSaveOn ? ['auto'] : [],
  });

  // Sync File menu 'save' group from prefState.autoSave
  useEffect(() => {
    setFileMenuCheckedValues(prev => ({
      ...prev,
      save: autoSaveOn ? ['auto'] : [],
    }));
  }, [autoSaveOn]);

  const handleFileMenuCheckedChange: MenuProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    setFileMenuCheckedValues(prev => ({
      ...prev,
      [name]: checkedItems,
    }));

    if (name === 'save') {
      const autoEnabled = checkedItems.includes('auto');
      props.onPrefsChange(prev => ({
        ...prev,
        autoSave: autoEnabled,
      }));
    }
  };

  const handleViewCheckedChange: ToolbarProps['onCheckedValueChange'] = (e, data) => {
    props.onCheckedValueChange?.(e, data);
  };

  const setSection = (section: SectionType) => execute(panelCommands.showSection(section));
  const doMonacoAction = (action: string) => execute(editorCommands.doMonacoAction(action));
  const doMonacoKeyboard = (id: string) => execute(editorCommands.doMonacoKeyboardAction(id));

  return (
    <>
      <Menu hasCheckmarks checkedValues={fileMenuCheckedValues} onCheckedValueChange={handleFileMenuCheckedChange}>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
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
            <MenuItem onClick={() => setSection('examples')}>Open from Examples…</MenuItem>
            <MenuDivider />
            <MenuItem
              secondaryContent={isMac ? '⌘ S' : 'Ctrl+S'}
              disabled={autoSaveOn || !props.dirty}
              onClick={() => execute(appCommands.save())}
            >
              Save
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+S'>
              Save As…
            </MenuItem>
            <MenuItem disabled secondaryContent='Ctrl+Shift+X'>
              Export…
            </MenuItem>
            <MenuDivider />
            <MenuItemCheckbox name='save' value='auto'>
              Auto Save
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasIcons>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            Edit
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => doMonacoKeyboard('undo')} secondaryContent={isMac ? '⌘ Z' : 'Ctrl+Z'}>
              Undo
            </MenuItem>
            <MenuItem onClick={() => doMonacoKeyboard('redo')} secondaryContent={isMac ? '⇧ ⌘ Z' : 'Ctrl+Y'}>
              Redo
            </MenuItem>
            <MenuDivider />
            <MenuItem disabled icon={<CutRegular />} secondaryContent='Ctrl+X'>
              Cut
            </MenuItem>
            <MenuItem disabled icon={<CopyRegular />} secondaryContent='Ctrl+C'>
              Copy
            </MenuItem>
            <MenuItem
              onClick={() => doMonacoKeyboard('paste')}
              icon={<ClipboardPasteRegular />}
              secondaryContent='Ctrl+V'
            >
              Paste
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => doMonacoAction('actions.find')} secondaryContent={isMac ? '⌘ F' : 'Ctrl+F'}>
              Find
            </MenuItem>
            <MenuItem
              onClick={() => doMonacoAction('editor.action.startFindReplaceAction')}
              secondaryContent={isMac ? '⌥ ⌘ F' : 'Ctrl+H'}
            >
              Replace
            </MenuItem>
            <MenuDivider />
            <MenuItem
              secondaryContent={isMac ? '⌘ /' : 'Ctrl+/'}
              onClick={() => doMonacoAction('editor.action.commentLine')}
            >
              Toggle Line Comment
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu hasIcons>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            Selection
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem disabled secondaryContent='Ctrl+A'>
              Select All
            </MenuItem>
            <MenuItem
              secondaryContent={isMac ? '⇧ ⌃ ⌘ →' : 'Shift+Alt+RightArrow'}
              onClick={() => doMonacoAction('editor.action.smartSelect.expand')}
            >
              Expand Selection
            </MenuItem>
            <MenuItem
              secondaryContent={isMac ? '⇧ ⌃ ⌘ ←' : 'Shift+Alt+LeftArrow'}
              onClick={() => doMonacoAction('editor.action.smartSelect.shrink')}
            >
              Shrink Selection
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => doMonacoAction('editor.action.duplicateSelection')}>Duplicate Selection</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu hasCheckmarks checkedValues={props.checkedValues} onCheckedValueChange={handleViewCheckedChange}>
        <MenuTrigger>
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            View
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem secondaryContent='F1' onClick={() => doMonacoAction('editor.action.quickCommand')}>
              Command Palette…
            </MenuItem>
            <MenuDivider />
            <Menu hasCheckmarks checkedValues={props.checkedValues} onCheckedValueChange={handleViewCheckedChange}>
              <MenuTrigger disableButtonEnhancement>
                <MenuItem>Appearance</MenuItem>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.PRI_SIDEBAR}>
                    Primary Side Bar
                  </MenuItemCheckbox>
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.SEC_SIDEBAR}>
                    Secondary Side Bar
                  </MenuItemCheckbox>
                  <MenuItemCheckbox name='panels' value={Prefs.Panels.PANEL} disabled>
                    Panel
                  </MenuItemCheckbox>
                  <MenuDivider />
                  <MenuItemCheckbox disabled name='view' value='mini-map'>
                    Minimap
                  </MenuItemCheckbox>
                </MenuList>
              </MenuPopover>
            </Menu>
            <MenuDivider />
            <MenuItemRadio name='section' value='examples' secondaryContent={isMac ? '⇧ ⌘ E' : 'Ctrl+Shift+E'}>
              Examples
            </MenuItemRadio>
            <MenuItemRadio disabled name='section' value='export' secondaryContent={isMac ? '⇧ ⌘ X' : 'Ctrl+Shift+X'}>
              Export
            </MenuItemRadio>
            <MenuItemRadio disabled name='section' value='emulator' secondaryContent={isMac ? '⇧ ⌘ Y' : 'Ctrl+Shift+Y'}>
              Emulator
            </MenuItemRadio>
            <MenuItemRadio name='section' value='documentation' secondaryContent={isMac ? '⇧ ⌘ D' : 'Ctrl+Shift+D'}>
              Documentation
            </MenuItemRadio>
            <MenuItemRadio name='section' value='welcome' secondaryContent={isMac ? '⇧ ⌘ W' : 'Ctrl+Shift+W'}>
              Welcome
            </MenuItemRadio>
            <MenuDivider />
            <MenuItem disabled secondaryContent='Ctrl+Shift+M'>
              Problems
            </MenuItem>
            <MenuItemCheckbox name='panels' value={Prefs.Panels.SEC_SIDEBAR}>
              Output
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
            <MenuItem secondaryContent={isMac ? '⌃ G' : 'Ctrl+G'} onClick={() => execute(editorCommands.gotoLine())}>
              Go to Line/Column…
            </MenuItem>
            <MenuItem
              secondaryContent={isMac ? '⇧ ⌘ O' : 'Shift+Ctrl+O'}
              onClick={() => doMonacoAction('editor.action.quickOutline')}
            >
              Go to Symbol…
            </MenuItem>
            <MenuDivider />
            <MenuItem secondaryContent='F8' onClick={() => doMonacoAction('editor.action.marker.next')}>
              Next Problem
            </MenuItem>
            <MenuItem
              secondaryContent={isMac ? '⇧ F8' : 'Shift+F8'}
              onClick={() => doMonacoAction('editor.action.marker.prev')}
            >
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
          <ToolbarButton className={styles.menuTrigger} appearance='transparent'>
            Help
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>Getting Started</MenuGroupHeader>
              <MenuItem onClick={() => setSection('welcome')}>Welcome</MenuItem>
              <MenuItem secondaryContent='F1' onClick={() => doMonacoAction('editor.action.quickCommand')}>
                Show All Commands
              </MenuItem>
              <MenuItem onClick={() => setSection('documentation')}>Documentation</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuGroupHeader>Related Sites</MenuGroupHeader>
              <MenuItemLink href={Links.Blog} target='_blank'>
                Blog
              </MenuItemLink>
              <MenuItemLink href={Links.Simulator} target='_blank'>
                Simulator
              </MenuItemLink>
              <MenuItemLink href={Links.GitHubSource} target='_blank'>
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
