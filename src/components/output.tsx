import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const AppOutput = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        theme:
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'vs-dark'
            : 'vs-light',
        language: 'rcdsm',
        lineNumbers: 'off',
        renderLineHighlight: 'none',
        readOnly: true,
        domReadOnly: true,
        padding: { top: 15 },
        minimap: { enabled: false },
        glyphMargin: false,
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
