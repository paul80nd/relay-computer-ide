import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar/toolbar';
import { AppSideToolbar } from './components/side-toolbar';
import Editor from './components/editor/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Prefs } from './prefs';
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
  // Read the initial prefs from localStorage
  const initialPrefs = () => {
    const savedState = localStorage.getItem('prefs');
    return savedState ? JSON.parse(savedState) : { panels: [Prefs.Panels.SEC_SIDEBAR] };
  };
  const [prefState, setPrefState] = useState(initialPrefs);
  const [position, setPosition] = useState<monaco.IPosition | undefined>(undefined);
  const [validation, setValidation] = useState<StatusBarValidation>({ warnings: 0, errors: 0 });
  const [assembly, setAssembly] = useState<AssemblerResult | undefined>(undefined);

  // Update localStorage whenever prefState changes
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(prefState));
  }, [prefState]);

  const isLeftPanelVisible = prefState.panels.includes(Prefs.Panels.PRI_SIDEBAR);
  const isRightPanelVisible = prefState.panels.includes(Prefs.Panels.SEC_SIDEBAR);
  const isBottomPanelVisible = prefState.panels.includes(Prefs.Panels.PANEL);

  const onChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    setPrefState((s: Record<string, string[]>) => {
      if (name === 'panels' && !checkedItems.includes(Prefs.Panels.PRI_SIDEBAR)) {
        // If primary sidebar closing clear section
        s = { ...s, section: [] };
      }
      if (name === 'section') {
        // Clear section if clicked same radio
        if (s.section[0] == checkedItems[0]) {
          checkedItems = [];
          if (s.panels.includes(Prefs.Panels.PRI_SIDEBAR)) {
            // Close sidebar if already open
            s = { ...s, panels: s.panels.filter(v => v !== Prefs.Panels.PRI_SIDEBAR) };
          }
        } else if (!s.panels.includes(Prefs.Panels.PRI_SIDEBAR)) {
          // Open sidebar if not already open
          s.panels.push(Prefs.Panels.PRI_SIDEBAR);
        }
      }
      return { ...s, [name]: checkedItems };
    });
  };

  // Current code (updated immediately) plus debounced code (updated no less than 300ms since last update)
  const [code, setCode] = useState('');
  const debouncedCode = useDebounce(code, 300);
  const onEditorChanged = (value?: string) => setCode(value ?? '');
  useEffect(() => {
    if (debouncedCode) {
      // Store code
      localStorage.setItem('code', debouncedCode);

      // Assemble
      const result = assemble(debouncedCode);
      setAssembly(result);
    }
  }, [debouncedCode]);

  // Capture reference to editor for passing commands
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);
  const onEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => (editorRef.current = editor);
  const onCommand = (command: string) => {
    console.log('Handling command', command);
    editorRef.current?.focus();
    editorRef.current?.getAction(command)?.run();
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
                    onChange={onEditorChanged}
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
