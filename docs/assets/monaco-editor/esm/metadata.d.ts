
/*!----------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *----------------------------------------------------------------*/

export interface IWorkerDefinition {
	id: string;
	entry: string;
}

export interface IFeatureDefinition {
	label: string;
	entry: string | string[] | undefined;
	worker?: IWorkerDefinition;
}

export const features: IFeatureDefinition[];

export const languages: IFeatureDefinition[];

export type EditorLanguage = 'mips' | 'rcasm' | 'rcdsm';

export type EditorFeature = 'anchorSelect' | 'bracketMatching' | 'browser' | 'caretOperations' | 'clipboard' | 'codeAction' | 'codeEditor' | 'codelens' | 'colorPicker' | 'comment' | 'contextmenu' | 'cursorUndo' | 'diffEditor' | 'diffEditorBreadcrumbs' | 'dnd' | 'documentSymbols' | 'dropOrPasteInto' | 'find' | 'folding' | 'fontZoom' | 'format' | 'gotoError' | 'gotoLine' | 'gotoSymbol' | 'hover' | 'iPadShowKeyboard' | 'inPlaceReplace' | 'indentation' | 'inlayHints' | 'inlineCompletions' | 'inlineEdit' | 'inlineEdits' | 'inlineProgress' | 'inspectTokens' | 'lineSelection' | 'linesOperations' | 'linkedEditing' | 'links' | 'longLinesHelper' | 'multicursor' | 'parameterHints' | 'placeholderText' | 'quickCommand' | 'quickHelp' | 'quickOutline' | 'readOnlyMessage' | 'referenceSearch' | 'rename' | 'sectionHeaders' | 'semanticTokens' | 'smartSelect' | 'snippet' | 'stickyScroll' | 'suggest' | 'toggleHighContrast' | 'toggleTabFocusMode' | 'tokenization' | 'unicodeHighlighter' | 'unusualLineTerminators' | 'wordHighlighter' | 'wordOperations' | 'wordPartOperations';

export type NegatedEditorFeature = '!anchorSelect' | '!bracketMatching' | '!browser' | '!caretOperations' | '!clipboard' | '!codeAction' | '!codeEditor' | '!codelens' | '!colorPicker' | '!comment' | '!contextmenu' | '!cursorUndo' | '!diffEditor' | '!diffEditorBreadcrumbs' | '!dnd' | '!documentSymbols' | '!dropOrPasteInto' | '!find' | '!folding' | '!fontZoom' | '!format' | '!gotoError' | '!gotoLine' | '!gotoSymbol' | '!hover' | '!iPadShowKeyboard' | '!inPlaceReplace' | '!indentation' | '!inlayHints' | '!inlineCompletions' | '!inlineEdit' | '!inlineEdits' | '!inlineProgress' | '!inspectTokens' | '!lineSelection' | '!linesOperations' | '!linkedEditing' | '!links' | '!longLinesHelper' | '!multicursor' | '!parameterHints' | '!placeholderText' | '!quickCommand' | '!quickHelp' | '!quickOutline' | '!readOnlyMessage' | '!referenceSearch' | '!rename' | '!sectionHeaders' | '!semanticTokens' | '!smartSelect' | '!snippet' | '!stickyScroll' | '!suggest' | '!toggleHighContrast' | '!toggleTabFocusMode' | '!tokenization' | '!unicodeHighlighter' | '!unusualLineTerminators' | '!wordHighlighter' | '!wordOperations' | '!wordPartOperations';

