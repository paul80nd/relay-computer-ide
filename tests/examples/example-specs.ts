import { ExampleCase, hex, le } from './helpers/run-example';

/**
 * Expected outcomes for each program in public/examples, keyed by file name.
 *
 * Correctness values (regs/mem/memAt) are taken from the documented results in
 * each example's comments and must never be updated just to make a test pass.
 *
 * `cycles` is the exact instruction cycle count, our measure of efficiency.
 * When an optimisation changes it, update the number deliberately so the diff
 * records the improvement.
 */
export const exampleSpecs: Record<string, ExampleCase[]> = {
  // ---- Simple examples ----

  counter: [
    {
      name: 'switches zero defaults to counting to 8',
      runs: [{ switches: 0x00 }],
      haltAt: 'done',
      regs: { A: 8, C: 8 },
      cycles: 788
    },
    {
      name: 'counts to the value in the switches',
      runs: [{ switches: 0x05 }],
      haltAt: 'done',
      regs: { A: 5, C: 5 },
      cycles: 516
    }
  ],

  fibonacci: [
    {
      haltAt: 'done',
      // 13 terms until the 8-bit add overflows; the overflowed term is not stored
      memAt: { 0x0020: [...hex('01 01 02 03 05 08 0d 15 22 37 59 90 e9'), 0x00] },
      cycles: 1534
    }
  ],

  'memory-test': [
    {
      // org 0x8000 wraps to 0x0000 in 32K, so test a block clear of the program
      name: 'block 0x10, switches zero defaults to 8 locations',
      runs: [{ switches: 0x10 }, { switches: 0x00 }],
      haltAt: 'good',
      // Second test pattern (Y = 0xAA) is left behind in each tested location
      memAt: { 0x1000: [...new Array(8).fill(0xaa), 0x00] },
      cycles: 1882
    }
  ],

  // ---- Complex examples ----

  'pi-bbp-v1': [
    {
      mem: {
        pi: hex('32 43 f6 a8 88 5a 30 8d 31'),
        psum: le('32 43 f6 a8 88 5a 30 8d 31 39')
      },
      cycles: 407682
    }
  ],

  // ---- Mathematical operations ----

  'subtract-8': [
    { name: 'A = C - B', preload: { C: 10, B: 3 }, regs: { A: 7 }, cycles: 50 },
    { name: 'A = C - B (negative)', preload: { C: 3, B: 10 }, regs: { A: 0xf9 }, cycles: 50 }
  ],

  'subtract-16': [
    {
      name: '40,405 - 22,941 = 17,464',
      preload: { C: 0x9d, D: 0xd5, XY: 0x599d },
      regs: { C: 0x44, D: 0x38 },
      cycles: 168
    },
    {
      name: '40,405 - 22,813 = 17,592',
      preload: { C: 0x9d, D: 0xd5, XY: 0x591d },
      regs: { C: 0x44, D: 0xb8 },
      cycles: 168
    },
    {
      // Both documented examples carry out of the low byte; this one doesn't
      name: '40,405 - 23,008 = 17,397 (no low byte carry)',
      preload: { C: 0x9d, D: 0xd5, XY: 0x59e0 },
      regs: { C: 0x43, D: 0xf5 },
      cycles: 144
    }
  ],

  'multiply-8': [{ name: '13 x 17 = 221', regs: { A: 221 }, cycles: 954 }],

  'multiply-16': [
    {
      name: '221 x 179 = 39,559',
      preload: { XY: (221 << 8) | 179 },
      regs: { M: 39559 },
      cycles: 1114
    },
    { name: '255 x 255 = 65,025', preload: { XY: 0xffff }, regs: { M: 65025 }, cycles: 1450 },
    { name: '3 x 5 = 15', preload: { XY: 0x0305 }, regs: { M: 15 }, cycles: 914 },
    { name: '128 x 2 = 256', preload: { XY: 0x8002 }, regs: { M: 256 }, cycles: 834 }
  ],

  'addition-long-se': [{ mem: { sa: le('f1 23 b1 08 69 82 7c c7') }, cycles: 1668 }],

  'subtraction-long-se': [{ mem: { sa: le('00 ac ef 6d c4 35 3f 38 92 58') }, cycles: 2520 }],

  'reciprocal-long-se': [{ mem: { ra: hex('02 0c 49 ba 5e 35 3f 7c ed 91') }, cycles: 20482 }],

  'reciprocal-long-se-v2': [{ mem: { ra: hex('02 0c 49 ba 5e 35 3f 7c ed 91') }, cycles: 11874 }],

  'reciprocal-long-se-v3': [{ mem: { ra: hex('02 0c 49 ba 5e 35 3f 7c ed 91') }, cycles: 8298 }],

  // ---- Handy routines ----

  'convert-endian': [
    {
      mem: {
        ca: hex('78 56 34 12'),
        cb: hex('8c c0 66 cc e9 73 f6'),
        cc: hex('67 9c 66 45 b3 59 a6 f6 43 32')
      },
      cycles: 2000
    }
  ],

  'addition-long': [{ mem: { sa: le('32 43 f6 a6 59 b3 45 66 9c 67') }, cycles: 6506 }],

  'subtraction-long': [{ mem: { sa: le('00 ac ef 6d c4 35 3f 38 92 58') }, cycles: 7094 }],

  'reciprocal-long': [
    {
      mem: {
        ra: hex('33 33 33 33'),
        rb: hex('12 49 24 92 49 24'),
        rc: hex('05 b0 5b 05 b0 5b 05 b0'),
        rd: hex('02 0c 49 ba 5e 35 3f 7c ed 91')
      },
      cycles: 23458
    }
  ]
};

/** Examples deliberately not covered, with the reason */
export const skippedExamples: Record<string, string> = {
  'hello-world': "doesn't assemble (unsupported 'prt' mnemonic, undefined 'len', org overlap)"
};
