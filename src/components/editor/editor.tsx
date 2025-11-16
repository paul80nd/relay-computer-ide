import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { EditorProps } from './types';
import { EditorApi } from './api.ts';

function Editor({ initialCode, onCodeChange, onMount, onPositionChange, onValidate }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onMountRef = useRef(onMount);
  const onDidChangeModelContentRef = useRef<monaco.IDisposable | undefined>(undefined);
  const onDidChangeCursorPositionRef = useRef<monaco.IDisposable | undefined>(undefined);

  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const code = initialCode;

      editorRef.current = monaco.editor.create(containerRef.current, {
        theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
        value: code,
        language: 'rcasm',
        lineNumbers: 'on',
        renderLineHighlight: 'none',
        padding: { top: 15 },
        automaticLayout: true,
        scrollBeyondLastLine: true,
      });

      if (onCodeChange) {
        onCodeChange(code);
      }
    }

    setIsEditorReady(true);

    return () => {
      onDidChangeModelContentRef?.current?.dispose();
      onDidChangeCursorPositionRef?.current?.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isEditorReady && onMountRef && onMountRef.current) {
      onMountRef.current(new EditorApi(editorRef.current!));
    }
  }, [isEditorReady]);

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
