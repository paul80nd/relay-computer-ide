import { Component } from '@angular/core';

@Component({
  selector: 'ride-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  editorOptions = {language: 'rcasm', lineNumbers: 'off', fontSize: 14, renderLineHighlight: 'none', minimap: {enabled: false}};
  code: string = [
    '',
    ';*****************************************************',             
    '; Demo program to calculate Fibonacci series',
    '; Result is placed in A register on each loop',
    '; until calculation overflows. Result is:',
    '; 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233',
    ';*****************************************************',
    '',
    'start:  ldi a,1     ; Inital setup A = B = 1',
    '        mov b,a',
    '',
    'loop:   mov c,b     ; Calculate C = B, B = A then add',
    '        mov b,a',
    '        add',
    '',
    '        bnz loop    ; Loop until zero',
    '',
    'end:    jmp end     ; infinite loop'].join('\n');
}
