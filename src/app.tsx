import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar';
import SideToolbar from './components/side-toolbar';
import Editor from './components/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { usePreferences } from './hooks/usePreferences';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import  Welcome from './components/welcome';
import { AppEmulator } from './components/emulator';
import { AppExport } from './components/export';
import Examples from './components/examples';
import StatusBar from './components/status-bar';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { StatusBarValidation } from './components/status-bar';
import { appCommands, editorCommands, outputCommands } from './commands';
import type { IEditorApi } from './components/editor';
import { useAssembler } from './hooks/useAssembler.ts';
import { useCodeStorage } from './hooks/useCodeStorage.ts';
import { CommandBusProvider, useCreateCommandBus } from './hooks/useCommandBus.ts';
import { exchangeAddressForSourceLine, exchangeSourceLineNumberForAddress } from './assembler.ts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    gap: '2px',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: '1',
    minHeight: 0,
    gap: '2px',
  },
  editor: {
    flexGrow: 1,
    minWidth: 0,
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },
  resizeHandle: {
    flexBasis: '2px',
  },
});

export const App = (): JSXElement => {
  const [position, setPosition] = useState<monaco.IPosition | undefined>(undefined);
  const [validation, setValidation] = useState<StatusBarValidation>({ warnings: 0, errors: 0 });

  const [prefs, setPrefs] = usePreferences();
  const autoSave = prefs.autoSave ?? true;

  const bus = useCreateCommandBus();

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
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autoSave, dirty]);

  // Capture reference to the editor for passing commands
  const editorRef = useRef<IEditorApi | undefined>(undefined);
  const onEditorMounted = (api: IEditorApi) => (editorRef.current = api);

  useEffect(() => {
    return bus.subscribe('panel', command => {
      if (command.type === 'panel.show' && command.panel === 'sidebar-s') {
        setPrefs(prev => {
          if (prev.panels.secondary) return prev;
          return {
            ...prev,
            panels: { ...prev.panels, secondary: true },
          };
        });
      }
      return;
    });
  }, [bus, setPrefs]);

  useEffect(() => {
    return bus.subscribe('app', command => {
      switch (command.type) {
        case 'app.save': {
          save();
          return;
        }
        case 'app.loadExample': {
          loadExample(command.example);
          return;
        }
        case 'app.jumpToSource': {
          // Jump to the nearest source code line for the given assembled address
          if (assembly) {
            const lineNo = exchangeAddressForSourceLine(assembly, command.fromAddress);
            if (lineNo) {
              bus.execute(editorCommands.gotoLine(lineNo));
            }
          }
          return;
        }
        case 'app.jumpToAssembled': {
          // Jump to the address for the given source code line number
          if (assembly) {
            const address = exchangeSourceLineNumberForAddress(assembly, command.fromSourceLineNumber);
            if (address) {
              bus.execute(outputCommands.gotoAddress(address));
            }
          }
        }
      }
    });
  }, [bus, assembly, save]);

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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isSaveKey = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's';
      if (!isSaveKey) return;
      event.preventDefault();
      bus.execute(appCommands.save());
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bus]);

  const onEditorPositionChanged = (e: monaco.editor.ICursorPositionChangedEvent) => setPosition(e.position);

  const styles = useStyles();

  function loadExample(name: string): void {
    // Normalise to `<id>.rcasm` if the caller passed just an ID
    const fileName = name.endsWith('.rcasm') ? name : `${name}.rcasm`;

    // Adjust this path if your examples live somewhere else (e.g. `/assets/examples/`)
    const url = `/examples/${fileName}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load example: ${fileName}`);
        }
        return response.text();
      })
      .then(text => {
        editorRef.current?.loadCode(text);
      })
      .catch(err => {
        console.error(err);
        // TODO: surface this via a toast / message bar if you like
      });
  }

  return (
    <Router>
      <CommandBusProvider value={bus}>
        <div className={styles.container}>
          <AppToolbar prefs={prefs} onPrefsChange={setPrefs} dirty={dirty} />
          <div className={styles.main}>
            <SideToolbar prefs={prefs} onPrefsChange={setPrefs} />
            <PanelGroup direction='horizontal' autoSaveId='layout-horizontal'>
              {prefs.panels.primary && (
                <>
                  <Panel id='left' defaultSize={25} minSize={25} className={styles.panel} order={1}>
                    <Routes>
                      <Route path='/examples' element={<Examples />} />
                      <Route path='/export' element={<AppExport />} />
                      <Route path='/emulator' element={<AppEmulator />} />
                      <Route path='/welcome' element={<Welcome />} />
                      <Route path='/' element={<Navigate to='/welcome' replace />} />
                    </Routes>
                  </Panel>
                  <PanelResizeHandle className={styles.resizeHandle} />
                </>
              )}
              <Panel order={2} id='middle'>
                <PanelGroup direction='vertical' autoSaveId='layout-vertical'>
                  <Panel id='editor' minSize={33} order={1}>
                    <Editor
                      initialCode={code}
                      onCodeChange={onCodeChange}
                      onMount={onEditorMounted}
                      onValidate={onEditorValidated}
                      onPositionChange={onEditorPositionChanged}
                    />
                  </Panel>
                  {prefs.panels.bottom && (
                    <>
                      <PanelResizeHandle className={styles.resizeHandle} />
                      <Panel id='bottom' order={2} defaultSize={25} minSize={25} className={styles.panel}></Panel>
                    </>
                  )}
                </PanelGroup>
              </Panel>
              {prefs.panels.secondary && (
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
            autoSave={autoSave}
            dirty={dirty}
          />
        </div>
      </CommandBusProvider>
    </Router>
  );
};
