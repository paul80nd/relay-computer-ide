import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HexPipe } from './hex.pipe';
import { EmulatorComponent } from './emulator.component';

@NgModule({
  declarations: [
    EmulatorComponent,
    HexPipe],
  imports: [BrowserModule],
  exports: [EmulatorComponent]
})
export class EmulatorModule { }
