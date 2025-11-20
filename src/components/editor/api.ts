import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { IEditorApi } from "./types.ts";

export class EditorApi implements IEditorApi {
  private editor: monaco.editor.IStandaloneCodeEditor;

  constructor(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
  }

  focus(): void {
    this.editor.focus();
  }

  loadCode(code: string): void {
    this.editor.setValue(code);
    this.editor.focus();
    this.editor.revealLineInCenter(1);
  }

  gotoLine(lineNumber: number) {
    this.editor.revealLineInCenterIfOutsideViewport(lineNumber, monaco.editor.ScrollType.Smooth);
    this.editor.setPosition({ lineNumber: lineNumber, column: 1 });
    this.editor.focus();
  }

  runAction(type: string) {
    this.editor.focus();
    this.editor.getAction(type)?.run();
  }

  runKeyboardAction(id: string) {
    this.editor.trigger('keyboard', id, {});
  }

  public get onDidChangeCursorPosition() { return this.editor.onDidChangeCursorPosition; }
  public get onDidChangeModelContent() { return this.editor.onDidChangeModelContent; }

  getValue() { return this.editor.getValue(); }
  getModel() { return this.editor.getModel(); }

  dispose(): void { this.editor.dispose() };
}

