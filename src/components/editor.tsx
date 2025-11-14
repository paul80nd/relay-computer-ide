import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const AppEditor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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

  let changeTimeoutId: number | undefined;
  const onCodeChange = () => {
    // Debounce change by up to 500ms
    clearTimeout(changeTimeoutId);
    changeTimeoutId = setTimeout(() => {
      const code = editorRef.current?.getValue();
      if (code) {
        localStorage.setItem('code', code);
      }
    }, 500);
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

      editorRef.current.onDidChangeModelContent(() => onCodeChange());
    }

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
};
