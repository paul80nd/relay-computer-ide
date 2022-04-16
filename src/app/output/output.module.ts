import { NgModule } from '@angular/core';

import { OutputComponent } from './output.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [OutputComponent],
  imports: [
    MonacoEditorModule
  ],
  exports: [OutputComponent]
})
export class OutputModule { }
