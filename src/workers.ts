import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import rcasmWoker from 'monaco-editor/esm/vs/language/rcasm/rcasm.worker?worker';

self.MonacoEnvironment = {
	getWorker(_: unknown, label: string) {
		if (label === 'typescript' || label === 'javascript') {
			console.log('ts coming up');
			return new tsWorker();
		}
		if (label === 'rcasm') {
			console.log('rcasm coming up');
			return new rcasmWoker();
		}
		return new editorWorker();
	}
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
