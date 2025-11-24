// TypeScript
import { EmulatorCore, Snapshot } from '../../../src/components/emulator/emu-core';
import { expectPC, expectRegs } from './helpers/asserts';
import { ALU_TO_A, ALU_TO_D, GOTO, HALT, INCXY, LOAD_TO, MOV16, MOV8, SETA, SETB, STORE_FROM } from './helpers/opcodes';
import { padTo, program } from './helpers/program';

describe('EmulatorCore - reset/load/step basics', () => {
  test('reset initializes registers, flags, cycles, memory version increments', () => {
    const core = new EmulatorCore();
    const v0 = core.getMemoryVersion();
    core.reset();
    const snap = core.getSnapshot();

    expect(core.getMemory()[0]).toBe(0);
    expect(core.getMemoryVersion()).toBeGreaterThanOrEqual(v0 + 1);

    expectRegs(snap, { A: 0, B: 0, C: 0, D: 0, M: 0, XY: 0, J: 0, PC: 0, FZ: false, FS: false, FC: false, PS: 0, cycles: 0 });
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
    expectPC(core.getSnapshot(), (offset + 1) & 0xffff);
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
    expectRegs(s1, { A: 0x03, B: 0x00, PC: (start + 1) & 0xffff, cycles: 8 })

    // Step 2
    expect(core.step()).toBe(true);
    let s2 = core.getSnapshot();
    expectRegs(s2, { B: 0xff, cycles: 16 }) // -1 as 8-bit

    // Step 3
    expect(core.step()).toBe(false);
    const s3 = core.getSnapshot();
    expectRegs(s3, { PC: (start + 3) & 0xffff, cycles: 26 })// HALT counts 10 cycles in core
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
    expectRegs(s, { A: 0x00, FZ: true, FC: true, FS: false })

    expect(core.step()).toBe(true); // ALU f=6: ~B
    s = core.getSnapshot();
    expectRegs(s, { D: 0x00, FZ: true, FC: false, FS: false }) // ~0xff & 0xff = 0x00

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
    expectRegs(s, { M: 0x1234, XY: 0x1235 });
    expectPC(s, 0x1236);
  });

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
    expect(s.J).toBe(tgt);  // d=1 -> J loaded
    expect(s.XY).toBe((start + progPrefix.length) & 0xffff);
    expectPC(s, tgt)        // jumped

    expect(core.step()).toBe(false); // HALT at target
  });

  test('HALT with jump to PS sets PC to PS', () => {
    const core = new EmulatorCore();
    // We'll use PS = 0x0042 by toggling bits 1,6:
    core.reset();
    const start = 0x0200;
    const prog = [HALT(1)]; // HALT with jump
    core.load(program(start, prog));
    core.flipPrimarySwitchBit(1);
    core.flipPrimarySwitchBit(6);
    // PS now equals (1<<1) | (1<<6) = 0x42
    expect(core.step()).toBe(false);
    const s = core.getSnapshot();
    expect(s.PS).toBe(0x0042);
    expectPC(s, 0x0042); // jumped to PS
  });

  test('MOV8 no-op (reg to same reg) still advances PC and cycles', () => {
    const core = new EmulatorCore();
    const start = 0x0100;
    // MOV A <- A (d=0,s=0) then HALT
    core.load(program(start, [MOV8(0, 0), HALT()]));
    expect(core.step()).toBe(true);
    const s1 = core.getSnapshot();
    expect(s1.PC).toBe(start + 1);
    expect(s1.CLS).toBe('MOV8');
    expect(s1.cycles).toBe(8);
    expect(core.step()).toBe(false);
  });

  test('STORE/LOAD at address wrap boundary 0x7FFF', () => {
    const core = new EmulatorCore();
    const start = 0x0000;
    // Set B=0x2A; set M=0x7FFF via GOTO load of target; STORE B -> [M]; LOAD A <- [M]; HALT
    const tgt = 0x7fff;
    const bytes = [
      SETB(0x0a),                           // B=0x0A (10)
      ...GOTO({ d: 0 }, 0x7f, 0xff),         // M <- 0x7FFF
      STORE_FROM(1),                        // [M] <- B
      LOAD_TO(0),                           // A <- [M]
      HALT(),
    ];
    core.load(program(start, bytes));
    expect(core.step()).toBe(true); // SETB
    expect(core.step()).toBe(true); // GOTO write M
    expect(core.getSnapshot().M).toBe(0x7fff);
    expect(core.step()).toBe(true); // STORE
    expect(core.step()).toBe(true); // LOAD
    const s = core.getSnapshot();
    expect(s.A).toBe(0x0a);
    expect(core.step()).toBe(false); // HALT
  });

});
