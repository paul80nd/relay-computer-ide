import { Component } from '@angular/core';

@Component({
  selector: 'app-ride-emulator',
  templateUrl: './emulator.component.html'
})
export class EmulatorComponent {

  memoryOffset = 0;
  memoryArray: number[];

  constructor() {
    this.memoryArray = new Array(32768);
  }

  prevOffset() {
    this.memoryOffset -= 128; // 0x80 page
  }
  nextOffset() {
    this.memoryOffset += 128; // 0x80 page
  }

}
