import { makeEnvironmentProviders, NgModule } from '@angular/core';
import { MonacoEditorLoaderDirective } from './directives/monaco-editor-loader.directive';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { MonacoDiffEditorComponent } from './components/monaco-diff-editor/monaco-diff-editor.component';
import { MonacoEditorConfig, NGX_MONACO_EDITOR_CONFIG } from './interfaces';

@NgModule({
    imports: [],
    declarations: [
        MonacoEditorLoaderDirective,
        MonacoEditorComponent,
        MonacoDiffEditorComponent
    ],
    exports: [
        MonacoEditorLoaderDirective,
        MonacoEditorComponent,
        MonacoDiffEditorComponent
    ]
})
export class MonacoEditorModule { }

export function provideMonacoEditor(config: MonacoEditorConfig = {}) {
  return makeEnvironmentProviders([
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: config }
  ]);
}
