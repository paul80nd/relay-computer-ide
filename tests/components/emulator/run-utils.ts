import type { EmulatorCore } from '../../../src/components/emulator/emu-core';

export type RunUntilOpts = {
  maxSteps?: number;            // hard cap
  stopAtPC?: number;            // stop when PC equals this value
  stopWhenHalt?: boolean;       // stop when step() returns false
  predicate?: (core: EmulatorCore) => boolean; // custom stop condition
};

export type RunUntilResult = {
  steps: number;
  halted: boolean;
};

export async function runUntil(core: EmulatorCore, opts: RunUntilOpts = {}): Promise<RunUntilResult> {
  const {
    maxSteps = 10_000,
    stopAtPC,
    stopWhenHalt = true,
    predicate,
  } = opts;

  let steps = 0;
  while (steps < maxSteps) {
    if (typeof stopAtPC === 'number' && (core as any).getSnapshot().PC === stopAtPC) {
      return { steps, halted: false };
    }
    if (predicate && predicate(core)) {
      return { steps, halted: false };
    }
    const cont = core.step();
    steps++;
    if (!cont && stopWhenHalt) {
      return { steps, halted: true };
    }
  }
  // Reached step cap
  return { steps, halted: false };
}
