import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar';
import SideToolbar from './components/side-toolbar';
import Editor from './components/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { type IPrefState, Prefs, usePreferences } from './hooks/usePreferences';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AppWelcome } from './components/welcome';
import { AppEmulator } from './components/emulator';
import { AppExport } from './components/export';
import { AppExamples } from './components/examples';
import StatusBar from './components/status-bar';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { StatusBarValidation } from './components/status-bar';
import { type AppCommand, Commands, isEditorCommand, isPanelCommand } from './commands';
import type { IEditorApi } from './components/editor';
import { useAssembler } from './hooks/useAssembler.ts';
import { useCodeStorage } from './hooks/useCodeStorage.ts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    gap: '2px',
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: '1',
    gap: '2px',
  },
  editor: {
    flexGrow: 1,
    minWidth: 0,
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  resizeHandle: {
    flexBasis: '2px',
  },
});

export const App = (): JSXElement => {
  const [position, setPosition] = useState<monaco.IPosition | undefined>(undefined);
  const [validation, setValidation] = useState<StatusBarValidation>({ warnings: 0, errors: 0 });

  const [prefState, setPrefState] = usePreferences();
  const autoSave = prefState.autoSave ?? true;

  // Source code + persistence
  const { code, onCodeChange, save, dirty } = useCodeStorage({
    storageKey: 'code',
    autoSave,
    defaultCode: [
      '; *****************************************************',
      ';  Welcome to Relay Computer Assembly (RCASM)',
      ';',
      ';  Start typing your program below or open an example',
      ';  from the examples folder top left',
      '; *****************************************************',
      '',
      '',
    ].join('\n'),
  });

  // Debounced assembly from the current code
  const { assembly } = useAssembler({ code, debounceMs: 300 });

  // Warn if navigating away with unsaved changes when autoSave is off
  useEffect(() => {
    if (autoSave || !dirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Some browsers still require setting returnValue for the dialog to appear:
      (event as any).returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autoSave, dirty]);

  // Map typed prefs -> Fluent UI checkedValues
  const checkedValues = {
    panels: [
      prefState.panels.primary ? Prefs.Panels.PRI_SIDEBAR : null,
      prefState.panels.secondary ? Prefs.Panels.SEC_SIDEBAR : null,
      prefState.panels.bottom ? Prefs.Panels.PANEL : null,
    ].filter(Boolean) as string[],
    section: prefState.section ? [prefState.section] : [],
  };

  const applyPrefState = (name: string, checkedItems: string[]) => {
    setPrefState((prev: IPrefState): IPrefState => {
      let next = { ...prev };

      if (name === 'panels') {
        // Map checkedItems -> boolean flags
        const primaryChecked = checkedItems.includes(Prefs.Panels.PRI_SIDEBAR);
        const secondaryChecked = checkedItems.includes(Prefs.Panels.SEC_SIDEBAR);
        const bottomChecked = checkedItems.includes(Prefs.Panels.PANEL);

        // If the primary sidebar is being turned off, clear the section
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

        // Clicking the same radio again -> clear the section and close the primary sidebar if open
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

        // No section provided, just leave as is
        return next;
      }

      // Any other groups can be handled here later if needed
      return next;
    });
  };

  const onChange = (name: string, checkedItems: string[]) => applyPrefState(name, checkedItems);

  const setAutoSave = (enabled: boolean) => setPrefState(prev => ({ ...prev, autoSave: enabled }));

  // Capture reference to the editor for passing commands
  const editorRef = useRef<IEditorApi | undefined>(undefined);
  const onEditorMounted = (api: IEditorApi) => (editorRef.current = api);
  const onCommand = (command: AppCommand) => {
    console.log('Handling command', command);

    if (isEditorCommand(command)) {
      editorRef.current?.runCommand(command);
      return;
    }

    if (isPanelCommand(command)) {
      switch (command) {
        case Commands.PANEL_OUTPUT_SHOW:
          if (!prefState.panels.secondary) {
            setPrefState(lps => ({
              ...lps,
              panels: {
                ...lps.panels,
                secondary: true,
              },
            }));
          }
          break;
        default:
          console.warn('Unhandled panel command', command);
          break;
      }
    }

    switch (command) {
      case Commands.APP_SAVE:
        save();
        break;
      default:
        console.warn('Unhandled app command', command);
        break;
    }
  };

  const onEditorValidated = (markers: monaco.editor.IMarker[]) => {
    const v: StatusBarValidation = { errors: 0, warnings: 0 };
    markers.forEach(m => {
      switch (m.severity) {
        case monaco.MarkerSeverity.Error:
          v.errors++;
          break;
        case monaco.MarkerSeverity.Warning:
          v.warnings++;
          break;
      }
    });
    setValidation(v);
  };

  // useEffect(() => {
  //   const handler = (event: KeyboardEvent) => {
  //     const isMac = navigator.platform.toLowerCase().includes('mac');
  //     const isSaveKey =
  //       (isMac && event.metaKey && event.key.toLowerCase() === 's') ||
  //       (!isMac && event.ctrlKey && event.key.toLowerCase() === 's');
  //
  //     if (!isSaveKey) return;
  //
  //     event.preventDefault();
  //     onCommand(Commands.APP_SAVE);
  //   };
  //
  //   window.addEventListener('keydown', handler);
  //   return () => window.removeEventListener('keydown', handler);
  // }, [onCommand]);

  const onEditorPositionChanged = (e: monaco.editor.ICursorPositionChangedEvent) => setPosition(e.position);

  const styles = useStyles();

  return (
    <Router>
      <div className={styles.container}>
        <AppToolbar
          checkedValues={checkedValues}
          onCheckedValueChange={onChange}
          onCommand={onCommand}
          autoSave={autoSave}
          dirty={dirty}
          onToggleAutoSave={setAutoSave}
        />
        <div className={styles.main}>
          <SideToolbar checkedValues={checkedValues} onCheckedValueChange={onChange} />
          <PanelGroup direction='horizontal' autoSaveId='persistence'>
            {prefState.panels.primary && (
              <>
                <Panel id='left' defaultSize={20} minSize={20} className={styles.panel} order={1}>
                  <Routes>
                    <Route path='/examples' element={<AppExamples />} />
                    <Route path='/export' element={<AppExport />} />
                    <Route path='/emulator' element={<AppEmulator />} />
                    <Route path='/welcome' element={<AppWelcome />} />
                    <Route path='/' element={<Navigate to='/welcome' replace />} />
                  </Routes>
                </Panel>
                <PanelResizeHandle className={styles.resizeHandle} />
              </>
            )}
            <Panel order={2} id='middle'>
              <PanelGroup direction='vertical' autoSaveId='persistence'>
                <Panel id='editor' minSize={33} order={1}>
                  <Editor
                    initialCode={code}
                    onCodeChange={onCodeChange}
                    onMount={onEditorMounted}
                    onValidate={onEditorValidated}
                    onPositionChange={onEditorPositionChanged}
                  />
                </Panel>
                {prefState.panels.bottom && (
                  <>
                    <PanelResizeHandle className={styles.resizeHandle} />
                    <Panel id='bottom' order={2} defaultSize={25} minSize={25} className={styles.panel}></Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>
            {prefState.panels.secondary && (
              <>
                <PanelResizeHandle className={styles.resizeHandle} />
                <Panel id='right' defaultSize={20} minSize={20} className={styles.panel} order={3}>
                  <Output assembly={assembly} />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
        <StatusBar
          position={position}
          validation={validation}
          assembly={assembly}
          onCommand={onCommand}
          autoSave={autoSave}
          dirty={dirty}
        />
      </div>
    </Router>
  );
};
