import * as rcasm from '@paul80nd/rcasm';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EmulatorCore, Snapshot } from '../../../src/components/emulator/emu-core';

export const EXAMPLES_DIR = join(__dirname, '../../../public/examples');

const HALT_OPS = [0xae, 0xaf];

// Generous ceiling (pi-bbp-v1, the longest example, is ~53k steps) so a broken
// program that never halts fails fast rather than hanging the suite.
const MAX_STEPS = 2_000_000;

type Registers = Omit<Snapshot, 'CLS' | 'cycles' | 'PS'>;

export type ExampleCase = {
  /** Test name; defaults to "documented example" */
  name?: string;
  /** Registers preloaded before running (for examples that take inputs in registers) */
  preload?: Partial<Registers>;
  /**
   * Sequence of runs, each continuing until the next HALT (like pressing RESTART
   * in the UI). Data switches are set before each run. Defaults to a single run.
   */
  runs?: { switches?: number }[];
  /** Label of the `hlt` instruction the final run is expected to stop on */
  haltAt?: string;
  /** Expected register values at the end */
  regs?: Partial<Registers>;
  /** Expected memory contents at the end, by label */
  mem?: Record<string, number[]>;
  /** Expected memory contents at the end, by absolute address */
  memAt?: Record<number, number[]>;
  /** Exact instruction cycle count across all runs (the efficiency measure) */
  cycles: number;
  /**
   * The example is known to produce the wrong result. Its correctness test is
   * expected to fail (and will flag once the example is fixed).
   */
  knownBug?: string;
};

export type ExampleRun = {
  halted: boolean;
  steps: number;
  snapshot: Readonly<Snapshot>;
  labels: Map<string, number>;
  readMem: (addr: number, length: number) => number[];
};

/** Parse a whitespace-separated hex byte string as written in the example comments */
export function hex(s: string): number[] {
  return s
    .trim()
    .split(/\s+/)
    .map(b => parseInt(b, 16));
}

/** As `hex`, for a value documented big-endian but stored little-endian in memory */
export function le(s: string): number[] {
  return hex(s).reverse();
}

function setSwitches(core: EmulatorCore, value: number) {
  const diff = core.getSnapshot().PS ^ value;
  for (let bit = 0; bit < 8; bit++) if (diff & (1 << bit)) core.flipPrimarySwitchBit(bit);
}

export function runExample(id: string, spec: ExampleCase): ExampleRun {
  const source = readFileSync(join(EXAMPLES_DIR, `${id}.rcasm`), 'utf8');
  const { prg, errors, labels } = rcasm.assemble(source);
  if (errors.length) {
    throw new Error(`${id} failed to assemble:\n${errors.map(e => e.formatted).join('\n')}`);
  }

  const core = new EmulatorCore();
  core.load(prg);
  // No public register setter exists (the UI never needs one), so reach in via
  // bracket access, which TypeScript permits for private members.
  Object.assign(core['regs'], spec.preload);

  let steps = 0;
  let halted = false;
  for (const run of spec.runs ?? [{}]) {
    if (run.switches !== undefined) setSwitches(core, run.switches);
    while (core.step()) {
      if (++steps >= MAX_STEPS) break;
    }
    steps++;
    halted = HALT_OPS.includes(core.getSnapshot().I);
    if (!halted) break;
  }

  const memory = core.getMemory();
  return {
    halted,
    steps,
    snapshot: core.getSnapshot(),
    labels: new Map(labels.map(l => [l.name, l.addr])),
    readMem: (addr, length) =>
      Array.from({ length }, (_, i) => memory[(addr + i) & (memory.length - 1)])
  };
}
