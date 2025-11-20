import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { EditorProps } from './types';
import { EditorApi } from './api.ts';
import { useCommandBus } from '../../hooks/useCommandBus.ts';
import { appCommands } from '../../commands.ts';

function Editor({ initialCode, onCodeChange, onMount, onPositionChange, onValidate }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorApi | null>(null);

  // Keep latest callbacks in refs to avoid re-subscribing when parent recreates them
  const onMountRef = useRef(onMount);
  const onDidChangeModelContentRef = useRef<monaco.IDisposable | undefined>(undefined);
  const onDidChangeCursorPositionRef = useRef<monaco.IDisposable | undefined>(undefined);
  const bus = useCommandBus();

  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const editor = monaco.editor.create(containerRef.current, {
        theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
        value: initialCode,
        language: 'rcasm',
        lineNumbers: 'on',
        renderLineHighlight: 'none',
        padding: { top: 15 },
        automaticLayout: true,
        scrollBeyondLastLine: true,
        tabFocusMode: false,
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
        },
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

  useEffect(() => {
    if (isEditorReady && onMountRef && onMountRef.current) {
      onMountRef.current(editorRef.current!);
    }
  }, [isEditorReady]);

  // Command Bus Subscription
  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;

    return bus.subscribe('editor', cmd => {
      const editor = editorRef.current;
      if (!editor) return; // not ready yet; safely ignore

      switch (cmd.type) {
        case 'editor.gotoLine':
          // if provided a line number then jump otherwise ask Monaco to show it's goto box
          if (cmd.lineNumber) {
            editor.gotoLine(cmd.lineNumber);
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

  // onPositionChange
  useEffect(() => {
    if (isEditorReady && onPositionChange) {
      onDidChangeCursorPositionRef.current?.dispose();
      onDidChangeCursorPositionRef.current = editorRef.current?.onDidChangeCursorPosition(event => {
        onPositionChange(event);
      });
    }
  }, [isEditorReady, onPositionChange]);

  // onChange
  useEffect(() => {
    if (isEditorReady && onCodeChange) {
      onDidChangeModelContentRef.current?.dispose();
      onDidChangeModelContentRef.current = editorRef.current?.onDidChangeModelContent(() =>
        onCodeChange(editorRef.current!.getValue())
      );
    }
  }, [isEditorReady, onCodeChange]);

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      const changeMarkersListener = monaco.editor.onDidChangeMarkers(uris => {
        const editorUri = editorRef.current!.getModel()?.uri;

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find(uri => uri.path === editorUri.path);
          if (currentEditorHasMarkerChanges) {
            const markers = monaco.editor.getModelMarkers({
              resource: editorUri,
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

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
}

export default Editor;
