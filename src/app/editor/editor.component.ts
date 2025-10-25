import { Component, EventEmitter, OnInit, Output, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-ride-editor',
  templateUrl: './editor.component.html',
  imports: [EditorComponent]
})
export class RcasmEditorComponent {
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);

  @Output() codeChanged = new EventEmitter<string>();
  @Output() gotoAssembled = new EventEmitter<number>();

  stateType: string = 'info';
  stateText: string = 'ready';

  editor: monaco.editor.IStandaloneCodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcasm',
    lineNumbers: 'on',
    renderLineHighlight: 'none',
    scrollBeyondLastLine: true,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    // minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    editor.onDidChangeModelContent(() => {
      const code = editor.getModel()?.getValue()
      if (code) {
        localStorage.setItem("code", code);
        this.codeChanged.emit(code);
      }
    });

    editor.onDidChangeCursorPosition(e => {
      this.ngZone.run(() => {
        this.stateText = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
      });
    });

    editor.addAction(<monaco.editor.IActionDescriptor>{
      id: "rcasm-jump-to-source",
      label: "Go to Assembled",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: (ed: monaco.editor.ICodeEditor) => {
        const pos = ed.getPosition();
        if (pos) {
          this.gotoAssembled.emit(pos.lineNumber);
        }
      }
    });

    const code = localStorage.getItem("code") || this.getDefaultCode();
    editor.getModel()?.setValue(code);
    this.codeChanged.emit(code);
  }

  getDefaultCode(): string {
    return [
      ';*****************************************************',
      '; Welcome to Relay Computer Assembly (RCASM)',
      ';',
      '; Start typing your program below or open an example',
      '; using the import menu at the top right',
      ';*****************************************************',
      '',
      ''].join('\n');
  }

  loadExample(example: string) {
    this.http.get(`/assets/examples/${example}`, { responseType: 'text' }).subscribe(data => {
      this.editor?.getModel()?.setValue(data);
      this.codeChanged.emit(data);
    });
  }

  gotoLine(lineNo: number) {
    this.editor?.revealLineInCenter(lineNo);
    this.editor?.setPosition({ lineNumber: lineNo, column: 1 });
    this.editor?.focus();
  }
}
