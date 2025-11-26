import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { lsp } from 'monaco-editor';

import type { AssemblerResult } from './assembler';
import * as rcasmLang from './basic-languages/rcasm';
import * as rcdsmLang from './basic-languages/rcdsm';

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    console.log(`Requesting worker for: ${label}`);
    return new editorWorker();
  },
};

// Set up RC languages
monaco.languages.register({ id: 'rcasm' });
monaco.languages.register({ id: 'rcdsm' });

// Set up RC language basics
monaco.languages.setLanguageConfiguration('rcasm', rcasmLang.conf);
monaco.languages.setMonarchTokensProvider('rcasm', rcasmLang.language);
monaco.languages.setLanguageConfiguration('rcdsm', rcdsmLang.conf);
monaco.languages.setMonarchTokensProvider('rcdsm', rcdsmLang.language);

// Load the RCASM LSP worker
const worker = new Worker('/lsp/rcasm/server.js', { type: 'module' });
worker.postMessage({ type: 'browser/boot', mode: 'foreground' });
const s = lsp.createTransportToWorker(worker); //.log();
new lsp.MonacoLspClient(s);

// Global assembly cache - needed for code lens providers
let currentAssembly: AssemblerResult | undefined;
export function setCurrentAssembly(a?: AssemblerResult) {
  currentAssembly = a;
}
let jumpToSourceCommandId: string | null;
export function setJumpToSourceCommandId(id: string | null) {
  jumpToSourceCommandId = id;
}

// Add labels code lens
monaco.languages.registerCodeLensProvider('rcdsm', {
  provideCodeLenses: (model: monaco.editor.ITextModel, token: monaco.CancellationToken) => {
    const labels = currentAssembly?.labels;
    if (!labels) return { lenses: [], dispose: () => {} };

    // Review line-by-line looking for label matches by address
    const labelLenses: monaco.languages.CodeLens[] = [];
    model.getLinesContent().forEach((v, idx) => {
      if (token.isCancellationRequested) return { lenses: [], dispose: () => {} };
      const addr = v.substring(0, 4);
      const label = labels?.[addr];
      if (!label) return;
      labelLenses.push({
        range: new monaco.Range(idx + 1, 1, idx + 1, 1),
        id: `${addr}:${label.name}`,
        command: {
          id: jumpToSourceCommandId ?? '',
          title: label.name,
          arguments: [addr],
        },
      });
    });

    return { lenses: labelLenses, dispose: () => {} };
  },
  resolveCodeLens: function (_model: monaco.editor.ITextModel, codeLens: monaco.languages.CodeLens) {
    return codeLens;
  },
});
