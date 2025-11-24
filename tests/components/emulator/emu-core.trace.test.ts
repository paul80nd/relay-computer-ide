// TypeScript
import { EmulatorCore, type StepTrace } from '../../../src/components/emulator/emu-core';
import { ALU_TO_A, GOTO, HALT, LOAD_TO, MOV8, SETA, STORE_FROM } from './helpers/opcodes';
import { program } from './helpers/program';

describe('EmulatorCore trace hook', () => {
  test('captures per-step opcode, kind, cls, cyclesDelta and snapshots', () => {
    const trace: StepTrace[] = [];
    const core = new EmulatorCore(32768, (t) => trace.push(t));

    const start = 0x0100;
    const tgt = 0x0108;
    const bytes = [
      SETA(0x05),              // cycles +8
      MOV8(1, 0),              // +8
      STORE_FROM(1),           // +12
      LOAD_TO(0),              // +12
      ALU_TO_A(2),             // +8
      ...GOTO({ d: 1, z: 1, x: 1 }, (tgt >> 8) & 0xff, tgt & 0xff), // +24, not taken (Z false)
      HALT(),                  // +10, returns false
    ];

    core.load(program(start, bytes));

    // Execute until HALT
    while (core.step()) { /* no-op */ }

    // Basic trace sanity
    expect(trace.length).toBe(7);

    // Check first step
    expect(trace[0].pc).toBe(start);
    expect(trace[0].op).toBe(bytes[0]);
    expect(trace[0].cls).toBe('SETAB');
    expect(trace[0].cyclesDelta).toBe(8);
    expect(trace[0].after.PC).toBe(start + 1);
    expect(trace[0].after.A).toBe(0x05);

    // Check MOV8 step updates B
    expect(trace[1].cls).toBe('MOV8');
    expect(trace[1].cyclesDelta).toBe(8);
    expect(trace[1].after.B).toBe(0x05);

    // STORE then LOAD sequence
    expect(trace[2].cls).toBe('STORE');
    expect(trace[2].cyclesDelta).toBe(12);
    expect(trace[3].cls).toBe('LOAD');
    expect(trace[3].cyclesDelta).toBe(12);
    expect(trace[3].after.A).toBe(0x05);

    // ALU B+1 -> A
    expect(trace[4].cls).toBe('ALU');
    expect(trace[4].cyclesDelta).toBe(8);
    expect(trace[4].after.A).toBe(0x06);
    expect(trace[4].after.FZ).toBe(false);

    // GOTO not taken, J set, XY captured to PC after read
    expect(trace[5].cls).toBe('GOTO');
    expect(trace[5].cyclesDelta).toBe(24);
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
    core.load(program(0x0000, [SETA(0x01), HALT()]));

    while (core.step()) { /* run */ }

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
