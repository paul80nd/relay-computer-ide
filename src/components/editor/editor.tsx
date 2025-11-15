import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { EditorProps } from './types';

function Editor({ onChange, onMount, onPositionChange, onValidate }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onMountRef = useRef(onMount);
  const onDidChangeModelContentRef = useRef<monaco.IDisposable | undefined>(undefined);
  const onDidChangeCursorPositionRef = useRef<monaco.IDisposable | undefined>(undefined);

  const [isEditorReady, setIsEditorReady] = useState(false);

  const getDefaultCode = (): string => {
    return [
      '; *****************************************************',
      ';  Welcome to Relay Computer Assembly (RCASM)',
      ';',
      ';  Start typing your program below or open an example',
      ';  from the examples folder top left',
      '; *****************************************************',
      '',
      '',
    ].join('\n');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const code = localStorage.getItem('code') || getDefaultCode();

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
      onMountRef.current(editorRef.current!);
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
    if (isEditorReady && onChange) {
      onDidChangeModelContentRef.current?.dispose();
      onDidChangeModelContentRef.current = editorRef.current?.onDidChangeModelContent(event => {
        onChange(editorRef.current!.getValue(), event);
      });
    }
  }, [isEditorReady, onChange]);

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
