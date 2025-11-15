import { Component, inject, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonacoEditorComponent } from '../ngx-monaco-editor';
import * as rcasm from '@paul80nd/rcasm';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-editor',
  templateUrl: './editor.component.html',
  imports: [MonacoEditorComponent, FormsModule]
})
export class EditorComponent {
  private http = inject(HttpClient);

  readonly codeChanged = output<string>();
  readonly gotoAssembled = output<number>();

  stateType: string = 'info';
  stateText: string = 'ready';

  code: string = '';

  editor: monaco.editor.IStandaloneCodeEditor | null = null;

  editorOptions = {
  } as monaco.editor.IStandaloneEditorConstructionOptions;

  onInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    editor.onDidChangeCursorPosition(e => {
      this.stateText = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
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

    this.codeChanged.emit(this.code);
  }

  loadExample(example: string) {
    this.http.get(`/assets/examples/${example}`, { responseType: 'text' }).subscribe(data => {
      this.code = data;
      this.editor?.revealLineInCenter(0);
    });
  }

  gotoPosition(position: monaco.IPosition) {
    this.editor?.revealLineInCenter(position.lineNumber);
    this.editor?.setPosition(position);
    this.editor?.focus();
  }

  setDiagnostics(errors: rcasm.Diagnostic[], warnings: rcasm.Diagnostic[]) {
    if (!this.editor || !this.editor.getModel()) return;

    const markers: monaco.editor.IMarkerData[] = [];

    const toDiagnostic = (e: rcasm.Diagnostic, s: monaco.MarkerSeverity): monaco.editor.IMarkerData => {
      return {
        severity: s,
        startLineNumber: e.loc.start.line,
        startColumn: e.loc.start.column,
        endLineNumber: e.loc.end.line,
        endColumn: e.loc.end.column,
        message: e.msg,
        source: 'rcasm'
      };
    };

    markers.push(...errors.map(e => toDiagnostic(e, monaco.MarkerSeverity.Error)));
    markers.push(...warnings.map(e => toDiagnostic(e, monaco.MarkerSeverity.Warning)));
    (window as any).monaco.editor.setModelMarkers(this.editor.getModel()!, 'rcasm', markers);
  }

}
