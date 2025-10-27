import { makeEnvironmentProviders, NgModule } from '@angular/core';
import { MonacoEditorConfig, NGX_MONACO_EDITOR_CONFIG } from './interfaces';

export function provideMonacoEditor(config: MonacoEditorConfig = {}) {
  return makeEnvironmentProviders([
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: config }
  ]);
}
