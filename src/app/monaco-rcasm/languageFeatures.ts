'use strict';

import { RcasmWorker } from './rcasmWorker';
import * as rcasmService from '../language-rcasm/rcasmService';

import Uri = monaco.Uri;
import Range = monaco.Range;
import IRange = monaco.IRange;
import Thenable = monaco.Thenable;
import CancellationToken = monaco.CancellationToken;

export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<RcasmWorker>
}

// --- completion ------

function fromRange(range: IRange): rcasmService.Range {
	if (!range) {
		return void 0;
	}
	return { start: { line: range.startLineNumber - 1, character: range.startColumn - 1 }, end: { line: range.endLineNumber - 1, character: range.endColumn - 1 } };
}

function toRange(range: rcasmService.Range): Range {
	if (!range) {
		return void 0;
	}
	return new monaco.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}

function toTextEdit(textEdit: rcasmService.TextEdit): monaco.editor.ISingleEditOperation {
	if (!textEdit) {
		return void 0;
	}
	return {
		range: toRange(textEdit.range),
		text: textEdit.newText
	}
}

export class DocumentColorAdapter implements monaco.languages.DocumentColorProvider {
    
    constructor(private _worker: WorkerAccessor) {
    }
    
    public provideDocumentColors(model: monaco.editor.IReadOnlyModel, token: CancellationToken): Thenable<monaco.languages.IColorInformation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.findDocumentColors(resource.toString())).then(infos => {
			if (!infos) {
				return;
			}
			return infos.map(item => ({
				color: item.color,
				range: toRange(item.range)
			}));
		});
    }
    
    public provideColorPresentations(model: monaco.editor.IReadOnlyModel, info: monaco.languages.IColorInformation, token: CancellationToken): Thenable<monaco.languages.IColorPresentation[]> {
		const resource = model.uri;

		return this._worker(resource).then(worker => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))).then(presentations => {
			if (!presentations) {
				return;
			}
			return presentations.map(presentation => {
				let item: monaco.languages.IColorPresentation = {
					label: presentation.label,
				};
				if (presentation.textEdit) {
					item.textEdit = toTextEdit(presentation.textEdit)
				}
				if (presentation.additionalTextEdits) {
					item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit)
				}
				return item;
			});
		});
	}
}