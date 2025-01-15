import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@Component({
    selector: 'app-ride-editor',
    templateUrl: './editor.component.html',
    standalone: true,
    imports: [MonacoEditorModule]
})
export class EditorComponent {
  private http = inject(HttpClient);

  @Output() codeChanged = new EventEmitter<string>();

  stateType: string = 'info';
  stateText: string = 'ready';

  editor: monaco.editor.ICodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcasm',
    lineNumbers: 'on',
    renderLineHighlight: 'none',
    scrollBeyondLastLine: true,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 }
    // minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.ICodeEditor) {
    this.editor = editor;

    editor.onDidChangeModelContent(() => {
      const code = editor.getModel()?.getValue()
      if (code) {
        localStorage.setItem("code", code);
        this.codeChanged.emit(code);
      }
    });

    editor.onDidChangeCursorPosition(e => {
      this.stateText = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
    });

    const code = localStorage.getItem("code") || this.getDefaultCode();
    editor.getModel()?.setValue(code);
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
    });
  }

}
