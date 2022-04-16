import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { ClarityModule } from '@clr/angular';
import { EditorModule } from './editor/editor.module';
import { OutputModule } from './output/output.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    EditorModule,
    OutputModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
