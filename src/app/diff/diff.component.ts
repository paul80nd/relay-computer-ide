import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-ride-diff',
  templateUrl: './diff.component.html',
  imports: [MonacoEditorModule]
})
export class DiffComponent {

  private http = inject(HttpClient);

  stateType: string = 'info';
  stateText: string = 'ready';

  editor: monaco.editor.IStandaloneDiffEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneDiffEditorConstructionOptions>{
    language: 'rcasm',
    lineNumbers: 'on',
    scrollBeyondLastLine: true,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    readOnly: false,
    // minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.IStandaloneDiffEditor) {
    this.editor = editor;

    const code = localStorage.getItem("code") || "";

    const originalModel = monaco.editor.createModel(
      code,
      "text/rcasm"
    );

    const diffCode = localStorage.getItem("diffcode") || "";
    const modifiedModel = monaco.editor.createModel(
      diffCode,
      "text/rcasm"
    );
    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    editor.getModifiedEditor().onDidChangeModelContent(() => {
      const code = editor.getModifiedEditor().getModel()?.getValue()
      if (code) {
        localStorage.setItem("diffcode", code);
      }
    });
  }

}
