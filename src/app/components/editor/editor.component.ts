import { Component } from '@angular/core';

@Component({
  selector: 'ride-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  editorOptions = {language: 'rcasm', lineNumbers: 'off', fontSize: 14, minimap: {enabled: false}};
  code: string = ['; Demo program using MOVE8, SETAB and ALU instructions',
  '; Evaluates ((2 + 4 + 1) x 3) - 3',
  '',
  'ldi b,2		; 2 + 4 = 6',
  'ldi a,4',
  'mov c,a',
  'add',
  '',
  'mov b,a		; 6 + 1 = 7',
  'inc',
  '',
  'mov b,a		; 7 * 3 = 21',
  'mov c,a',
  'add',			
  'mov b,a',
  'add',
  '',
  'ldi b,3		; Negate 3',
  'not d',
  'mov b,d',					
  'inc d',
  'mov b,a		; 21 - 3 = 18',
  'mov c,d',
  'add'].join('\n');
}