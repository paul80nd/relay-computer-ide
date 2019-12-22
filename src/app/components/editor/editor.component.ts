import { Component } from '@angular/core';

@Component({
  selector: 'ride-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  editorOptions = {language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
}