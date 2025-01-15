import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ClrCheckboxModule } from '@clr/angular';

import { BinPipe } from './bin.pipe';
import { DecPipe } from './dec.pipe';
import { HexPipe } from './hex.pipe';
import { EmulatorComponent } from './emulator.component';

@NgModule({
    imports: [BrowserModule, ClrCheckboxModule, EmulatorComponent,
        BinPipe,
        DecPipe,
        HexPipe],
    exports: [EmulatorComponent]
})
export class EmulatorModule { }
