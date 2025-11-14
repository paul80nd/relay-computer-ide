import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonacoDiffEditorComponent } from '../ngx-monaco-editor';

@Component({
  selector: 'app-ride-diff',
  templateUrl: './diff.component.html',
  imports: [MonacoDiffEditorComponent]
})
export class DiffComponent implements OnInit {
  private http = inject(HttpClient);

  stateType: string = 'info';
  stateText: string = 'ready';

  original: string = '';
  modified: string = '';

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

  ngOnInit(): void {
    this.original = localStorage.getItem("code") || "";
    this.modified = localStorage.getItem("diffcode") || "";
  }

  onInit(editor: monaco.editor.IStandaloneDiffEditor) {
    this.editor = editor;
  }

  onModifiedChanged() {
    const code = this.editor?.getModifiedEditor().getModel()?.getValue()
    if (code) {
      localStorage.setItem("diffcode", code);
    }
  }
}
