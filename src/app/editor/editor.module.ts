import { NgModule } from '@angular/core';

import { EditorComponent } from './editor.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    MonacoEditorModule,
    ClarityModule
  ],
  exports: [EditorComponent]
})
export class EditorModule { }
