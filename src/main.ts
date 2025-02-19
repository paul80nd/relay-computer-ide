import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
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

if (environment.production) {
  enableProdMode();
}

ClarityIcons.addIcons(cogIcon, libraryIcon, minusIcon, plusIcon, terminalIcon, importIcon, exportIcon);

bootstrapApplication(AppComponent, {
    providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
]
})
  .catch(err => console.error(err));
