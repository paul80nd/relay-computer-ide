import { makeStyles, tokens } from '@fluentui/react-components';
import AppToolbar from './components/toolbar';
import SideToolbar from './components/side-toolbar';
import Editor from './components/editor';
import Output from './components/output';
import { useEffect, useRef, useState } from 'react';
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';
import { usePreferences, Prefs } from './hooks/usePreferences';
import Welcome from './components/welcome';
import Emulator from './components/emulator';
import Export from './components/export';
import Examples from './components/examples';
import StatusBar from './components/status-bar';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type { StatusBarValidation } from './components/status-bar';
import { appCommands, editorCommands, outputCommands, panelCommands } from './commands';
import type { IEditorApi } from './components/editor';
import { useAssembler } from './hooks/useAssembler.ts';
import { useCodeStorage } from './hooks/useCodeStorage.ts';
import { CommandBusProvider, useCreateCommandBus } from './hooks/useCommandBus.ts';
import { exchangeAddressForSourceLine, exchangeSourceLineNumberForAddress } from './assembler.ts';
import { setJumpToSourceHandler } from './workers.ts';
import Documentation from './components/documentation/documentation.tsx';
import Problems from './components/problems/index.ts';
import { saveAsTextFile, pickTextFile } from './utils.ts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    gap: '2px',
    backgroundColor: tokens.colorNeutralBackground3
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: '1',
    minHeight: 0,
    gap: '2px'
  },
  editor: {
    flexGrow: 1,
    minWidth: 0
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden'
  },
  resizeHandle: {
    flexBasis: '2px'
  }
});

const defaultTemplate = [
  '; *****************************************************',
  ';  Welcome to Relay Computer Assembly (RCASM)',
  ';',
  ';  Start typing your program below or open an example',
  ';  from the examples folder top left',
  '; *****************************************************',
  '',
  ''
].join('\n');

export const App = () => {
  const [position, setPosition] = useState<monaco.IPosition | undefined>(undefined);
  const [validation, setValidation] = useState<StatusBarValidation>({ warnings: 0, errors: 0 });
  const [markers, setMarkers] = useState<monaco.editor.IMarker[]>([]);

  const [prefs, setPrefs] = usePreferences();
  const autoSave = prefs.autoSave ?? true;

  const bus = useCreateCommandBus();

  // Source code + persistence
  const { code, onCodeChange, save, dirty } = useCodeStorage({
    storageKey: 'code',
    autoSave,
    defaultCode: defaultTemplate
  });

  // Debounced assembly from the current code
  const { assembly } = useAssembler({ code, debounceMs: 300 });

  // Warn if navigating away with unsaved changes when autoSave is off
  useEffect(() => {
    if (autoSave || !dirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autoSave, dirty]);

  // Capture reference to the editor for passing commands
  const editorRef = useRef<IEditorApi | undefined>(undefined);
  const onEditorMounted = (api: IEditorApi) => (editorRef.current = api);

  /** Panel command handling */
  useEffect(() => {
    return bus.subscribe('panel', command => {
      // Show secondary sidebar
      if (command.type === 'panel.toggle' && command.panel === 'sidebar-s') {
        setPrefs(prev => ({
          ...prev,
          panels: { ...prev.panels, secondary: !prev.panels.secondary }
        }));
      }
      if (command.type === 'panel.toggle' && command.panel === 'panel') {
        setPrefs(prev => ({ ...prev, panels: { ...prev.panels, bottom: !prev.panels.bottom } }));
      }
      // Show section
      if (command.type === 'panel.showSection') {
        setPrefs(prev => {
          const next =
            prev.section === command.section ? prev : { ...prev, section: command.section };
          // Ensure primary panel is visible
          return next.panels.primary
            ? next
            : { ...next, panels: { ...next.panels, primary: true } };
        });
      }
      return;
    });
  }, [bus, setPrefs]);

  /** Wire the global rcdsm CodeLens jump-to-source command to dispatch through the bus.
   *  Lives at the App level so the command works regardless of whether Output is mounted. */
  useEffect(() => {
    setJumpToSourceHandler(addr => bus.execute(appCommands.jumpToSource(addr)));
    return () => setJumpToSourceHandler(undefined);
  }, [bus]);

  // Keep latest reactive values in refs so the `app` subscriber doesn't need to
  // re-subscribe (and risk racing in-flight async handlers) on every change.
  const assemblyRef = useRef(assembly);
  const saveRef = useRef(save);
  const codeRef = useRef(code);
  useEffect(() => {
    assemblyRef.current = assembly;
  });
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    codeRef.current = code;
  });

  /** App command handling */
  useEffect(() => {
    return bus.subscribe('app', async command => {
      switch (command.type) {
        case 'app.new': {
          const ok = window.confirm(
            'This will clear the editor (and clear the code saved in your browser storage). Continue?'
          );
          if (!ok) return;
          editorRef.current?.loadCode(defaultTemplate);
          return;
        }
        case 'app.open': {
          const picked = await pickTextFile();
          if (!picked) return;
          editorRef.current?.loadCode(picked.text);
          return;
        }
        case 'app.save': {
          saveRef.current();
          return;
        }
        case 'app.saveAs': {
          await saveAsTextFile(codeRef.current);
          return;
        }
        case 'app.loadExample': {
          await loadExample(command.example);
          return;
        }
        case 'app.jumpToSource': {
          const assembly = assemblyRef.current;
          if (assembly) {
            const lineNo = exchangeAddressForSourceLine(assembly, command.fromAddress);
            if (lineNo) {
              bus.execute(editorCommands.gotoLine(lineNo));
            }
          }
          return;
        }
        case 'app.jumpToAssembled': {
          const assembly = assemblyRef.current;
          if (assembly) {
            const address = exchangeSourceLineNumberForAddress(
              assembly,
              command.fromSourceLineNumber
            );
            if (address) {
              bus.execute(outputCommands.gotoAddress(address));
            }
          }
        }
      }
    });
  }, [bus]);

  const onEditorValidated = (newMarkers: monaco.editor.IMarker[]) => {
    const v: StatusBarValidation = { errors: 0, warnings: 0 };
    newMarkers.forEach(m => {
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
    setMarkers(newMarkers);
  };

  /** Keyboard shortcuts handling */
  useEffect(() => {
    const handler = async (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      // Open (Shift+Cmd/Ctrl+O)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && key === 'o') {
        event.preventDefault();
        await bus.executeAsync(appCommands.open());
        return;
      }
      // Save (Cmd+S / Ctrl+S) (Save As if shift is held)
      if ((event.metaKey || event.ctrlKey) && key === 's') {
        event.preventDefault();
        if (event.shiftKey) {
          await bus.executeAsync(appCommands.saveAs());
        } else {
          bus.execute(appCommands.save());
        }
        return;
      }
      // Ctrl+Shift/Cmd+Shift Combinations
      if (event.shiftKey && (event.metaKey || event.ctrlKey)) {
        // Sections (+D/E/X/Y/W)
        if (['d', 'e', 'x', 'y', 'w'].includes(key)) {
          let section = undefined;
          switch (event.key.toLowerCase()) {
            case 'd':
              section = Prefs.Sections.DOCUMENTATION;
              break;
            case 'e':
              section = Prefs.Sections.EXAMPLES;
              break;
            case 'x':
              section = Prefs.Sections.EXPORT;
              break;
            case 'y':
              section = Prefs.Sections.EMULATOR;
              break;
            case 'w':
              section = Prefs.Sections.WELCOME;
              break;
          }
          if (section) {
            event.preventDefault();
            bus.execute(panelCommands.showSection(section));
            return;
          }
        }
        // Panels (+M/U)
        if (key === 'm') {
          event.preventDefault();
          setPrefs(prev => ({
            ...prev,
            panels: { ...prev.panels, bottom: !prev.panels.bottom }
          }));
          return;
        }
        if (key === 'u') {
          event.preventDefault();
          setPrefs(prev => ({
            ...prev,
            panels: { ...prev.panels, secondary: !prev.panels.secondary }
          }));
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bus]);

  const onEditorPositionChanged = (e: monaco.editor.ICursorPositionChangedEvent) =>
    setPosition(e.position);

  const styles = useStyles();

  async function loadExample(name: string): Promise<void> {
    // Reject anything outside the example-slug shape so a bus payload can't reach for
    // paths like `../something` or fetch unrelated assets under the same origin.
    const slug = name.endsWith('.rcasm') ? name.slice(0, -'.rcasm'.length) : name;
    if (!/^[a-z0-9-]+$/.test(slug)) {
      console.warn(`Rejected example name: ${name}`);
      return;
    }
    const url = `/examples/${slug}.rcasm`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load example: ${slug}.rcasm`);
      const text = await response.text();
      editorRef.current?.loadCode(text);
    } catch (err) {
      console.error(err);
    }
  }

  function renderSection() {
    switch (prefs.section) {
      case Prefs.Sections.DOCUMENTATION:
        return <Documentation />;
      case Prefs.Sections.EXAMPLES:
        return <Examples />;
      case Prefs.Sections.EXPORT:
        return <Export assembly={assembly} />;
      case Prefs.Sections.EMULATOR:
        return <Emulator assembly={assembly} />;
    }
    return <Welcome />;
  }

  const horizontalPanelLayout = useDefaultLayout({
    groupId: 'horizontal-layout',
    storage: localStorage
  });

  const verticalPanelLayout = useDefaultLayout({
    groupId: 'vertical-layout',
    storage: localStorage
  });

  return (
    <CommandBusProvider value={bus}>
      <div className={styles.container}>
        <AppToolbar prefs={prefs} onPrefsChange={setPrefs} dirty={dirty} />
        <div className={styles.main}>
          <SideToolbar prefs={prefs} onPrefsChange={setPrefs} />
          <Group
            orientation='horizontal'
            defaultLayout={horizontalPanelLayout.defaultLayout}
            onLayoutChanged={horizontalPanelLayout.onLayoutChanged}
          >
            {prefs.panels.primary && (
              <>
                <Panel id='left' defaultSize='25%' minSize='25%' className={styles.panel}>
                  {renderSection()}
                </Panel>
                <Separator className={styles.resizeHandle} />
              </>
            )}
            <Panel id='middle'>
              <Group
                orientation='vertical'
                defaultLayout={verticalPanelLayout.defaultLayout}
                onLayoutChanged={verticalPanelLayout.onLayoutChanged}
              >
                <Panel id='editor' minSize='33%' data-tabster='{"uncontrolled": {}}'>
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
                    <Separator className={styles.resizeHandle} />
                    <Panel id='bottom' defaultSize='20%' minSize='20%' className={styles.panel}>
                      <Problems
                        markers={markers}
                        onSelect={marker => {
                          // Jump to the marker location in the editor
                          bus.execute(
                            editorCommands.gotoLine(
                              marker.startLineNumber ?? 1,
                              marker.startColumn ?? 1
                            )
                          );
                        }}
                      />
                    </Panel>
                  </>
                )}
              </Group>
            </Panel>
            {prefs.panels.secondary && (
              <>
                <Separator className={styles.resizeHandle} />
                <Panel id='right' defaultSize='20%' minSize='20%' className={styles.panel}>
                  <Output assembly={assembly} />
                </Panel>
              </>
            )}
          </Group>
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
  );
};
