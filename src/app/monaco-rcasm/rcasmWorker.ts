'use strict';

import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import * as rcasmService from '../language-rcasm/rcasmService';

export class RcasmWorker {

    private _ctx: IWorkerContext;
    private _languageService: rcasmService.LanguageService;
    private _languageId: string;

    constructor(ctx: IWorkerContext, createData: ICreateData) {    
        this._ctx = ctx;
        this._languageId = createData.languageId;
        switch (this._languageId) {
			case 'rcasm':
				this._languageService = rcasmService.getRcasmLanguageService();
				break;
			default:
				throw new Error('Invalid language id: ' + this._languageId);
		}
    }
    
    findDocumentColors(uri: string): Thenable<rcasmService.ColorInformation[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
		return Promise.resolve(colorSymbols);
    }
    getColorPresentations(uri: string, color: rcasmService.Color, range: rcasmService.Range): Thenable<rcasmService.ColorPresentation[]> {
		let document = this._getTextDocument(uri);
		let stylesheet = this._languageService.parseStylesheet(document);
		let colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);
		return Promise.resolve(colorPresentations);
	}
    
    private _getTextDocument(uri: string): rcasmService.TextDocument {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return rcasmService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
			}
		}
		return null;
	}

}

export interface ICreateData {
	languageId: string;
}