'use strict';

import { WorkerManager } from './workerManager';
import { RcasmWorker } from './rcasmWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupRcasm(defaults: LanguageServiceDefaultsImpl): IDisposable {

	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);
	
	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<RcasmWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId } = defaults;

		disposeAll(providers);

	}

	registerProviders();
	disposables.push(asDisposable(providers));

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