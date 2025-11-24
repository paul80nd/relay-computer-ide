import type { EmulatorCore } from '../../../../src/components/emulator/emu-core';

export async function runUntil(
  core: EmulatorCore,
  opts: {
    maxSteps?: number;
    stopAtPC?: number;
    stopWhenHalt?: boolean;
    predicate?: (core: EmulatorCore) => boolean;
  } = {}
) {
  const { maxSteps = 10_000, stopAtPC, stopWhenHalt = true, predicate } = opts;
  let steps = 0;
  while (steps < maxSteps) {
    const s = core.getSnapshot();
    if (typeof stopAtPC === 'number' && s.PC === (stopAtPC & 0xffff)) {
      return { steps, halted: false };
    }
    if (predicate?.(core)) {
      return { steps, halted: false };
    }
    const cont = core.step();
    steps++;
    if (!cont && stopWhenHalt) {
      return { steps, halted: true };
    }
  }
  return { steps, halted: false };
}

export function runSteps(core: EmulatorCore, n: number) {
  for (let i = 0; i < n; i++) expect(core.step()).toBe(true);
}
