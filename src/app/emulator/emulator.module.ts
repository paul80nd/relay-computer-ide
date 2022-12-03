import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DecPipe } from './dec.pipe';
import { HexPipe } from './hex.pipe';
import { EmulatorComponent } from './emulator.component';

@NgModule({
  declarations: [
    EmulatorComponent,
    DecPipe,
    HexPipe],
  imports: [BrowserModule],
  exports: [EmulatorComponent]
})
export class EmulatorModule { }
