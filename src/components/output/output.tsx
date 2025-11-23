import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type { OutputProps } from './types';
import useUpdate from '../../hooks/useUpdate';
import { useCommandBus } from '../../hooks/useCommandBus';
import { OutputApi } from './api';
import { appCommands } from '../../commands';
import { setJumpToSourceCommandId } from '../../workers';

function Output({ assembly }: OutputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<OutputApi | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const bus = useCommandBus();

  // Create and dispose Monaco editor
  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const editor = monaco.editor.create(containerRef.current, {
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

      // Register "Go to Source" action once
      editor.addAction({
        id: 'rcdsm-jump-to-source',
        label: 'Go to Source',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: (ed: monaco.editor.IStandaloneCodeEditor) => {
          const pos = ed.getPosition();
          const addrText = pos ? ed.getModel()?.getLineContent(pos.lineNumber).substring(0, 4) : '';
          if (!addrText) return;
          const addr = parseInt(addrText, 16);
          bus.execute(appCommands.jumpToSource(addr));
        },
      });

      // Register CodeLens jump from label
      const commandId = editor.addCommand(0, (_, addrText: string) => {
        if (addrText) {
          const addr = parseInt(addrText, 16);
          bus.execute(appCommands.jumpToSource(addr));
        }
      });
      setJumpToSourceCommandId(commandId); // Global required for code lens

      editorRef.current = new OutputApi(editor);
    }

    setIsEditorReady(true);

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
      setIsEditorReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once on mount

  // Update content when assembly changes
  useUpdate(
    () => {
      if (!editorRef.current || assembly === undefined) return;
      editorRef.current.setAssembly(assembly);
    },
    [assembly],
    isEditorReady
  );

  // Subscribe to output-targeted commands
  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;

    return bus.subscribe('output', cmd => {
      const editor = editorRef.current;
      if (!editor) return; // not ready yet; safely ignore

      switch (cmd.type) {
        case 'output.gotoAddress': {
          editor.gotoAddress(cmd.address);
        }
      }
    });
  }, [isEditorReady, bus]);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
}

export default Output;
