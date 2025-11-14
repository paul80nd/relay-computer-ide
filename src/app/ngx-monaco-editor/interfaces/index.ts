/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />

import { InjectionToken } from "@angular/core";

export type MonacoEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
export type MonacoDiffEditorConstructionOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions;
export type MonacoEditorUri = monaco.Uri;
export type MonacoStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
export type MonacoStandaloneDiffEditor = monaco.editor.IStandaloneDiffEditor;

export const NGX_MONACO_EDITOR_CONFIG = new InjectionToken('NGX_MONACO_EDITOR_CONFIG');

export interface MonacoEditorConfig {
  monacoPath?: string;
  onMonacoLoad?: Function;
}
