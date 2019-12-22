import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { EditorComponent } from './editor.component';

import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [ EditorComponent ],
  imports:      [ 
      BrowserModule,
      FormsModule,
      MonacoEditorModule.forRoot() ],
  exports:      [ EditorComponent ]
})
export class EditorModule { }
