import { Component, Input } from '@angular/core';

@Component({
  selector: 'ride-output',
  templateUrl: './output.component.html'
})
export class OutputComponent {

  @Input()
  set dasm(val: string) {
    this.editor?.getModel()?.setValue(val);
  }

  editor: monaco.editor.ICodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcdsm',
    lineNumbers: 'off',
    renderLineHighlight: 'none',
    readOnly: true, domReadOnly: true,
    scrollBeyondLastLine: true,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.ICodeEditor) {
    this.editor = editor;
  }

}
