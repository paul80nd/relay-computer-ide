import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-ride-emulator',
  templateUrl: './emulator.component.html'
})
export class EmulatorComponent {

  memoryOffset = 0;
  memoryArray: number[];
  registerA = 0;
  registerB = 0;
  registerC = 0;
  registerD = 0;
  registerM = 0;
  registerXY = 0;
  registerJ = 0;
  registerI = 0;
  registerPC = 0;
  flagZ = false;
  flagS = false;
  flagC = false;

  constructor() {
    this.memoryArray = new Array(32768);
  }

  prevOffset() {
    this.memoryOffset -= 128; // 0x80 page
  }
  nextOffset() {
    this.memoryOffset += 128; // 0x80 page
  }
  load(values: Uint8Array) {
    if (values.length > 2) {
      const offset = values[0] + (values[1] << 8);
      const prog = values.slice(2);
      for (let i = 0; i < prog.length; i++) {
        this.memoryArray[offset + i] = prog[i];
      }
      this.registerPC = offset;
    }
  }

}
