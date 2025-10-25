import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideMonacoEditor } from './app/ngx-monaco-editor-v2';
import {
  ClarityIcons,
  cogIcon,
  libraryIcon,
  minusIcon,
  plusIcon,
  terminalIcon,
  importIcon,
  exportIcon
} from '@cds/core/icon';
import * as monaco from 'monaco-editor';
//import * as rcasmLang from './basic-languages/rcasm';

if (environment.production) {
  enableProdMode();
}

//export function onMonacoLoad() {
//  monaco.languages.register({ id: "rcasm" });
//  monaco.languages.register({ id: "rcdsm" });
// monaco.languages.setMonarchTokensProvider("rcasm", rcasmLang.language);
//}

ClarityIcons.addIcons(cogIcon, libraryIcon, minusIcon, plusIcon, terminalIcon, importIcon, exportIcon);

bootstrapApplication(AppComponent, {
  providers: [
    provideMonacoEditor({
//      onMonacoLoad
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
