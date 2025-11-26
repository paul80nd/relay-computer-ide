import { useRef, useEffect, useState, useCallback } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type { EditorProps } from './types';
import { EditorApi } from './api.ts';
import { useCommandBus } from '../../hooks/useCommandBus.ts';
import { appCommands } from '../../commands.ts';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 0
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none' // clicks pass through unless we want to intercept
  },
  dropZone: {
    border: `2px dashed ${tokens.colorPaletteBlueBorderActive}`,
    backgroundColor: tokens.colorNeutralBackground1Hover,
    color: tokens.colorNeutralForeground1,
    padding: '24px 32px',
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    fontSize: '14px',
    pointerEvents: 'auto', // accept drops
    minWidth: '320px',
    textAlign: 'center'
  },
  hint: {
    marginTop: '6px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px'
  }
});

function Editor({ initialCode, onCodeChange, onMount, onPositionChange, onValidate }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorApi | null>(null);
  const styles = useStyles();

  // Keep latest callbacks in refs to avoid re-subscribing when parent recreates them
  const onMountRef = useRef(onMount);
  const onDidChangeModelContentRef = useRef<monaco.IDisposable | undefined>(undefined);
  const onDidChangeCursorPositionRef = useRef<monaco.IDisposable | undefined>(undefined);
  const bus = useCommandBus();

  const [isEditorReady, setIsEditorReady] = useState(false);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0); // helps balance dragenter/dragleave events

  /** Monaco Editor Instantiation */
  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const editor = monaco.editor.create(containerRef.current, {
        theme:
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'vs-dark'
            : 'vs-light',
        value: initialCode,
        language: 'rcasm',
        lineNumbers: 'on',
        renderLineHighlight: 'none',
        padding: { top: 15 },
        automaticLayout: true,
        scrollBeyondLastLine: true,
        tabFocusMode: false
      });

      // Register "Go to Assembled" action once
      editor.addAction({
        id: 'rcasm-jump-to-assembled',
        label: 'Go to Assembled',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: (ed: monaco.editor.ICodeEditor) => {
          const pos = ed.getPosition();
          if (pos) bus.execute(appCommands.jumpToAssembled(pos.lineNumber));
        }
      });

      editorRef.current = new EditorApi(editor);
    }

    setIsEditorReady(true);

    return () => {
      onDidChangeModelContentRef?.current?.dispose();
      onDidChangeCursorPositionRef?.current?.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- important: run once

  /** On Mount Callback */
  useEffect(() => {
    if (isEditorReady && onMountRef && onMountRef.current) {
      onMountRef.current(editorRef.current!);
    }
  }, [isEditorReady]);

  /** Command Bus Subscription */
  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;

    return bus.subscribe('editor', cmd => {
      const editor = editorRef.current;
      if (!editor) return; // not ready yet; safely ignore

      switch (cmd.type) {
        case 'editor.gotoLine':
          // if provided a line number then jump otherwise ask Monaco to show it's goto box
          if (cmd.lineNumber) {
            editor.gotoLine(cmd.lineNumber, cmd.column);
          } else {
            editor.runAction('editor.action.gotoLine');
          }
          break;
        case 'editor.doMonacoKeyboardAction':
          editor.runKeyboardAction(cmd.id);
          break;
        case 'editor.doMonacoAction':
          editor.runAction(cmd.actionId);
      }
    });
  }, [isEditorReady, bus]);

  /** onPositionChange */
  useEffect(() => {
    if (isEditorReady && onPositionChange) {
      onDidChangeCursorPositionRef.current?.dispose();
      onDidChangeCursorPositionRef.current = editorRef.current?.onDidChangeCursorPosition(event => {
        onPositionChange(event);
      });
    }
  }, [isEditorReady, onPositionChange]);

  //** onChange */
  useEffect(() => {
    if (isEditorReady && onCodeChange) {
      onDidChangeModelContentRef.current?.dispose();
      onDidChangeModelContentRef.current = editorRef.current?.onDidChangeModelContent(() =>
        onCodeChange(editorRef.current!.getValue())
      );
    }
  }, [isEditorReady, onCodeChange]);

  /**  onValidate */
  useEffect(() => {
    if (isEditorReady) {
      const changeMarkersListener = monaco.editor.onDidChangeMarkers(uris => {
        const editorUri = editorRef.current!.getModel()?.uri;

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find(uri => uri.path === editorUri.path);
          if (currentEditorHasMarkerChanges) {
            const markers = monaco.editor.getModelMarkers({
              resource: editorUri
            });
            onValidate?.(markers);
          }
        }
      });

      return () => changeMarkersListener?.dispose();
    }
    return () => {
      // eslint happy
    };
  }, [isEditorReady, onValidate]);

  // Drag-and-Drop handlers (inside the editor root)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      e.preventDefault(); // allow drop
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      dragCounter.current += 1;
      setIsDraggingFile(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDraggingFile(false);
        dragCounter.current = 0;
      }
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      const dt = e.dataTransfer;
      if (!dt) return;
      e.preventDefault();
      setIsDraggingFile(false);
      dragCounter.current = 0;

      const file = dt.files?.[0];
      if (!file) return;

      const name = file.name.toLowerCase();
      // allow .rcasm or plain text
      if (!name.endsWith('.rcasm') && file.type && file.type !== 'text/plain') {
        // Optionally surface a toast here
        return;
      }

      const text = await file.text();
      editorRef.current?.loadCode(text);
    },
    [editorRef]
  );

  return (
    <div
      className={styles.root}
      style={{ height: '100%' }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={containerRef}
    >
      {/* Drop overlay */}
      {isDraggingFile && (
        <div className={styles.overlay} aria-hidden='true'>
          <div className={styles.dropZone}>
            Drop your .rcasm file to open
            <div className={styles.hint}>Only .rcasm or text files are accepted</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
