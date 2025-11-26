import { type RegisterName } from '.';

export interface RegisterDoc {
  title: string;
  summary: string;
  size: number;
  canRead: boolean;
  canWrite: boolean;
  description: string;
}

export const registerDocs: Record<RegisterName, RegisterDoc> = {
  a: {
    title: 'a',
    summary: 'A Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register.'
  },
  b: {
    title: 'b',
    summary: 'B Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description:
      'General purpose 8-bit register. Directly feeds the ALU for all binary and unary operations.'
  },
  c: {
    title: 'c',
    summary: 'C Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register. Directly feeds the ALU for all binary operations'
  },
  d: {
    title: 'd',
    summary: 'D Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register.'
  },
  m1: {
    title: 'm1',
    summary: 'M1 Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register. Forms high byte of 16-bit M register.'
  },
  m2: {
    title: 'm2',
    summary: 'M2 Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register. Forms low byte of 16-bit M register'
  },
  x: {
    title: 'x',
    summary: 'X Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register. Forms high byte of 16-bit XY register.'
  },
  y: {
    title: 'y',
    summary: 'Y Register',
    size: 8,
    canRead: true,
    canWrite: true,
    description: 'General purpose 8-bit register. Forms low byte of 16-bit XY register.'
  },
  m: {
    title: 'm',
    summary: 'M Register',
    size: 16,
    canRead: true,
    canWrite: false,
    description:
      '16-bit read-only register. Formed from the 8-bit M1 and M2 registers. Typically used to reference a location in memory.'
  },
  j: {
    title: 'j',
    summary: 'J Register',
    size: 16,
    canRead: true,
    canWrite: false,
    description:
      '16-bit read-only register. Formed from the 8-bit J1 and J2 registers. Can only be loaded as part of a branching or load immediate instruction. Typically used for jumps and conditional branching.'
  },
  xy: {
    title: 'xy',
    summary: 'XY Register',
    size: 16,
    canRead: true,
    canWrite: true,
    description:
      '16-bit general purpose register. Formed from the 8-bit X and Y registers. Typically used to hold a return address, indexing a memory location or as a general 16-bit register. Can be incremented with the `ixy` instruction.'
  },
  pc: {
    title: 'pc',
    summary: 'Program Counter',
    size: 16,
    canRead: true,
    canWrite: true,
    description:
      'The program counter (a 16-bit read-only register). Points to the next instruction in memory to be performed. Loading a value in to this register effectively performs a jump.'
  },
  as: {
    title: 'as',
    summary: 'Address Switches',
    size: 16,
    canRead: true,
    canWrite: false,
    description:
      "16-bit read-only register formed from the 8-bit front panel switches. The upper 8-bits of this 'register' are always zero. Effectively this allows user input to be gated onto the address bus."
  },
  ds: {
    title: 'ds',
    summary: 'Data Switches',
    size: 16,
    canRead: true,
    canWrite: false,
    description:
      'The current value set on the 8-bit front panel switches. Effectively this allows user input to be gated onto the data bus.'
  }
};
