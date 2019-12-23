'use strict';

import * as mode from './rcasmMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;

// --- Rcasm configuration and defaults ---------

export class LanguageServiceDefaultsImpl {

	private _languageId: string;

	constructor(languageId: string) {
		this._languageId = languageId;
	}

	get languageId(): string {
		return this._languageId;
	}
}

const rcasmDefaults = new LanguageServiceDefaultsImpl('rcasm');

export function registerLanguage() {
    monaco.languages.onLanguage('rcasm', () => {
        return mode.setupRcasm(rcasmDefaults);
    });
}