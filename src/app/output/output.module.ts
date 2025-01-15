import { NgModule } from '@angular/core';

import { OutputComponent } from './output.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ClarityModule } from '@clr/angular';

@NgModule({
    imports: [
        MonacoEditorModule,
        ClarityModule,
        OutputComponent,
    ],
    exports: [OutputComponent]
})
export class OutputModule { }
