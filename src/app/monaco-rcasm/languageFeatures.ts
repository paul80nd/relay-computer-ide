'use strict';

import { RcasmWorker } from './rcasmWorker';

import Uri = monaco.Uri;

export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<RcasmWorker>
}