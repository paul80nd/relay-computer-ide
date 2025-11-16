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
    this.editor.revealLineInCenter(0);
  }

  gotoPosition(lineNumber: number, column: number): void {
    this.editor.setPosition({ lineNumber, column });
    this.editor.revealPositionInCenter({ lineNumber, column });
    this.editor.focus();
  }

  runCommand(commandId: string): void {
    this.editor.focus();
    this.editor.getAction(commandId)?.run();
  }
}
