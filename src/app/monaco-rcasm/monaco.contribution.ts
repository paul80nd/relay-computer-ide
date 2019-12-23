'use strict';

import * as mode from './rcasmMode';

export function registerLanguage() {
    monaco.languages.onLanguage('rcasm', () => {
        return mode.setupRcasm();
    });
}