'use strict';

import { RcasmParser } from './parser/rcasmParser';
import { RcasmNavigation } from './services/rcasmNavigation';
import { Range, TextDocument, ColorInformation, Color, ColorPresentation } from './rcasmLanguageTypes'

export type Stylesheet = {};
export * from './rcasmLanguageTypes';

export interface LanguageService {
    parseStylesheet(document: TextDocument): Stylesheet;
    findDocumentColors(document: TextDocument, stylesheet: Stylesheet): ColorInformation[];
    getColorPresentations(document: TextDocument, stylesheet: Stylesheet, color: Color, range: Range): ColorPresentation[];
}

function createFacade(parser: RcasmParser, navigation: RcasmNavigation): LanguageService {
	return {
        parseStylesheet: parser.parseAssembly.bind(parser),
        findDocumentColors: navigation.findDocumentColors.bind(navigation),
        getColorPresentations: navigation.getColorPresentations.bind(navigation)
	};
}

export function getRcasmLanguageService(): LanguageService {
	return createFacade(
        new RcasmParser(),
        new RcasmNavigation()
	);
}