// TypeScript
import { EmulatorCore, type StepTrace } from '../../../src/components/emulator/emu-core';
import { ALU, GOTO, HALT, LOAD, MOV8, SETA, STORE } from './helpers/opcodes';
import { program } from './helpers/program';

describe('EmulatorCore trace hook', () => {
  test('captures per-step opcode, kind, cls, cyclesDelta and snapshots', () => {
    const trace: StepTrace[] = [];
    const core = new EmulatorCore(32768, t => trace.push(t));

    const start = 0x0100;
    const tgt = 0x0108;
    const bytes = [
      SETA(0x05), // cycles +8
      MOV8(1, 0), // +8
      STORE(1), // +12
      LOAD(0), // +12
      ALU(2), // +8
      ...GOTO({ d: 1, z: 1, x: 1 }, tgt), // +24, not taken (Z false)
      HALT // +10, returns false
    ];

    core.load(program(start, ...bytes));

    // Execute until HALT
    while (core.step()) {
      /* no-op */
    }

    // Basic trace sanity
    expect(trace.length).toBe(7);

    // Check first step
    expect(trace[0]).toMatchObject({ pc: start, op: bytes[0], cls: 'SETAB', cyclesDelta: 8 });
    expect(trace[0].after).toMatchObject({ PC: start + 1, A: 5 });

    // Check MOV8 step updates B
    expect(trace[1]).toMatchObject({ cls: 'MOV8', cyclesDelta: 8 });
    expect(trace[1].after.B).toBe(0x05);

    // STORE then LOAD sequence
    expect(trace[2]).toMatchObject({ cls: 'STORE', cyclesDelta: 12 });
    expect(trace[3]).toMatchObject({ cls: 'LOAD', cyclesDelta: 12 });
    expect(trace[3].after.A).toBe(0x05);

    // ALU B+1 -> A
    expect(trace[4]).toMatchObject({ cls: 'ALU', cyclesDelta: 8 });
    expect(trace[4].after).toMatchObject({ A: 6, FZ: false });

    // GOTO not taken, J set, XY captured to PC after read
    expect(trace[5]).toMatchObject({ cls: 'GOTO', cyclesDelta: 24 });
    expect(trace[5].after.J).toBe(tgt);
    expect(trace[5].after.XY).toBe(start + 8); // PC after GOTO is start+8

    // HALT
    const last = trace[trace.length - 1];
    expect(last.cls).toBe('MISC'); // HALT and LDSW map to MISC
    expect(last.cyclesDelta).toBe(10);
    expect(last.after.PC).toBe((start + bytes.length) & 0xffff);
  });

  test('trace before/after snapshots are different objects and frozen', () => {
    const traces: StepTrace[] = [];
    const core = new EmulatorCore(32768, t => traces.push(t));
    core.load(program(0, SETA(1), HALT));

    while (core.step()) {
      /* run */
    }

    expect(traces.length).toBe(2);
    const t0 = traces[0];

    // Objects must be different
    expect(t0.before).not.toBe(t0.after);

    // Freeze enforcement: writing should throw
    expect(() => {
      (t0 as any).after.A = 0x99; // attempt to mutate
    }).toThrow();

    // Ensure real state is unchanged
    const s = core.getSnapshot();
    expect(s.A).toBe(0x01);
  });
});
