import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideMonacoEditor } from './app/ngx-monaco-editor';

import {
  ClarityIcons,
  cogIcon,
  libraryIcon,
  minusIcon,
  plusIcon,
  terminalIcon,
  importIcon,
  exportIcon,
  timesCircleIcon
} from '@cds/core/icon';
import * as rcasmLang from './basic-languages/rcasm';
import * as rcdsmLang from './basic-languages/rcdsm';

if (environment.production) {
  enableProdMode();
}

export function onMonacoLoad() {
  var monaco = (window as any).monaco;
  monaco.languages.register({ id: 'rcasm' });
  monaco.languages.register({ id: 'rcdsm' });
  monaco.languages.setLanguageConfiguration('rcasm', rcasmLang.conf);
  monaco.languages.setMonarchTokensProvider("rcasm", rcasmLang.language);
  monaco.languages.setLanguageConfiguration('rcdsm', rcdsmLang.conf);
  monaco.languages.setMonarchTokensProvider("rcdsm", rcdsmLang.language);
}

ClarityIcons.addIcons(cogIcon, libraryIcon, minusIcon, plusIcon, terminalIcon, importIcon, exportIcon, timesCircleIcon);

bootstrapApplication(AppComponent, {
  providers: [
    provideMonacoEditor({
      monacoPath: 'assets/monaco-editor/min/vs',
      onMonacoLoad
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
