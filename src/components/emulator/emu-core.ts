export type Snapshot = {
  A: number; B: number; C: number; D: number;
  I: number; PC: number;
  M: number; XY: number; J: number;
  FZ: boolean; FS: boolean; FC: boolean;
  PS: number; CLS: string; cycles: number;
  DVR: number;
};

const InstructionKind = {
  SETAB: 0, MOV8: 1, ALU: 2, LOAD: 3,
  STORE: 4, MOV16: 5, LDSW: 6, HALT: 7,
  INCXY: 8, GOTO: 9, UNKNOWN: 10, DIVIDE: 11
} as const;
type InstructionKind = (typeof InstructionKind)[keyof typeof InstructionKind];

type ExecResult = boolean; // true to continue, false to stop

const KindToCls: Record<InstructionKind, string> = {
  [InstructionKind.SETAB]: 'SETAB',
  [InstructionKind.MOV8]: 'MOV8',
  [InstructionKind.ALU]: 'ALU',
  [InstructionKind.LOAD]: 'LOAD',
  [InstructionKind.STORE]: 'STORE',
  [InstructionKind.MOV16]: 'MOV16',
  [InstructionKind.LDSW]: 'MISC',
  [InstructionKind.HALT]: 'MISC',
  [InstructionKind.INCXY]: 'INCXY',
  [InstructionKind.GOTO]: 'GOTO',
  [InstructionKind.UNKNOWN]: '???',
  [InstructionKind.DIVIDE]: 'INCXY',
};

export type StepTrace = {
  pc: number;
  op: number;
  kind: number; // InstructionKind
  cls: string;
  cyclesDelta: number;
  before: Snapshot;
  after: Snapshot;
};

type TraceFn = (t: StepTrace) => void;

export class EmulatorCore {
  private memory: Uint8Array;
  private memVersion = 0;
  private regs: Snapshot;
  private trace?: TraceFn;

  // Cached decode/exec tables
  private getMov8: Array<() => number> = [];
  private setMov8: Array<(v: number) => void> = [];
  private getMov16: Array<() => number> = [];
  private setMov16: Array<(v: number) => void> = [];
  private aluFunc: Array<() => number> = [];
  private loadReg: Array<(v: number) => void> = [];
  private saveReg: Array<() => number> = [];

  constructor(size = 32768, trace?: TraceFn) {
    this.memory = new Uint8Array(size);
    this.trace = trace;
    this.regs = {
      A: 0, B: 0, C: 0, D: 0,
      I: 0, PC: 0,
      M: 0, XY: 0, J: 0,
      FZ: false, FS: false, FC: false,
      PS: 0, CLS: 'MOV8', cycles: 0,
      DVR: 0
    };
    this.initDecodeTables();
  }

  private initDecodeTables() {
    const r = this.regs;

    // 8-bit sources
    this.getMov8 = [
      () => r.A,
      () => r.B,
      () => r.C,
      () => r.D,
      () => (r.M & 0xff00) >> 8, // M.hi (M1)
      () => r.M & 0x00ff, // M.lo (M2)
      () => (r.XY & 0xff00) >> 8, // XY.hi (X)
      () => r.XY & 0x00ff // XY.lo (Y)
    ];

    // 8-bit destinations
    this.setMov8 = [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff),
      (v: number) => (r.M = (r.M & 0x00ff) | ((v & 0xff) << 8)), // M.hi (M1)
      (v: number) => (r.M = (r.M & 0xff00) | (v & 0xff)), // M.lo (M2)
      (v: number) => (r.XY = (r.XY & 0x00ff) | ((v & 0xff) << 8)), // XY.hi (X)
      (v: number) => (r.XY = (r.XY & 0xff00) | (v & 0xff)) // XY.lo (Y)
    ];

    // 16-bit sources
    this.getMov16 = [() => r.M & 0xffff, () => r.XY & 0xffff, () => r.J & 0xffff, () => 0];

    // 16-bit destinations
    this.setMov16 = [(v: number) => (r.XY = v & 0xffff), (v: number) => (r.PC = v & 0xffff)];

    // LOAD/STORE register select
    this.loadReg = [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff)
    ];
    this.saveReg = [
      () => r.A & 0xff,
      () => r.B & 0xff,
      () => r.C & 0xff,
      () => r.D & 0xff,
      () => 0
    ];

    // ALU functions
    this.aluFunc = [
      () => 0,
      () => r.B + r.C,
      () => r.B + 1,
      () => r.B & r.C,
      () => r.B | r.C,
      () => r.B ^ r.C,
      () => ~r.B & 0xff,
      () => ((r.B & 0x80) === 0x80 ? (r.B << 1) + 1 : r.B << 1)
    ];
  }

  getMemory(): Readonly<Uint8Array> {
    return this.memory;
  }

  getMemoryVersion(): number {
    return this.memVersion;
  }

  getSnapshot(): Readonly<Snapshot> {
    const r = this.regs;
    return Object.freeze({
      A: r.A, B: r.B, C: r.C, D: r.D,
      I: r.I, PC: r.PC,
      M: r.M, XY: r.XY, J: r.J,
      FZ: r.FZ, FS: r.FS, FC: r.FC,
      PS: r.PS, CLS: r.CLS, cycles: r.cycles,
      DVR: r.DVR
    });
  }

  reset(): void {
    this.memory.fill(0);
    this.memVersion++; // memory content changed
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
    const progLen = values.length - 2;
    const memSize = this.memory.length;
    const start = offset & 0x7fff;

    if (start + progLen <= memSize) {
      // single contiguous copy
      this.memory.set(values.subarray(2), start);
    } else {
      // wrap-around copy
      const first = memSize - start;
      this.memory.set(values.subarray(2, 2 + first), start);
      this.memory.set(values.subarray(2 + first), 0);
    }

    this.memVersion++; // program bytes written
    this.regs.PC = offset & 0xffff;
  }

  // Small helpers
  private advPC(n: number) {
    this.regs.PC = (this.regs.PC + n) & 0xffff;
  }
  private tick(n: number) {
    this.regs.cycles += n;
  }

  private decode(op: number): InstructionKind {
    if ((op & 0xc0) === 0x40) return InstructionKind.SETAB;  // 01-- ----
    if ((op & 0xc0) === 0x00) return InstructionKind.MOV8;   // 00-- ----
    if ((op & 0xf0) === 0x80) return InstructionKind.ALU;    // 1000 ----
    if ((op & 0xfc) === 0x90) return InstructionKind.LOAD;   // 1001 00--
    if ((op & 0xfc) === 0x98) return InstructionKind.STORE;  // 1001 10--
    if ((op & 0xf8) === 0xa0) return InstructionKind.MOV16;  // 1010 00--
    if ((op & 0xfe) === 0xac) return InstructionKind.LDSW;   // 1010 110-
    if ((op & 0xfe) === 0xae) return InstructionKind.HALT;   // 1010 111-
    if ((op & 0xff) === 0xb0) return InstructionKind.INCXY;  // 1011 0000
    if ((op & 0xf8) === 0xb8) return InstructionKind.DIVIDE; // 1011 1---
    if ((op & 0xc0) === 0xc0) return InstructionKind.GOTO;   // 11-- ----

    return InstructionKind.UNKNOWN;
  }

  // SETAB 01rvvvvv
  private execSETAB(op: number): ExecResult {
    const r = this.regs;
    const isB = (op & 0x20) === 0x20;
    const v = (op & 0x10) === 0x10 ? (op & 0x0f) + 0xf0 : op & 0x0f;
    if (isB) r.B = v & 0xff;
    else r.A = v & 0xff;
    this.advPC(1);
    this.tick(8);
    return true;
  }

  // MOV8 00dddsss
  private execMOV8(op: number): ExecResult {
    const d = (op & 0x38) >> 3;
    const s = op & 0x07;
    const v = d === s ? 0 : this.getMov8[s]();
    this.setMov8[d](v);
    this.advPC(1);
    this.tick(8);
    return true;
  }

  // ALU 1000rfff
  private execALU(op: number): ExecResult {
    const r = this.regs;
    const toD = (op & 0x08) === 0x08;
    const f = op & 0x07;
    const v = this.aluFunc[f]();
    r.FZ = (v & 0xff) === 0;
    r.FC = (v & 0x100) === 0x100;
    r.FS = (v & 0x80) === 0x80;
    const res = v & 0xff;
    if (toD) r.D = res;
    else r.A = res;
    this.advPC(1);
    this.tick(8);
    return true;
  }

  // LOAD 100100dd
  private execLOAD(op: number): ExecResult {
    const r = this.regs;
    const mem = this.memory;
    const d = op & 0x03;
    const v = mem[r.M & 0x7fff];
    this.advPC(1);
    this.loadReg[d](v);
    this.tick(12);
    return true;
  }

  // STORE 100110ss
  private execSTORE(op: number): ExecResult {
    const r = this.regs;
    const mem = this.memory;
    const s = op & 0x03;
    const v = this.saveReg[s]();
    this.advPC(1);
    mem[r.M & 0x7fff] = v & 0xff;
    this.memVersion++; // memory changed
    this.tick(12);
    return true;
  }

  // MOV16 10100dss
  private execMOV16(op: number): ExecResult {
    const d = (op & 0x04) >> 2;
    const s = op & 0x03;
    const v = d === 0 && s === 1 ? 0 : this.getMov16[s]();
    this.advPC(1);
    this.tick(10);
    this.setMov16[d](v);
    return true;
  }

  // LDSW 1010110d
  private execLDSW(op: number): ExecResult {
    const r = this.regs;
    const toD = (op & 0x01) === 0x01;
    if (toD) r.D = r.PS & 0xff; else r.A = r.PS & 0xff;
    this.advPC(1);
    this.tick(10);
    return true;
  }

  // HALT 1010111r
  private execHALT(op: number): ExecResult {
    const r = this.regs;
    const doJump = (op & 0x01) === 0x01;
    this.advPC(1);
    this.tick(10);
    if (doJump) r.PC = r.PS & 0xffff;
    return false;
  }

  // INCXY 10110000
  private execINCXY(_op: number): ExecResult {
    const r = this.regs;
    r.XY = (r.XY + 1) & 0xffff;
    this.advPC(1);
    this.tick(14);
    return true;
  }

  // GOTO 11dscznx
  private execGOTO(op: number): ExecResult {
    const r = this.regs;
    const mem = this.memory;
    const d = (op & 0x20) === 0x20;
    const s = (op & 0x10) === 0x10;
    const c = (op & 0x08) === 0x08;
    const z = (op & 0x04) === 0x04;
    const n = (op & 0x02) === 0x02;
    const x = (op & 0x01) === 0x01;

    this.advPC(1);
    let tgt = (mem[r.PC & 0x7fff] << 8) & 0xff00;

    this.advPC(1);
    tgt |= mem[r.PC & 0x7fff];

    if (d) r.J = tgt & 0xffff;
    else r.M = tgt & 0xffff;

    this.advPC(1);
    if (x) r.XY = r.PC & 0xffff;

    const jmp = (s && r.FS) || (c && r.FC) || (z && r.FZ) || (n && !r.FZ);
    if (jmp) r.PC = tgt & 0xffff;

    this.tick(24);
    return true;
  }

  // DIVIDE 10111cod
  private execDIVIDE(op: number): ExecResult {
    const r = this.regs;
    const isMod = (op & 0x02) === 0x02;
    const isCont = (op & 0x04) === 0x04;
    const toD = (op & 0x01) === 0x01;
    let res = 0; let rem = 0;
    if (isMod) {
      if (r.C == 0) {
        // Modulo by zero
        res = r.B;
        rem = r.B;
      }
      else if (isCont) {
        // Remainder modulo
        res = rem = r.DVR % r.C;
      } else {
        // Quotient modulo
        res = rem = r.B % r.C;
      }
    }
    else {
      if (r.C == 0) {
        // Divide by zero
        res = 0xFF;
        rem = r.B;
      }
      else if (isCont) {
        // Remainder divide
        res = Math.floor(r.DVR / r.C);
        rem = r.DVR % r.C;
      } else {
        // Quotient divide
        res = Math.floor(r.B / r.C);
        rem = r.B % r.C;
      }
    }
    if (toD) r.D = res; else r.A = res;
    r.DVR = rem;
    this.advPC(1);
    this.tick(24);
    return true;
  }

  step(): ExecResult {
    const r = this.regs;
    const pc0 = r.PC;
    const cy0 = r.cycles;
    const before = this.getSnapshot(); // frozen value object

    const op = (r.I = this.memory[r.PC & 0x7fff] ?? 0);
    const kind = this.decode(op);
    r.CLS = KindToCls[kind];

    let cont: boolean;
    switch (kind) {
      case InstructionKind.SETAB:
        cont = this.execSETAB(op);
        break;
      case InstructionKind.MOV8:
        cont = this.execMOV8(op);
        break;
      case InstructionKind.ALU:
        cont = this.execALU(op);
        break;
      case InstructionKind.LOAD:
        cont = this.execLOAD(op);
        break;
      case InstructionKind.STORE:
        cont = this.execSTORE(op);
        break;
      case InstructionKind.MOV16:
        cont = this.execMOV16(op);
        break;
      case InstructionKind.LDSW:
        cont = this.execLDSW(op);
        break;
      case InstructionKind.HALT:
        cont = this.execHALT(op);
        break;
      case InstructionKind.INCXY:
        cont = this.execINCXY(op);
        break;
      case InstructionKind.GOTO:
        cont = this.execGOTO(op);
        break;
      case InstructionKind.DIVIDE:
        cont = this.execDIVIDE(op);
        break;
      default:
        cont = false;
    }

    if (this.trace) {
      const after = this.getSnapshot();
      this.trace({
        pc: pc0,
        op,
        kind,
        cls: r.CLS,
        cyclesDelta: after.cycles - cy0,
        before,
        after
      });
    }

    return cont;
  }

  // Direct accessors used by UI switches
  flipPrimarySwitchBit(pos: number) {
    const bit = Math.max(0, Math.min(7, pos | 0));
    this.regs.PS = this.regs.PS ^ (1 << bit);
  }
}
