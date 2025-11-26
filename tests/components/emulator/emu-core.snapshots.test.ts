// TypeScript
import { EmulatorCore, Snapshot } from '../../../src/components/emulator/emu-core';
import { ALU, GOTO, HALT, LOAD, MOV8, SETA, STORE } from './helpers/opcodes';
import { program } from './helpers/program';

// capture a subset of the snapshot for readability
function pick(s: Snapshot) {
  const { PC, A, B, C, D, M, XY, J, FZ, FS, FC, PS, CLS, cycles } = s;
  return { PC, A, B, C, D, M, XY, J, FZ, FS, FC, PS, CLS, cycles };
}

describe('EmulatorCore golden snapshots', () => {
  test('tiny program step-by-step stays stable', () => {
    const start = 0x0100;
    const tgt = 0x0120;

    // Program:
    // 0100: SETA +5            -> A=5
    // 0101: MOV B <- A         -> B=5
    // 0102: STORE [M] <- B     -> mem[M] = 5  (M initially 0)
    // 0103: LOAD A <- [M]      -> A=5         (checks mem path)
    // 0104: ALU_TO_A(2) (B+1)  -> A=6, flags: Z=false,S=false,C=false (B=5)
    // 0105: GOTO d=1 z=1 x=1 tgt -> J=tgt, XY=capture; Z=false so no jump
    // 0108: HALT               -> stop
    // 0120: HALT               -> jump target (will not be hit in this run)
    const bytes = [
      SETA(0x05),
      MOV8(1, 0), // B <- A
      STORE(1), // [M] <- B
      LOAD(0), // A <- [M]
      ALU(2), // B + 1 -> A
      ...GOTO({ d: 1, z: 1, x: 1 }, tgt),
      HALT,
      // pad up to target, place HALT at tgt
      ...new Array((tgt - (start + 9)) & 0xffff).fill(0x00),
      HALT,
    ];

    const core = new EmulatorCore();
    core.load(program(start, ...bytes));

    const steps: any[] = [];

    function stepAndRecord() {
      const cont = core.step();
      steps.push(pick(core.getSnapshot()));
      return cont;
    }

    // Step through until the HALT at 0x0108
    while (stepAndRecord()) {
      // loop
    }

    // Expected sequence:
    // After SETA, MOV, STORE, LOAD, ALU, GOTO (no jump), HALT
    expect(steps).toEqual([
      // SETA
      expect.objectContaining({ PC: 0x0101, A: 0x05, B: 0x00, CLS: 'SETAB', cycles: 8 }),
      // MOV B <- A
      expect.objectContaining({ PC: 0x0102, A: 0x05, B: 0x05, CLS: 'MOV8', cycles: 16 }),
      // STORE [M] <- B
      expect.objectContaining({ PC: 0x0103, CLS: 'STORE', cycles: 28 }),
      // LOAD A <- [M]
      expect.objectContaining({ PC: 0x0104, A: 0x05, CLS: 'LOAD', cycles: 40 }),
      // ALU B+1 -> A
      expect.objectContaining({
        PC: 0x0105,
        A: 0x06,
        FZ: false,
        FS: false,
        FC: false,
        CLS: 'ALU',
        cycles: 48,
      }),
      // GOTO (no jump because Z=false), captures XY, writes J
      expect.objectContaining({ PC: 0x0108, J: tgt, XY: 0x0108, CLS: 'GOTO', cycles: 72 }),
      // HALT
      expect.objectContaining({ PC: 0x0109, CLS: 'MISC', cycles: 82 }),
    ]);
  });
});
