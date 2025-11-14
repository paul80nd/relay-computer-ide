import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const AppEditor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: [
          '; Welcome to the Relay Computer Editor',
          '; Load examples using the button to the left',
        ].join('\n'),
        theme:
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'vs-dark'
            : 'vs-light',
        language: 'rcasm',
        renderLineHighlight: 'none',
        padding: { top: 15 },
        automaticLayout: true,
        scrollBeyondLastLine: false
      });
    }

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
};
