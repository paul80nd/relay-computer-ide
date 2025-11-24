// TypeScript
import { EmulatorCore } from '../../../src/components/emulator/emu-core';
import { HALT, SETA } from './helpers/opcodes';
import { program } from './helpers/program';
import { runUntil } from './helpers/harness';

describe('runUntil helper', () => {
  test('stops at HALT by default', async () => {
    const core = new EmulatorCore();
    core.load(program(0x0100, [SETA(0x01), HALT()]));
    const result = await runUntil(core, { maxSteps: 100 });
    expect(result.halted).toBe(true);
    expect(result.steps).toBe(2);
  });

  test('stops at target PC when requested', async () => {
    const core = new EmulatorCore();
    const start = 0x0000;
    // 0: SETA, 1: SETA, 2: SETA, 3: HALT
    core.load(program(start, [SETA(0x01), SETA(0x02), SETA(0x03), HALT()]));
    const targetPC = start + 2; // stop before executing the 3rd SETA
    const result = await runUntil(core, { stopAtPC: targetPC, stopWhenHalt: false });
    expect(result.halted).toBe(false);
    expect(core.getSnapshot().PC).toBe(targetPC);
  });

  test('respects maxSteps safety cap', async () => {
    const core = new EmulatorCore();
    // No HALT; runUntil should stop at cap
    core.load(program(0x0000, new Array(100).fill(SETA(0x00))));
    const result = await runUntil(core, { maxSteps: 10, stopWhenHalt: true });
    expect(result.halted).toBe(false);
    expect(result.steps).toBe(10);
  });
});
