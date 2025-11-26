import { type MnemonicDoc, type AddressingMode } from '.';

export type AddressingModes = Record<AddressingMode, boolean>;

export type InstructionClass =
  | 'ALU'
  | 'GOTO'
  | 'MOV8'
  | 'MOV16'
  | 'INCXY'
  | 'MISC'
  | 'SETAB'
  | 'LOAD'
  | 'STORE';

export type Processor = 'rcasm' | 'rcasm+div';

export type Processors = Record<Processor, boolean>;

export type AluFlag = 'z' | 'c' | 's';

/**
 * ALU flag register states
 *
 * - The bit remains unchanged by the execution of the instruction
 * * The bit is set or cleared according to the outcome of the instruction.
 */
export type AluFlagState = '-' | '*' | '0' | 'U' | '1';

export type AluFlags = Record<AluFlag, AluFlagState>;

export interface InstructionDoc extends MnemonicDoc {
  class: InstructionClass;
  cycles: number;
  operation?: string;
  flags?: AluFlags;
  src?: AddressingModes;
  dest?: AddressingModes;
  procs: Processors;
  variant?: string;
  variants?: InstructionVariant[];
}

export interface InstructionVariant {
  class: InstructionClass;
  cycles: number;
  variant: string;
  description?: string[];
  syntax: string[];
  src?: AddressingModes;
  dest?: AddressingModes;
  whenFirstParamIs?: string[];
}

export const isInstructionDoc = (doc: MnemonicDoc): doc is InstructionDoc =>
  (doc as InstructionDoc).operation !== undefined;

export const instructionDocs: Record<string, InstructionDoc> = {
  add: {
    title: 'add',
    summary: 'Arithmetic Add',
    class: 'ALU',
    cycles: 8,
    operation: '[dst] ← [B] + [C]',
    syntax: ['add [<dst:a|d>]'],
    description: [
      'Adds the contents of register `b` and `c` placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '*',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  and: {
    title: 'and',
    class: 'ALU',
    cycles: 8,
    summary: 'Logical And',
    operation: '[dst] ← [B] . [C]',
    syntax: ['and [<dst:a|d>]'],
    description: [
      'Performs a bitwise AND on register `b` and `c` placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  bcs: {
    title: 'bcs',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Carry Set',
    operation: 'If C THEN [PC] ← (label)',
    syntax: ['bcs <label>'],
    snippet: 'bcs ${1:label}',
    description: ['Jumps to label if C is set (last ALU operation resulted in a carry).'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  beq: {
    title: 'beq',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Equal',
    operation: 'If Z THEN [PC] ← (label)',
    syntax: ['beq <label>'],
    snippet: 'beq ${1:label}',
    description: ['Jumps to label if Z flag is set (last ALU operation result was 0).'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  ble: {
    title: 'ble',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Less or Equal',
    operation: 'If Z + S THEN [PC] ← (label)',
    syntax: ['ble <label>'],
    snippet: 'ble ${1:label}',
    description: [
      'Jumps to label if S or Z is set (last ALU operation resulted in a zero or negative value).',
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  blt: {
    title: 'blt',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Less Than',
    operation: 'If S THEN [PC] ← (label)',
    syntax: ['blt <label>'],
    snippet: 'blt ${1:label}',
    description: [
      'Jumps to label if S is set (last ALU operation has most significant bit set / is negative).',
      'Synonym of `bmi`.',
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  bmi: {
    title: 'bmi',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Minus',
    operation: 'If S THEN [PC] ← (label))',
    syntax: ['bmi <label>'],
    snippet: 'bmi ${1:label}',
    description: [
      'Jumps to label if S is set (last ALU operation has most significant bit set / is negative).',
      'Synonym of `blt`.',
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  bne: {
    title: 'bne',
    class: 'GOTO',
    cycles: 24,
    summary: 'Branch Conditionally: Not Equal',
    operation: 'If Z̅ THEN [PC] ← (label)',
    syntax: ['bne <label>'],
    snippet: 'bne ${1:label}',
    description: ['Jumps to label if Z is not set (last ALU operation result was not 0).'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  clr: {
    title: 'clr',
    class: 'MOV8',
    cycles: 8,
    summary: 'Register Clear',
    variant: '8-bit Register Clear',
    operation: '[dst] ← 0',
    syntax: ['clr <dst:Dr>'],
    description: [
      'Clears (sets to 0) general purpose 8-bit register dst.',
      'This is the equivalent of `mov dst,dst`.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
    variants: [
      {
        class: 'MOV16',
        cycles: 10,
        variant: '16-bit Register Clear',
        description: [
          'Clears (sets to 0) 16-bit register xy.',
          'This is the equivalent of `mov xy,xy`.',
        ],
        syntax: ['clr xy'],
        dest: {
          dr: false,
          ar: true,
          mIndirect: false,
          imm: false,
        },
        whenFirstParamIs: ['xy'],
      },
    ],
  },
  cmp: {
    title: 'cmp',
    class: 'ALU',
    cycles: 8,
    summary: 'Compare (Logic Xor)',
    operation: '[dst] ← [B] - [C]',
    syntax: ['cmp [<dst:a|d>]'],
    description: [
      'Compares the values in register `b` and `c` setting condition flag Z (zero) if the values are the same.',
      'Overwrites `dst` (a or d).',
      'If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags.',
      'Synonym of `eor`.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  div: {
    title: 'div',
    class: 'INCXY',
    cycles: 24,
    summary: 'Unsigned Integer Division ⚠️EXPERIMENTAL⚠️',
    operation: '[dst] ← [B]/[C]',
    syntax: ['div [<dst:a|d>]'],
    description: [
      'Performs an integer division of register `b` by register `c` placing the quotient result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: false,
      'rcasm+div': true,
    },
  },
  dvr: {
    title: 'dvr',
    class: 'INCXY',
    cycles: 24,
    summary: 'Remainder Division ⚠️EXPERIMENTAL⚠️',
    operation: '[dst] ← R / [C]',
    syntax: ['dvr [<dst:a|d>]'],
    description: [
      'Performs a further division of the last `div` or `mod` remainder by register `c` placing the quotient result in `dst` (a or d).',
      'Register B should be set to 0. If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: false,
      'rcasm+div': true,
    },
  },
  eor: {
    title: 'eor',
    class: 'ALU',
    cycles: 8,
    summary: 'Logical Exclusive-OR',
    operation: '[dst] ← [B] ⊕ [C]',
    syntax: ['eor [<dst:a|d>]'],
    description: [
      'Performs a bitwise XOR (exlusive OR) on register `b` and `c` placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
      'Synonym of `cmp`.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  inc: {
    title: 'inc',
    summary: 'Arithmetic Increment',
    class: 'ALU',
    cycles: 8,
    operation: '[dst] ← [B] + 1',
    syntax: ['inc [<dst:a|d>]'],
    description: [
      'Adds one to the contents of register `b` (register `c` is ignored) placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '*',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  hlt: {
    title: 'hlt',
    class: 'MISC',
    cycles: 10,
    summary: 'Halt',
    operation: 'HALT and [PC] ← [PC] + 1',
    syntax: ['hlt'],
    description: ['Halts execution of the program.'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  hlr: {
    title: 'hlr',
    class: 'MISC',
    cycles: 10,
    summary: 'Halt and Reload',
    operation: 'HALT and [PC] ← [AS]',
    syntax: ['hlr'],
    description: [
      'Halts execution of the program and sets the program counter to the value on the primary switches.',
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  ixy: {
    title: 'ixy',
    summary: 'XY Increment',
    class: 'INCXY',
    cycles: 14,
    operation: '[XY] ← [XY] + 1',
    syntax: ['ixy'],
    description: ['Increments the 16-bit value in the `xy` register by 1.'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  jmp: {
    title: 'jmp',
    class: 'GOTO',
    cycles: 24,
    summary: 'Unconditional Jump',
    operation: '[PC] ← (label))',
    syntax: ['jmp <label>'],
    snippet: 'jmp ${1:label}',
    description: ['Unconditionally jumps to `label` (via register j).'],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  jsr: {
    title: 'jsr',
    class: 'GOTO',
    cycles: 24,
    summary: 'Jump to Subroutine',
    operation: '[XY] ← [PC]; [PC] ← (label)',
    syntax: ['jsr <label>'],
    snippet: 'jsr ${1:label}',
    description: [
      'Saves the address of the next instruction into register `xy` and then unconditionally jumps to `label` (via register j).',
      "Notionally behaves as a 'call subroutine' operation.",
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  ldi: {
    title: 'ldi',
    class: 'SETAB',
    cycles: 8,
    summary: 'Load Immediate',
    operation: '[dst] ← value',
    syntax: ['ldi <dst:a|b>,<value:-16..15>'],
    snippet: 'ldi ${1:a},${2:0}',
    description: [
      'Loads an 8-bit constant value into `dst` (register a or b).',
      'The `value` must be between -16 and 15.',
    ],
    variant: '8-bit Load Immediate',
    variants: [
      {
        class: 'GOTO',
        cycles: 24,
        variant: '16-bit Load Immediate',
        description: [
          'Loads a 16-bit constant value into `dst` (register m or j).',
          'The `value` can be between 0x0000 and 0xFFFF.',
        ],
        syntax: ['ldi <dst:m|j>,<value:0x0000..0xFFFF>', 'ldi <dst:m|j>,<label>'],
        whenFirstParamIs: ['m', 'j'],
        src: {
          dr: false,
          ar: false,
          mIndirect: false,
          imm: true,
        },
        dest: {
          dr: false,
          ar: true,
          mIndirect: false,
          imm: false,
        },
      },
    ],
    src: {
      dr: false,
      ar: false,
      mIndirect: false,
      imm: true,
    },
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  lds: {
    title: 'lds',
    class: 'MISC',
    cycles: 10,
    summary: 'Load Register from Switches',
    operation: '[dst] ← [DS]',
    syntax: ['lds <dst:a|d>'],
    snippet: 'lds ${1:a}',
    description: ['Loads register `dst` (a or d) from the front panel switches.'],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  ldr: {
    title: 'ldr',
    class: 'LOAD',
    cycles: 12,
    summary: 'Load Register from Memory',
    operation: '[dst] ← (M)',
    syntax: ['ldr <dst:a-d>'],
    snippet: 'ldr ${1:b}',
    description: [
      'Loads register `dst` (a, b, c or d) with the byte in memory currently referenced by register `m`.',
    ],
    src: {
      dr: false,
      ar: false,
      mIndirect: true,
      imm: false,
    },
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  mod: {
    title: 'mod',
    class: 'INCXY',
    cycles: 24,
    summary: 'Unsigned Modulo Operation ⚠️EXPERIMENTAL⚠️',
    operation: '[dst] ← [B]%[C]',
    syntax: ['mod <dst:a|d>'],
    description: [
      'Performs an integer division of register `b` by register `c` placing the remainder result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: false,
      'rcasm+div': true,
    },
  },
  mdr: {
    title: 'mdr',
    class: 'INCXY',
    cycles: 24,
    summary: 'Remainder Modulo ⚠️EXPERIMENTAL⚠️',
    operation: '[dst] ← R % [C]',
    syntax: ['mdr <dst:a|d>'],
    description: [
      'Performs a further modulo of the last `div` or `mod` remainder by register `c` placing the remainder result in `dst` (a or d).',
      'Register B should be set to 0. If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: false,
      'rcasm+div': true,
    },
  },
  mov: {
    title: 'mov',
    class: 'MOV8',
    cycles: 8,
    summary: 'Register to Register Copy',
    operation: '[dst] ← [src]',
    syntax: ['mov <dst:Dr>,<src:Dr>'],
    snippet: 'mov ${1:b},${2:a}',
    description: [
      'Copies a value from `src` to `dst` between any of the eight general purpose 8-bit registers.',
      'If dst and src are the same then dst will be set to 0.',
    ],
    variant: '8-bit Register to Register Copy',
    variants: [
      {
        class: 'MOV16',
        cycles: 10,
        variant: '16-bit Register to Register Copy',
        description: [
          'Copies a value between the 16-bit `src` registers (m, xy or j) and `dst` (xy or the program counter pc).',
          'If dst and src are the same then dst will be set to 0.',
        ],
        syntax: ['mov <dst:xy|pc>,<src:m|xy|j|as>'],
        whenFirstParamIs: ['xy', 'pc'],
        src: {
          dr: false,
          ar: true,
          mIndirect: false,
          imm: false,
        },
        dest: {
          dr: false,
          ar: true,
          mIndirect: false,
          imm: false,
        },
      },
    ],
    src: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  not: {
    title: 'not',
    class: 'ALU',
    cycles: 8,
    summary: 'Logical Complement',
    operation: '[dst] ← ~[B]',
    syntax: ['not [<dst:a|d>]'],
    description: [
      'Performs a bitwise NOT on register `b` (register `c` is ignored) placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  orr: {
    title: 'orr',
    class: 'ALU',
    cycles: 8,
    summary: 'Logical Inclusive-OR',
    operation: '[dst] ← [B] + [C]',
    syntax: ['orr <dst:a|d>'],
    description: [
      'Performs a bitwise OR on register `b` and `c` placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  rol: {
    title: 'rol',
    class: 'ALU',
    cycles: 8,
    summary: 'Rotate Left',
    operation: '[dst] ← [B] rotated by 1',
    syntax: ['rol <dst:a|d>'],
    description: [
      'Performs a bitwise left-rotation on register `b` (register `c` is ignored) placing the result in `dst` (a or d).',
      'If dst is not specified then register a is assumed.',
      'Every bit shifts one place to the left with the left most bit rotated around to right.',
    ],
    dest: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    flags: {
      z: '*',
      c: '0',
      s: '*',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  rts: {
    title: 'rts',
    class: 'MOV16',
    cycles: 10,
    summary: 'Return from Subroutine',
    operation: '[PC] ← [XY]',
    syntax: ['rts'],
    description: [
      'Copies the value in register `xy` to the program counter `pc`.',
      "Notionally behaves as a 'return' operation to a previous jsr call.",
    ],
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    src: {
      dr: false,
      ar: true,
      mIndirect: false,
      imm: false,
    },
    dest: {
      dr: false,
      ar: true,
      mIndirect: false,
      imm: false,
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
  str: {
    title: 'str',
    class: 'STORE',
    cycles: 12,
    summary: 'Store Register into Memory',
    operation: '(M) ← [src]',
    syntax: ['str <src:a-d>'],
    snippet: 'str ${1:a}',
    description: [
      'Stores register `src` (a, b, c or d) into the byte of memory currently referenced by register `m`.',
    ],
    src: {
      dr: true,
      ar: false,
      mIndirect: false,
      imm: false,
    },
    dest: {
      dr: false,
      ar: false,
      mIndirect: true,
      imm: false,
    },
    flags: {
      z: '-',
      c: '-',
      s: '-',
    },
    procs: {
      rcasm: true,
      'rcasm+div': true,
    },
  },
};
