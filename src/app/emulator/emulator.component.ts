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

  running = false;

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

  reset() {
    this.memoryArray = new Array(32768);
    this.registerA = 0; this.registerB = 0; this.registerC = 0; this.registerD = 0;
    this.registerI = 0; this.registerPC = 0;
    this.registerM = 0; this.registerXY = 0; this.registerJ = 0;
    this.flagC = false; this.flagS = false; this.flagZ = false;
  }

  step(): boolean {

    // Load Instruction
    const instr = this.registerI = this.memoryArray[this.registerPC];

    // Perform Instruction

    if ((instr & 0xC0) === 0x40) // SETAB 01rvvvvv
    {
      const r = (instr & 0x20) === 0x20;
      const v = (instr & 0x10) === 0x10 ? (instr & 0x0F) + 0xF0 : (instr & 0x0F);
      if (r) { this.registerB = v; } else { this.registerA = v; }
      this.registerPC += 1;
      return true;
    }

    if ((instr & 0xC0) === 0x00) // MOV8 00dddsss
    {
      const d = (instr & 0x38) >> 3
      const s = (instr & 0x07)
      const v = (d === s) ? 0 : this.readMov8Reg[s]();
      this.setMov8Reg[d](v);
      this.registerPC += 1;
      return true;
    }

    if ((instr & 0xF0) === 0x80) // ALU 1000rfff
    {
      const r = (instr & 0x08) === 0x08;
      const f = (instr & 0x07);
      const v = this.aluFunc[f]();
      this.flagZ = (v & 0xFF) === 0;
      this.flagC = (v & 0x100) === 0x100;
      this.flagS = (v & 0x80) === 0x80;
      if (r) { this.registerD = (v & 0xFF); } else { this.registerA = (v & 0xFF); }
      this.registerPC += 1;
      return true;
    }

    if ((instr & 0xF8) === 0xA0) // MOV16 10100dss
    {
      const d = (instr & 0x04) >> 2
      const s = (instr & 0x03)
      const v = (d === 0 && s === 1) ? 0 : this.readMov16Reg[s]();
      this.setMov16Reg[d](v);
      this.registerPC += 1;
      return true;
    }

    if ((instr & 0xC0) === 0xC0) // GOTO 11dscznx
    {
      const d = (instr & 0x20) === 0x20;
      const s = (instr & 0x10) === 0x10;
      const c = (instr & 0x08) === 0x08;
      const z = (instr & 0x04) === 0x04;
      const n = (instr & 0x02) === 0x02;
      const x = (instr & 0x01) === 0x01;

      // Advance PC + load high dest
      this.registerPC += 1;
      let tgt = this.memoryArray[this.registerPC] << 8;

      // Advance PC + load low dest
      this.registerPC += 1;
      tgt += this.memoryArray[this.registerPC];

      // Load Dest
      if (d) { this.registerJ = tgt; } else { this.registerM = tgt; }

      // Advance PC & opt copy
      this.registerPC += 1;
      if (x) { this.registerXY = this.registerPC; }

      // Jump
      const jmp = (s && this.flagS) || (c && this.flagC) || (z && this.flagZ) || (n && !this.flagZ);
      if (jmp) { this.registerPC = tgt; }

      return true;
    }

    return false;
  }

  run() {
    this.running = true;
    this.runLoop();
  }

  stop() {
    this.running = false;
  }

  private runLoop() {
    if (!this.running) { return; }

    if (this.step()) {
      setTimeout(() => this.runLoop(), 10);
    } else {
      this.running = false;
    }
  }

  private readMov8Reg: Array<() => number> = [
    () => this.registerA,
    () => this.registerB,
    () => this.registerC,
    () => this.registerD,
    () => (this.registerM & 0xFF00) >> 8,
    () => this.registerM & 0x00FF,
    () => (this.registerXY & 0xFF00) >> 8,
    () => this.registerXY & 0x00FF,
  ]

  private setMov8Reg: Array<(v: number) => void> = [
    (v) => this.registerA = v,
    (v) => this.registerB = v,
    (v) => this.registerC = v,
    (v) => this.registerD = v,
    (v) => this.registerM = (this.registerM & 0x00FF) + (v << 8),
    (v) => this.registerM = (this.registerM & 0xFF00) + v,
    (v) => this.registerXY = (this.registerXY & 0x00FF) + (v << 8),
    (v) => this.registerXY = (this.registerXY & 0xFF00) + v,
  ]

  private readMov16Reg: Array<() => number> = [
    () => this.registerM,
    () => this.registerXY,
    () => this.registerJ,
    () => 0
  ]

  private setMov16Reg: Array<(v: number) => void> = [
    (v) => this.registerXY = v,
    (v) => this.registerPC = v
  ]

  private aluFunc: Array<() => number> = [
    () => 0,
    () => this.registerB + this.registerC,
    () => this.registerB + 1,
    () => this.registerB & this.registerC,
    () => this.registerB | this.registerC,
    () => this.registerB ^ this.registerC,
    () => (~this.registerB) & 0xFF,
    () => (this.registerB & 0x80) === 0x80 ? (this.registerB << 1) + 1 : (this.registerB << 1)
  ];


}
