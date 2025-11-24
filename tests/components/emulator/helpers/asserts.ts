import type { Snapshot } from '../../../../src/components/emulator/emu-core';

export function expectPC(s: Snapshot, pc: number) {
  expect(s.PC).toBe(pc & 0xffff);
}

export function expectCycles(s: Snapshot, cycles: number) {
  expect(s.cycles).toBe(cycles);
}

export function expectRegs(s: Snapshot, pick: Partial<Snapshot>) {
  for (const [k, v] of Object.entries(pick)) {
    // @ts-ignore
    expect(s[k as keyof Snapshot]).toBe(v);
  }
}
