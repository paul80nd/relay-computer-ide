import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ride-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  @Output() codeChanged = new EventEmitter<string>();

  editor: monaco.editor.ICodeEditor | null = null;

  constructor(private http: HttpClient) { }

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

    const code = localStorage.getItem("code") || this.getDefaultCode();
    editor.getModel()?.setValue(code);
  }

  getDefaultCode(): string {
    return [
      ';*****************************************************',
      '; Welcome to Relay Computer Assembly (RCASM)',
      ';',
      '; Start typing your program below or open an example',
      '; using the open file icon at the top right',
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
