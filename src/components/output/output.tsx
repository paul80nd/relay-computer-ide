import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { OutputProps } from './types';
import useUpdate from '../../hooks/useUpdate';

function Output({ assembly }: OutputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: assembly?.dasm ?? '',
        theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
        language: 'rcdsm',
        lineNumbers: 'off',
        renderLineHighlight: 'none',
        readOnly: true,
        domReadOnly: true,
        padding: { top: 15 },
        minimap: { enabled: false },
        glyphMargin: false,
        automaticLayout: true,
        scrollBeyondLastLine: false,
      });
    }

    setIsEditorReady(true);

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [assembly]);

  useUpdate(
    () => {
      if (!editorRef.current || assembly?.dasm === undefined) return;
      editorRef.current.setValue(assembly?.dasm);
    },
    [assembly],
    isEditorReady
  );

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
}

export default Output;
