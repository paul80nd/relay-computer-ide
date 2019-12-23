'use strict';

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import { RcasmWorker } from './rcasmWorker';

import IDisposable = monaco.IDisposable;
import Uri = monaco.Uri;

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {

    private _defaults: LanguageServiceDefaultsImpl;
    private _idleCheckInterval: number;
    private _lastUsedTime: number;
    
    private _worker: monaco.editor.MonacoWebWorker<RcasmWorker>;
    private _client: Promise<RcasmWorker>;

	constructor(defaults: LanguageServiceDefaultsImpl) {
        this._defaults = defaults;
		this._worker = null;
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1000);
		this._lastUsedTime = 0;
    }

    private _stopWorker(): void {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
    }
    
    dispose(): void {
		clearInterval(this._idleCheckInterval);
		this._stopWorker();
    }
    
    private _checkIfIdle(): void {
		if (!this._worker) {
			return;
		}
		let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
		if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
			this._stopWorker();
		}
    }
    
    private _getClient(): Promise<RcasmWorker> {
		this._lastUsedTime = Date.now();

		if (!this._client) {
			this._worker = monaco.editor.createWebWorker<RcasmWorker>({

				// module that exports the create() method and returns a `RcasmWorker` instance
				moduleId: 'vs/language/rcasm/rcasmWorker',

				label: this._defaults.languageId,

				// passed in to the create() method
				createData: {
					languageId: this._defaults.languageId
				}
			});

			this._client = <Promise<RcasmWorker>><any>this._worker.getProxy();
		}

		return this._client;
    }
    
    getLanguageServiceWorker(...resources: Uri[]): Promise<RcasmWorker> {
		let _client: RcasmWorker;
		return this._getClient().then((client) => {
			_client = client
		}).then(_ => {
			return this._worker.withSyncedResources(resources)
		}).then(_ => _client);
	}
}