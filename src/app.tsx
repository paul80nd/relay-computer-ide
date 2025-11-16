import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar/toolbar';
import { AppSideToolbar } from './components/side-toolbar';
import Editor from './components/editor/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { type IPrefState, Prefs, usePreferences } from './hooks/usePreferences';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AppWelcome } from './components/welcome';
import { AppEmulator } from './components/emulator';
import { AppExport } from './components/export';
import { AppExamples } from './components/examples';
import useDebounce from './hooks/useDebounce';
import StatusBar from './components/status-bar/status-bar';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { StatusBarValidation } from './components/status-bar';
import { assemble, type AssemblerResult } from './assembler';
import { type AppCommand, Commands, isEditorCommand, isPanelCommand } from './commands';
import type { IEditorApi } from './components/editor';

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
  const [assembly, setAssembly] = useState<AssemblerResult | undefined>(undefined);

  const [prefState, setPrefState] = usePreferences();

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

        // If primary sidebar is being turned off, clear the section
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

        // Clicking the same radio again -> clear section and close primary sidebar if open
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

        // Selecting a new section -> set it and ensure primary sidebar is open
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

  const onChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) =>
    applyPrefState(name, checkedItems);

  // Current code (updated immediately) plus debounced code (updated no less than 300ms since the last update)
  const [code, setCode] = useState('');
  const debouncedCode = useDebounce(code, 300);
  const onCodeChanged = (code?: string) => setCode(code ?? '');
  useEffect(() => {
    // We want to handle empty string explicitly as "clear"
    if (debouncedCode === undefined) {
      return;
    }

    // Persist the current code even if it's empty
    localStorage.setItem('code', debouncedCode);

    // Treat empty code as "no assembly"
    if (debouncedCode.trim().length === 0) {
      setAssembly(undefined);
      return;
    }

    try {
      const result = assemble(debouncedCode);
      setAssembly(result);
    } catch (err) {
      console.error('Error assembling code', err);
      // In case of failure, clear current assembly to avoid stale output
      setAssembly(undefined);
    }
  }, [debouncedCode]);

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

  const onEditorPositionChanged = (e: monaco.editor.ICursorPositionChangedEvent) => setPosition(e.position);

  const styles = useStyles();

  return (
    <Router>
      <div className={styles.container}>
        <AppToolbar checkedValues={checkedValues} onCheckedValueChange={onChange} onCommand={onCommand} />
        <div className={styles.main}>
          <AppSideToolbar checkedValues={checkedValues} onCheckedValueChange={onChange} />
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
                    onCodeChange={onCodeChanged}
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
        <StatusBar position={position} validation={validation} assembly={assembly} onCommand={onCommand} />
      </div>
    </Router>
  );
};
