export type Snapshot = {
  A: number;
  B: number;
  C: number;
  D: number;
  I: number;
  PC: number;
  M: number;
  XY: number;
  J: number;
  FZ: boolean;
  FS: boolean;
  FC: boolean;
  PS: number;
  CLS: string;
  cycles: number;
};

export class EmulatorCore {
  private memory: number[];
  private regs: Snapshot;

  constructor(size = 32768) {
    this.memory = new Array(size);
    this.regs = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      I: 0,
      PC: 0,
      M: 0,
      XY: 0,
      J: 0,
      FZ: false,
      FS: false,
      FC: false,
      PS: 0,
      CLS: 'MOV8',
      cycles: 0,
    };
  }

  getMemory(): ReadonlyArray<number | undefined> {
    return this.memory.slice();
  }

  getSnapshot(): Readonly<Snapshot> {
    const r = this.regs;
    return Object.freeze({
      A: r.A,
      B: r.B,
      C: r.C,
      D: r.D,
      I: r.I,
      PC: r.PC,
      M: r.M,
      XY: r.XY,
      J: r.J,
      FZ: r.FZ,
      FS: r.FS,
      FC: r.FC,
      PS: r.PS,
      CLS: r.CLS,
      cycles: r.cycles,
    });
  }

  private countCycles(n: number) {
    this.regs.cycles += n;
  }

  reset(): void {
    this.memory = new Array(32768);
    const r = this.regs;
    r.A = r.B = r.C = r.D = 0;
    r.I = r.PC = 0;
    r.M = r.XY = r.J = 0;
    r.FC = r.FS = r.FZ = false;
    r.PS = 0;
    r.cycles = 0;
  }

  load(values: Uint8Array): void {
    if (values.length <= 2) return;
    this.reset();

    const offset = (values[0] + (values[1] << 8)) & 0xffff;
    const prog = values.slice(2);

    for (let i = 0; i < prog.length; i++) {
      const addr = (offset + i) & 0x7fff; // memory is 32K (of full address space)
      this.memory[(offset + i) & 0x7fff] = prog[i] & 0xff;
      this.memory[addr] = prog[i] & 0xff;
    }

    this.regs.PC = offset & 0xffff;
  }

  // Decoders and helpers (moved from component)
  private get getMov8() {
    const r = this.regs;
    return [
      () => r.A,
      () => r.B,
      () => r.C,
      () => r.D,
      () => (r.M & 0xff00) >> 8,
      () => r.M & 0x00ff,
      () => (r.XY & 0xff00) >> 8,
      () => r.XY & 0x00ff,
    ] as Array<() => number>;
  }
  private get setMov8() {
    const r = this.regs;
    return [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff),
      (v: number) => (r.M = (r.M & 0x00ff) | ((v & 0xff) << 8)),
      (v: number) => (r.M = (r.M & 0xff00) | (v & 0xff)),
      (v: number) => (r.XY = (r.XY & 0x00ff) | ((v & 0xff) << 8)),
      (v: number) => (r.XY = (r.XY & 0xff00) | (v & 0xff)),
    ] as Array<(v: number) => void>;
  }
  private get loadReg() {
    const r = this.regs;
    return [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff),
    ] as Array<(v: number) => void>;
  }
  private get saveReg() {
    const r = this.regs;
    return [() => r.A & 0xff, () => r.B & 0xff, () => r.C & 0xff, () => r.D & 0xff, () => 0] as Array<() => number>;
  }
  private get getMov16() {
    const r = this.regs;
    return [() => r.M & 0xffff, () => r.XY & 0xffff, () => r.J & 0xffff, () => 0] as Array<() => number>;
  }
  private get setMov16() {
    const r = this.regs;
    return [(v: number) => (r.XY = v & 0xffff), (v: number) => (r.PC = v & 0xffff)] as Array<(v: number) => void>;
  }
  private get aluFunc() {
    const r = this.regs;
    return [
      () => 0,
      () => r.B + r.C,
      () => r.B + 1,
      () => r.B & r.C,
      () => r.B | r.C,
      () => r.B ^ r.C,
      () => ~r.B & 0xff,
      () => ((r.B & 0x80) === 0x80 ? (r.B << 1) + 1 : r.B << 1),
    ] as Array<() => number>;
  }

  step(): boolean {
    const mem = this.memory;
    const r = this.regs;

    const instr = (r.I = mem[r.PC] ?? 0);

    // SETAB 01rvvvvv
    if ((instr & 0xc0) === 0x40) {
      r.CLS = 'SETAB';
      const isB = (instr & 0x20) === 0x20;
      const v = (instr & 0x10) === 0x10 ? (instr & 0x0f) + 0xf0 : instr & 0x0f;
      if (isB) r.B = v & 0xff;
      else r.A = v & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // MOV8 00dddsss
    if ((instr & 0xc0) === 0x00) {
      r.CLS = 'MOV8';
      const d = (instr & 0x38) >> 3;
      const s = instr & 0x07;
      const v = d === s ? 0 : this.getMov8[s]();
      this.setMov8[d](v);
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // ALU 1000rfff
    if ((instr & 0xf0) === 0x80) {
      r.CLS = 'ALU';
      const toD = (instr & 0x08) === 0x08;
      const f = instr & 0x07;
      const v = this.aluFunc[f]();
      r.FZ = (v & 0xff) === 0;
      r.FC = (v & 0x100) === 0x100;
      r.FS = (v & 0x80) === 0x80;
      const res = v & 0xff;
      if (toD) r.D = res;
      else r.A = res;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // LOAD 100100dd
    if ((instr & 0xfc) === 0x90) {
      r.CLS = 'LOAD';
      const d = instr & 0x03;
      const v = mem[r.M & 0x7fff] ?? 0;
      r.PC = (r.PC + 1) & 0xffff;
      this.loadReg[d](v);
      this.countCycles(12);
      return true;
    }

    // STORE 100110ss
    if ((instr & 0xfc) === 0x98) {
      r.CLS = 'STORE';
      const s = instr & 0x03;
      const v = this.saveReg[s]();
      r.PC = (r.PC + 1) & 0xffff;
      mem[r.M & 0x7fff] = v & 0xff;
      this.countCycles(12);
      return true;
    }

    // MOV16 10100dss
    if ((instr & 0xf8) === 0xa0) {
      r.CLS = 'MOV16';
      const d = (instr & 0x04) >> 2;
      const s = instr & 0x03;
      const v = d === 0 && s === 1 ? 0 : this.getMov16[s]();
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      this.setMov16[d](v);
      return true;
    }

    // LDSW 1010110d
    if ((instr & 0xfe) === 0xac) {
      r.CLS = 'MISC';
      const toD = (instr & 0x01) === 0x01;
      if (toD) r.D = r.PS & 0xff;
      else r.A = r.PS & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      return true;
    }

    // HALT 1010111r
    if ((instr & 0xfe) === 0xae) {
      r.CLS = 'MISC';
      const doJump = (instr & 0x01) === 0x01;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      if (doJump) r.PC = r.PS & 0xffff;
      return false;
    }

    // INCXY 10110000
    if ((instr & 0xff) === 0xb0) {
      r.CLS = 'INCXY';
      r.XY = (r.XY + 1) & 0xffff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(14);
      return true;
    }

    // GOTO 11dscznx
    if ((instr & 0xc0) === 0xc0) {
      r.CLS = 'GOTO';
      const d = (instr & 0x20) === 0x20;
      const s = (instr & 0x10) === 0x10;
      const c = (instr & 0x08) === 0x08;
      const z = (instr & 0x04) === 0x04;
      const n = (instr & 0x02) === 0x02;
      const x = (instr & 0x01) === 0x01;

      r.PC = (r.PC + 1) & 0xffff;
      let tgt = ((mem[r.PC] ?? 0) << 8) & 0xff00;

      r.PC = (r.PC + 1) & 0xffff;
      tgt += (mem[r.PC] ?? 0) & 0x00ff;

      if (d) r.J = tgt & 0xffff;
      else r.M = tgt & 0xffff;

      r.PC = (r.PC + 1) & 0xffff;
      if (x) r.XY = r.PC & 0xffff;

      const jmp = (s && r.FS) || (c && r.FC) || (z && r.FZ) || (n && !r.FZ);
      if (jmp) r.PC = tgt & 0xffff;

      this.countCycles(24);
      return true;
    }

    r.CLS = '???';
    return false;
  }

  // Direct accessors used by UI switches
  flipPrimarySwitchBit(pos: number) {
    const bit = Math.max(0, Math.min(7, pos | 0));
    this.regs.PS = this.regs.PS ^ (1 << bit);
  }
}
