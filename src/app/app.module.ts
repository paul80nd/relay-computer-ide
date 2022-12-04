import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ClarityModule } from '@clr/angular';
import { DocsModule } from './docs/docs.module';
import { EditorModule } from './editor/editor.module';
import { EmulatorModule } from './emulator/emulator.module';
import { OutputModule } from './output/output.module';

import {
  ClarityIcons,
  downloadCloudIcon,
  libraryIcon,
  terminalIcon,
  uploadCloudIcon
} from '@cds/core/icon';

ClarityIcons.addIcons(downloadCloudIcon, libraryIcon, terminalIcon, uploadCloudIcon);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    DocsModule,
    EditorModule,
    EmulatorModule,
    HttpClientModule,
    OutputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
