import { instructionDocs } from './instructions';
import { directiveDocs } from './directives';

export * from './instructions';
export * from './directives';
export * from './registers';

export interface MnemonicDoc {
  title: string;
  summary: string;
  syntax: string[];
  description?: string[];
  snippet?: string;
}

export const mnemonicDocs = {
  ...instructionDocs,
  ...directiveDocs
};

export type RegisterName =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'm1'
  | 'm2'
  | 'x'
  | 'y'
  | 'm'
  | 'j'
  | 'xy'
  | 'pc'
  | 'as'
  | 'ds';

export type AddressingMode = 'dr' | 'ar' | 'mIndirect' | 'imm';
