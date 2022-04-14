import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { EditorComponent } from './editor.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule
  ],
  exports: [EditorComponent]
})
export class EditorModule { }
