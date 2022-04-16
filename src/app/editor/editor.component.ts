import { Component,  EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'ride-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  @Output() codeChanged = new EventEmitter<string>();

  editor: monaco.editor.ICodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcasm',
    lineNumbers: 'off',
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
      '; Demo program to calculate Fibonacci series',
      '; Result is placed in A register on each loop',
      '; until calculation overflows. Result is:',
      '; 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233',
      ';*****************************************************',
      '',
      'start:  ldi a,1     ; inital setup A = 1',
      '        ldi b,0     ;              B = 0',
      '',
      'loop:   mov c,b     ; slide B -> C',
      '        mov b,a     ;       A -> B',
      '        add         ; and add together',
      '',
      'done:   bcs done    ; infinite loop if overflowed',
      '',
      '        jmp loop    ; otherwise have another go'].join('\n');
  }

  loadExample() {
    this.editor?.getModel()?.setValue(this.getDefaultCode());
  }

}
