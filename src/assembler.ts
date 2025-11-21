import * as rcasm from '@paul80nd/rcasm';
import { pluralize } from './utils';

export function assemble(code: string): AssemblerResult {
  const { prg, errors, labels, debugInfo } = rcasm.assemble(code);

  const didAssemble = errors.length === 0;
  let dasm = '';
  let labelDict = undefined;
  if (didAssemble) {
    dasm = rcasm.disassemble(prg, {
      isInstruction: debugInfo?.info().isInstruction,
      isData: debugInfo?.info().isData,
      dataLength: debugInfo?.info().dataLength
    }).join('\n');
    labelDict = Object.fromEntries(labels.map(l => [l.addr.toString(16).padStart(4, '0').toUpperCase(), { name: l.name }]));
  } else {
    dasm = `❌ Assembly failed (${pluralize(errors.length, 'error', 'errors')})`;
  }
  return {
    didAssemble: didAssemble,
    bytes: prg,
    dasm: dasm,
    pcToLocs: debugInfo?.pcToLocs,
    labels: labelDict
  }
}

export type AssemblerResult = {
  didAssemble: boolean;
  bytes?: Uint8Array;
  dasm: string;
  pcToLocs?: {
    [pc: number]: {
      lineNo: number;
      numBytes: number;
    }[];
  };
  labels?: {
    [k: string]: {
      name: string;
    };
  };
}

/** Exchange a given assembly address for the nearest originating source code line */
export function exchangeAddressForSourceLine(
  asm: AssemblerResult,
  address: number
): number | undefined {
  const pcToLocs = asm.pcToLocs;
  if (!pcToLocs) return undefined;

  let locs = pcToLocs[address];
  if (!locs) {
    const closestAddr = Object.keys(pcToLocs)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - address) < Math.abs(prev - address) ? curr : prev));
    locs = pcToLocs[closestAddr];
  }

  if (locs) {
    return locs[0].lineNo;
  }
}

/** Exchange a given source code line number for the approprate assembly address */
export function exchangeSourceLineNumberForAddress(asm: AssemblerResult, sourceLineNumber: number): number | undefined {
  const pcToLocs = asm.pcToLocs;
  if (!pcToLocs) return undefined;

  const matchingAddr = Object.keys(pcToLocs)
    .map(Number)
    .find(pc => pcToLocs[pc].some(loc => loc.lineNo === sourceLineNumber));
  if (matchingAddr !== undefined) {
    return matchingAddr;
  }
}
