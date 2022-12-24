import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ClrCheckboxModule } from '@clr/angular';

import { BinPipe } from './bin.pipe';
import { DecPipe } from './dec.pipe';
import { HexPipe } from './hex.pipe';
import { EmulatorComponent } from './emulator.component';

@NgModule({
  declarations: [
    EmulatorComponent,
    BinPipe,
    DecPipe,
    HexPipe],
  imports: [BrowserModule, ClrCheckboxModule],
  exports: [EmulatorComponent]
})
export class EmulatorModule { }
