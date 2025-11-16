import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar/toolbar';
import { AppSideToolbar } from './components/side-toolbar';
import Editor from './components/editor/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Prefs, usePreferences } from './hooks/usePreferences';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  const isLeftPanelVisible = prefState.panels.includes(Prefs.Panels.PRI_SIDEBAR);
  const isRightPanelVisible = prefState.panels.includes(Prefs.Panels.SEC_SIDEBAR);
  const isBottomPanelVisible = prefState.panels.includes(Prefs.Panels.PANEL);

  const applyPrefState = (name: string, checkedItems: string[]) => {
    setPrefState((s: Record<string, string[]>) => {
      if (name === 'panels' && !checkedItems.includes(Prefs.Panels.PRI_SIDEBAR)) {
        // If primary sidebar closing clear section
        s = { ...s, section: [] };
      }
      if (name === 'section') {
        // Clear section if clicked the same radio
        if (s.section[0] == checkedItems[0]) {
          checkedItems = [];
          if (s.panels.includes(Prefs.Panels.PRI_SIDEBAR)) {
            // Close the sidebar if already open
            s = { ...s, panels: s.panels.filter(v => v !== Prefs.Panels.PRI_SIDEBAR) };
          }
        } else if (!s.panels.includes(Prefs.Panels.PRI_SIDEBAR)) {
          // Open the sidebar if not already open
          s.panels.push(Prefs.Panels.PRI_SIDEBAR);
        }
      }
      return { ...s, [name]: checkedItems };
    });
  };

  const onChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) =>
    applyPrefState(name, checkedItems);

  // Current code (updated immediately) plus debounced code (updated no less than 300ms since the last update)
  const [code, setCode] = useState('');
  const debouncedCode = useDebounce(code, 300);
  const onCodeChanged = (code?: string) => setCode(code ?? '');
  useEffect(() => {
    if (debouncedCode) {
      // Store code
      localStorage.setItem('code', debouncedCode);

      // Assemble
      const result = assemble(debouncedCode);
      setAssembly(result);
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
      const p = prefState.panels as string[];
      switch (command) {
        case Commands.PANEL_OUTPUT_SHOW:
          if (!p.includes(Prefs.Panels.SEC_SIDEBAR)) {
            const np = [...p, Prefs.Panels.SEC_SIDEBAR];
            applyPrefState('panels', np);
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
        <AppToolbar checkedValues={prefState} onCheckedValueChange={onChange} onCommand={onCommand} />
        <div className={styles.main}>
          <AppSideToolbar checkedValues={prefState} onCheckedValueChange={onChange} />
          <PanelGroup direction='horizontal' autoSaveId='persistence'>
            {isLeftPanelVisible && (
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
                {isBottomPanelVisible && (
                  <>
                    <PanelResizeHandle className={styles.resizeHandle} />
                    <Panel id='bottom' order={2} defaultSize={25} minSize={25} className={styles.panel}></Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>
            {isRightPanelVisible && (
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
