import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ClarityModule } from '@clr/angular';
import { DocsModule } from './docs/docs.module';
import { EditorModule } from './editor/editor.module';
import { EmulatorModule } from './emulator/emulator.module';
import { OutputModule } from './output/output.module';

import {
  ClarityIcons,
  libraryIcon,
  terminalIcon,
  importIcon,
  exportIcon
} from '@cds/core/icon';

ClarityIcons.addIcons(libraryIcon, terminalIcon, importIcon, exportIcon);

@NgModule({
  declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ClarityModule,
        DocsModule,
        EditorModule,
        EmulatorModule,
        OutputModule
      ],
    providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
