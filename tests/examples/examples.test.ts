import { readdirSync } from 'node:fs';
import { exampleSpecs, skippedExamples } from './example-specs';
import { EXAMPLES_DIR, ExampleRun, runExample } from './helpers/run-example';

const hex2 = (n: number) => n.toString(16).padStart(2, '0');
const hex4 = (n: number) => n.toString(16).padStart(4, '0');

describe('example programs', () => {
  test('every example has a spec or an explicit skip', () => {
    const files = readdirSync(EXAMPLES_DIR)
      .filter(f => f.endsWith('.rcasm'))
      .map(f => f.replace(/\.rcasm$/, ''));
    const covered = new Set([...Object.keys(exampleSpecs), ...Object.keys(skippedExamples)]);
    expect(files.filter(f => !covered.has(f))).toEqual([]);
    // and no spec refers to an example that no longer exists
    expect([...covered].filter(c => !files.includes(c))).toEqual([]);
  });

  for (const [id, reason] of Object.entries(skippedExamples)) {
    test.skip(`${id} (${reason})`, () => {});
  }

  for (const [id, cases] of Object.entries(exampleSpecs)) {
    describe(id, () => {
      for (const spec of cases) {
        describe(spec.name ?? 'documented example', () => {
          let run: ExampleRun;
          beforeAll(() => {
            run = runExample(id, spec);
          });

          const correctnessTest = spec.knownBug ? test.failing : test;
          const correctnessName = spec.knownBug
            ? `halts with the expected result (known bug: ${spec.knownBug})`
            : 'halts with the expected result';

          correctnessTest(correctnessName, () => {
            expect(run.halted).toBe(true);

            if (spec.haltAt) {
              const addr = run.labels.get(spec.haltAt);
              expect(addr).toBeDefined();
              // HALT advances PC past itself
              expect(hex4(run.snapshot.PC)).toBe(hex4((addr! + 1) & 0xffff));
            }

            if (spec.regs) {
              const actual = Object.fromEntries(
                Object.keys(spec.regs).map(k => [k, run.snapshot[k as keyof typeof spec.regs]])
              );
              expect(actual).toEqual(spec.regs);
            }

            for (const [label, bytes] of Object.entries(spec.mem ?? {})) {
              const addr = run.resolve(label);
              expect(addr).toBeDefined();
              // compare as hex so failures read like the example comments
              expect({ [label]: run.readMem(addr!, bytes.length).map(hex2) }).toEqual({
                [label]: bytes.map(hex2)
              });
            }

            for (const [addr, bytes] of Object.entries(spec.memAt ?? {})) {
              const a = Number(addr);
              expect({ [hex4(a)]: run.readMem(a, bytes.length).map(hex2) }).toEqual({
                [hex4(a)]: bytes.map(hex2)
              });
            }
          });

          test(`takes ${spec.cycles} cycles`, () => {
            const actual = run.snapshot.cycles;
            if (actual !== spec.cycles) {
              const delta = actual - spec.cycles;
              const pct = spec.cycles ? ` (${((delta / spec.cycles) * 100).toFixed(1)}%)` : '';
              throw new Error(
                `cycles changed: ${spec.cycles} → ${actual}, ${delta > 0 ? '+' : ''}${delta}${pct}\n` +
                  'If intended, update `cycles` in tests/examples/example-specs.ts.'
              );
            }
          });
        });
      }
    });
  }
});
