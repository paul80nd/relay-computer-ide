import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import rcasmWorker from 'monaco-editor/esm/vs/language/rcasm/rcasm.worker?worker';
import type { AssemblerResult } from './assembler';

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'rcasm') {
      console.log('rcasm coming up');
      return new rcasmWorker();
    }
    return new editorWorker();
  }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);


// Global assembly cache - needed for code lens providers
let currentAssembly: AssemblerResult | undefined;
export function setCurrentAssembly(a?: AssemblerResult) { currentAssembly = a; }
let jumpToSourceCommandId: string | null;
export function setJumpToSourceCommandId(id: string | null) { jumpToSourceCommandId = id; }

// Add labels code lens
monaco.languages.registerCodeLensProvider("rcdsm", {
  provideCodeLenses: (model: monaco.editor.ITextModel, token: monaco.CancellationToken) => {
    const labels = currentAssembly?.labels;
    if (!labels) return { lenses: [], dispose: () => { } };

    // Review line-by-line looking for label matches by address
    const labelLenses: monaco.languages.CodeLens[] = [];
    model.getLinesContent().forEach((v, idx) => {
      if (token.isCancellationRequested) return { lenses: [], dispose: () => { } }
      const addr = v.substring(0, 4)
      const label = labels![addr];
      if (label) {
        labelLenses.push({
          range: {
            startLineNumber: idx + 1,
            startColumn: 1,
            endLineNumber: idx + 1,
            endColumn: 1,
          },
          id: `${addr}:${label.name}`,
          command: {
            id: jumpToSourceCommandId ?? '',
            title: label.name,
            arguments: [addr]
          },
        });
      }
    });

    return { lenses: labelLenses, dispose: () => { }, };
  },
  resolveCodeLens: function (_model: monaco.editor.ITextModel, codeLens: monaco.languages.CodeLens) {
    return codeLens;
  },
});

