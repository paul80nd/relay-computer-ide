import {
  AssemblerResult,
  exchangeAddressForSourceLine,
  exchangeSourceLineNumberForAddress,
} from '../src/assembler';

function asmWith(pcToLocs: AssemblerResult['pcToLocs']): AssemblerResult {
  return { didAssemble: true, dasm: '', pcToLocs };
}

describe('exchangeAddressForSourceLine', () => {
  test('returns undefined when pcToLocs is missing', () => {
    expect(exchangeAddressForSourceLine(asmWith(undefined), 0x100)).toBeUndefined();
  });

  test('returns undefined when pcToLocs is empty (regression: empty-object crash)', () => {
    expect(() => exchangeAddressForSourceLine(asmWith({}), 0x100)).not.toThrow();
    expect(exchangeAddressForSourceLine(asmWith({}), 0x100)).toBeUndefined();
  });

  test('returns the source line for an exact PC match', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x101: [{ lineNo: 11, numBytes: 2 }],
    });
    expect(exchangeAddressForSourceLine(asm, 0x101)).toBe(11);
  });

  test('falls back to the nearest PC when no exact match exists', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }],
    });
    // 0x108 is equidistant; reduce keeps the first (prev) — 0x100.
    expect(exchangeAddressForSourceLine(asm, 0x108)).toBe(10);
    // 0x109 is closer to 0x110.
    expect(exchangeAddressForSourceLine(asm, 0x109)).toBe(20);
  });

  test('handles address before the first PC', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }],
    });
    expect(exchangeAddressForSourceLine(asm, 0x000)).toBe(10);
  });

  test('handles address after the last PC', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }],
    });
    expect(exchangeAddressForSourceLine(asm, 0xfff0)).toBe(20);
  });

  test('returns the first loc when a PC maps to multiple source locations', () => {
    const asm = asmWith({
      0x100: [
        { lineNo: 7, numBytes: 1 },
        { lineNo: 42, numBytes: 1 },
      ],
    });
    expect(exchangeAddressForSourceLine(asm, 0x100)).toBe(7);
  });
});

describe('exchangeSourceLineNumberForAddress', () => {
  test('returns undefined when pcToLocs is missing', () => {
    expect(exchangeSourceLineNumberForAddress(asmWith(undefined), 10)).toBeUndefined();
  });

  test('returns undefined when pcToLocs is empty', () => {
    expect(exchangeSourceLineNumberForAddress(asmWith({}), 10)).toBeUndefined();
  });

  test('returns the address that maps to the requested source line', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x101: [{ lineNo: 11, numBytes: 2 }],
      0x103: [{ lineNo: 12, numBytes: 1 }],
    });
    expect(exchangeSourceLineNumberForAddress(asm, 11)).toBe(0x101);
  });

  test('finds an address even when the line is one of several locs at that PC', () => {
    const asm = asmWith({
      0x200: [
        { lineNo: 7, numBytes: 1 },
        { lineNo: 42, numBytes: 1 },
      ],
    });
    expect(exchangeSourceLineNumberForAddress(asm, 42)).toBe(0x200);
  });

  test('returns undefined when no PC maps to the requested source line', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
    });
    expect(exchangeSourceLineNumberForAddress(asm, 99)).toBeUndefined();
  });
});
