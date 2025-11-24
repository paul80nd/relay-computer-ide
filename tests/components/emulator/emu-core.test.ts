// TypeScript
import { EmulatorCore, Snapshot } from '../../../src/components/emulator/emu-core';

function program(offset: number, bytes: number[]): Uint8Array {
  // Little-endian offset header, then program bytes
  const hdr = [offset & 0xff, (offset >> 8) & 0xff];
  return new Uint8Array([...hdr, ...bytes.map(b => b & 0xff)]);
}

// Opcodes helpers based on current core:
// - SETAB: 01 r vvvvv (r=1->B, r=0->A; v: if bit4 set, sign-extended nibble)
const SETA = (v: number) => 0x40 | (v & 0x1f);
const SETB = (v: number) => 0x60 | (v & 0x1f);
// - MOV8: 00 ddd sss
const MOV8 = (d: number, s: number) => ((d & 0x7) << 3) | (s & 0x7);
// - ALU: 1000 r fff  (r=1 -> D, r=0 -> A; f = func index per aluFunc)
const ALU_TO_A = (f: number) => 0x80 | (f & 0x7);
const ALU_TO_D = (f: number) => 0x88 | (f & 0x7);
// - LOAD: 100100dd
const LOAD_TO = (d: number) => 0x90 | (d & 0x3);
// - STORE: 100110ss
const STORE_FROM = (s: number) => 0x98 | (s & 0x3);
// - MOV16: 10100 d ss  (d=0 -> XY, d=1 -> PC; s: 0=M,1=XY,2=J,3=0)
const MOV16 = (d: number, s: number) => 0xa0 | ((d & 0x1) << 2) | (s & 0x3);
// - LDSW: 1010110d (d=1 -> D, d=0 -> A)
const LDSW_TO = (toD: boolean) => 0xac | (toD ? 0x01 : 0x00);
// - HALT: 1010111r (r=1 -> jump to PS, else stop)
const HALT = (r: 0 | 1 = 0) => 0xae | (r & 0x01);
// - INCXY: 10110000
const INCXY = 0xb0;
// - GOTO: 11 d s c z n x, then hi, then lo
const GOTO = (opts: { d?: 0 | 1; s?: 0 | 1; c?: 0 | 1; z?: 0 | 1; n?: 0 | 1; x?: 0 | 1 }, hi: number, lo: number) => {
  const { d = 0, s = 0, c = 0, z = 0, n = 0, x = 0 } = opts;
  const op = 0xc0 | ((d & 1) << 5) | ((s & 1) << 4) | ((c & 1) << 3) | ((z & 1) << 2) | ((n & 1) << 1) | (x & 1);
  return [op, hi & 0xff, lo & 0xff];
};

describe('EmulatorCore - reset/load/step basics', () => {
  test('reset initializes registers, flags, cycles, memory version increments', () => {
    const core = new EmulatorCore();
    const v0 = core.getMemoryVersion();
    core.reset();
    const snap = core.getSnapshot();

    expect(core.getMemory()[0]).toBe(0);
    expect(core.getMemoryVersion()).toBeGreaterThanOrEqual(v0 + 1);

    expect(snap.PC).toBe(0);
    expect(snap.A).toBe(0);
    expect(snap.B).toBe(0);
    expect(snap.C).toBe(0);
    expect(snap.D).toBe(0);
    expect(snap.M).toBe(0);
    expect(snap.XY).toBe(0);
    expect(snap.J).toBe(0);
    expect(snap.FZ).toBe(false);
    expect(snap.FS).toBe(false);
    expect(snap.FC).toBe(false);
    expect(snap.PS).toBe(0);
    expect(snap.cycles).toBe(0);
  });

  test('load writes program at offset, wraps, sets PC, bumps version', () => {
    const core = new EmulatorCore();
    core.reset();
    const startVersion = core.getMemoryVersion();

    // Place 4 bytes near end to force wrap
    const offset = 0x7ffe;
    const bytes = [SETA(0x02), SETB(0x03), HALT()];
    core.load(program(offset, bytes));
    const mem = core.getMemory();

    expect(core.getSnapshot().PC).toBe(offset);
    expect(core.getMemoryVersion()).toBeGreaterThan(startVersion);

    // Verify bytes with wrap
    expect(mem[0x7ffe]).toBe(bytes[0]);
    expect(mem[0x7fff]).toBe(bytes[1]);
    expect(mem[0x0000]).toBe(bytes[2]);
  });

  test('step returns false on HALT and true otherwise', () => {
    const core = new EmulatorCore();
    const offset = 0x0100;
    core.load(program(offset, [HALT()]));
    expect(core.step()).toBe(false);
    expect(core.getSnapshot().PC).toBe((offset + 1) & 0xffff);
  });
});

describe('Instruction behavior', () => {
  test('SETAB loads A/B with signed nibble, cycles accounted', () => {
    const core = new EmulatorCore();
    const start = 0x0100;
    // SETA +3, SETB -1 (0x1f represents -1 per encoding), HALT
    core.load(program(start, [SETA(0x03), SETB(0x1f), HALT()]));

    // Step 1
    expect(core.step()).toBe(true);
    let s1 = core.getSnapshot();
    expect(s1.A).toBe(0x03);
    expect(s1.B).toBe(0x00);
    expect(s1.PC).toBe((start + 1) & 0xffff);
    expect(s1.cycles).toBe(8);

    // Step 2
    expect(core.step()).toBe(true);
    let s2 = core.getSnapshot();
    expect(s2.B).toBe(0xff); // -1 as 8-bit
    expect(s2.cycles).toBe(16);

    // Step 3
    expect(core.step()).toBe(false);
    const s3 = core.getSnapshot();
    expect(s3.PC).toBe((start + 3) & 0xffff);
    expect(s3.cycles).toBe(26); // HALT counts 10 cycles in core
  });

  test('MOV8 moves between regs and M/XY halves', () => {
    const core = new EmulatorCore();
    // SETA 0x0A, then MOV8: B <- A, then MOV8: high(M) <- B
    core.load(program(0x0000, [SETA(0x0a), MOV8(1, 0), MOV8(4, 1), HALT()]));
    expect(core.step()).toBe(true); // SETA
    expect(core.getSnapshot().A).toBe(0x0a);

    expect(core.step()).toBe(true); // MOV B <- A
    expect(core.getSnapshot().B).toBe(0x0a);

    expect(core.step()).toBe(true); // MOV M.hi <- B
    expect(core.getSnapshot().M).toBe(0x0a00);

    expect(core.step()).toBe(false); // HALT
  });

  test('ALU sets A/D and updates FZ, FS, FC correctly', () => {
    const core = new EmulatorCore();
    // Prepare B and C: B=0xFF, C=0x01 then ALU f=1: B+C -> A; then ALU f=6: ~B -> D
    core.load(program(0x0000, [SETB(0x1f), SETA(0x01), MOV8(2, 0), // C <- A (C=1)
    ALU_TO_A(1), ALU_TO_D(6), HALT()]));
    // After SETB(-1), B=0xFF
    core.step(); // SETB
    core.step(); // SETA
    core.step(); // MOV C <- A (C=1)

    expect(core.step()).toBe(true); // ALU f=1: B + C = 0xFF + 0x01 = 0x100
    let s = core.getSnapshot();
    expect(s.A).toBe(0x00);
    expect(s.FZ).toBe(true);
    expect(s.FC).toBe(true);
    expect(s.FS).toBe(false);

    expect(core.step()).toBe(true); // ALU f=6: ~B
    s = core.getSnapshot();
    expect(s.D).toBe(0x00); // ~0xff & 0xff = 0x00
    expect(s.FZ).toBe(true);
    expect(s.FC).toBe(false);
    expect(s.FS).toBe(false);

    expect(core.step()).toBe(false); // HALT
  });

  test('LOAD and STORE with M address, version bumps on STORE', () => {
    const core = new EmulatorCore();
    const start = 0x0100;
    // Set B=0x2A, M.low <- B (so M=0x002A), STORE from B to [M], LOAD to A from [M]
    core.load(program(start, [
      SETB(0x0a),         // B=0x0A
      MOV8(5, 1),         // M.low <- B (M=0x000A)
      STORE_FROM(1),      // [M] <- B
      LOAD_TO(0),         // A <- [M]
      HALT()
    ]));

    const vBefore = core.getMemoryVersion();
    core.step(); // SETB
    core.step(); // MOV M.low <- B
    core.step(); // STORE
    const vAfterStore = core.getMemoryVersion();
    expect(vAfterStore).toBeGreaterThan(vBefore);

    core.step(); // LOAD
    const s = core.getSnapshot();
    expect(s.A).toBe(0x0a);
    expect(core.step()).toBe(false); // HALT
  });

  test('MOV16 and INCXY modify 16-bit regs and PC', () => {
    const core = new EmulatorCore();
    // Set M=0x1234 via MOV8, then MOV16 XY <- M, INCXY, MOV16 PC <- XY
    core.load(program(0, [
      ...GOTO({ d: 0, s: 0, c: 0, z: 0, n: 0, x: 0 }, 0x12, 0x34),  // M <- 0x1234
      MOV16(0, 0),                  // XY <- M = 0x1234
      INCXY,                        // XY = 0x1235
      MOV16(1, 1),                  // PC <- XY = 0x1235
    ]));
    // Run 5 steps to move PC
    for (let i = 0; i < 5; i++) expect(core.step()).toBe(true);
    const s = core.getSnapshot();
    expect(s.M).toBe(0x1234);
    expect(s.XY).toBe(0x1235);
    expect(s.PC).toBe(0x1236);
  });

  function padTo(addrStart: number, currentLen: number, targetAddr: number): number[] {
    const currentAddr = (addrStart + currentLen) & 0xffff;
    let pad = (targetAddr - currentAddr) & 0xffff;
    // We want the next byte written to be at targetAddr, so pad is correct as-is.
    return new Array(pad).fill(0x00);
  }

  test('GOTO: captures XY when x=1, writes M/J, and jumps when condition true', () => {
    const core = new EmulatorCore();
    const start = 0x0300;
    const tgt = 0x3456;

    const progPrefix = [
      SETB(0x1f),
      MOV8(2, 1),               // C <- B
      ALU_TO_A(5),             // B ^ C => 0x00 => Z=true
      ...GOTO({ d: 1, z: 1, x: 1 }, (tgt >> 8) & 0xff, tgt & 0xff),
    ];
    const pad = padTo(start, progPrefix.length + 1, tgt); // +1 for the following HALT we’ll add at target
    const prog = [...progPrefix, HALT(), ...pad, HALT()]; // HALT immediately after GOTO (will be skipped), and HALT at tgt

    core.load(program(start, prog));

    // Execute steps: 3 for setup, 1 for GOTO -> jump
    for (let i = 0; i < 4; i++) expect(core.step()).toBe(true);

    const s = core.getSnapshot();
    expect(s.J).toBe(tgt);                         // d=1 -> J loaded
    expect(s.XY).toBe((start + progPrefix.length) & 0xffff);
    expect(s.PC).toBe(tgt);                        // jumped

    expect(core.step()).toBe(false);               // HALT at target
  });

});
