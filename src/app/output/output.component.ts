import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ride-output',
  templateUrl: './output.component.html'
})
export class OutputComponent {

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
    const code = this.getDefaultCode();
    editor.getModel()?.setValue(code);
  }

  getDefaultCode(): string {
    return [
      '0000: 41           ldi a,1',
      '0001: 60           ldi b,0',
      '0002: 11           mov c,b',
      '0003: 08           mov b,a',
      '0004: 81           add',
      '0005: E8 00 05     bcs',
      '0008: E6 00 02     jmp'].join('\n');
  }

}
