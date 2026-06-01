import * as rcasm from '@paul80nd/rcasm';
import { pluralize } from './utils';

export function assemble(code: string): AssemblerResult {
  const { prg, errors, labels, debugInfo } = rcasm.assemble(code);

  const didAssemble = errors.length === 0;
  let dasm = '';
  let labelDict = undefined;
  if (didAssemble) {
    dasm = rcasm
      .disassemble(prg, {
        isInstruction: debugInfo?.info().isInstruction,
        isData: debugInfo?.info().isData,
        dataLength: debugInfo?.info().dataLength
      })
      .join('\n');
    labelDict = Object.fromEntries(
      labels.map(l => [l.addr.toString(16).padStart(4, '0').toUpperCase(), { name: l.name }])
    );
  } else {
    dasm = `❌ Assembly failed (${pluralize(errors.length, 'error', 'errors')})`;
  }
  return {
    didAssemble: didAssemble,
    bytes: prg,
    dasm: dasm,
    pcToLocs: debugInfo?.pcToLocs,
    labels: labelDict,
    watches: extractWatches(code)
  };
}

// Source-level directive: a comment line of the form
//   ;@watch pi:9, psum:10, fra:7 frb:7 frc:7 frd:7
// Each token is "<labelName>:<byteLength>". Separators may be whitespace and/or
// commas. Length is clamped to [1, 12] so the watches block always fits the
// emulator display. Returns undefined when no directive is present.
export type WatchEndian = 'be' | 'le';

export function extractWatches(
  code: string
):
  | { name: string; length: number; requested: number; endian: WatchEndian }[]
  | undefined {
  for (const line of code.split('\n')) {
    const m = /^\s*;\s*@watch\s+(.+?)\s*$/i.exec(line);
    if (!m) continue;
    return m[1]
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(tok => {
        // Tokens are name[:length[:endian]]; unknown trailing parts are ignored.
        const parts = tok.split(':');
        const name = parts[0];
        const parsed = parseInt(parts[1] ?? '', 10);
        const requested = Number.isFinite(parsed) ? parsed : 1;
        const length = Math.max(1, Math.min(12, requested));
        const endian: WatchEndian = parts[2]?.toLowerCase() === 'le' ? 'le' : 'be';
        return { name, length, requested, endian };
      })
      .filter(w => w.name);
  }
  return undefined;
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
  watches?: { name: string; length: number; requested: number; endian: WatchEndian }[];
};

/** Exchange a given assembly address for the nearest originating source code line */
export function exchangeAddressForSourceLine(
  asm: AssemblerResult,
  address: number
): number | undefined {
  const pcToLocs = asm.pcToLocs;
  if (!pcToLocs) return undefined;

  let locs = pcToLocs[address];
  if (!locs) {
    const pcs = Object.keys(pcToLocs).map(Number);
    if (pcs.length === 0) return undefined;
    const closestAddr = pcs.reduce((prev, curr) =>
      Math.abs(curr - address) < Math.abs(prev - address) ? curr : prev
    );
    locs = pcToLocs[closestAddr];
  }

  if (locs) {
    return locs[0].lineNo;
  }
}

/** Exchange a given source code line number for the approprate assembly address */
export function exchangeSourceLineNumberForAddress(
  asm: AssemblerResult,
  sourceLineNumber: number
): number | undefined {
  const pcToLocs = asm.pcToLocs;
  if (!pcToLocs) return undefined;

  const matchingAddr = Object.keys(pcToLocs)
    .map(Number)
    .find(pc => pcToLocs[pc].some(loc => loc.lineNo === sourceLineNumber));
  if (matchingAddr !== undefined) {
    return matchingAddr;
  }
}
