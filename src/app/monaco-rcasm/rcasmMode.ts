'use strict';

import { WorkerManager } from './workerManager';
import { RcasmWorker } from './rcasmWorker';
import * as languageFeatures from './languageFeatures';

import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupRcasm(): IDisposable {

	const disposables: IDisposable[] = [];
	
	const client = new WorkerManager();
	disposables.push(client);
	
	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<RcasmWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop().dispose();
	}
}