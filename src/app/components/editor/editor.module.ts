import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { EditorComponent } from './editor.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

interface MonarchLanguageConfiguration extends monaco.languages.IMonarchLanguage {
  keywords: string[];
}
interface MonarchLanguageCompletionItemProvider extends monaco.languages.CompletionItemProvider {
  completionMnemonics: any;
}

export function onMonacoLoad() {

}


const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad
};

@NgModule({
  declarations: [EditorComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig)],
  exports: [EditorComponent]
})
export class EditorModule { }
