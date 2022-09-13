import { NgModule } from '@angular/core';

import { OutputComponent } from './output.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [OutputComponent],
  imports: [
    MonacoEditorModule,
    ClarityModule,
  ],
  exports: [OutputComponent]
})
export class OutputModule { }
