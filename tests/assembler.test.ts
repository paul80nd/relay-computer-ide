import {
  AssemblerResult,
  exchangeAddressForSourceLine,
  exchangeSourceLineNumberForAddress,
  extractWatches
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
      0x101: [{ lineNo: 11, numBytes: 2 }]
    });
    expect(exchangeAddressForSourceLine(asm, 0x101)).toBe(11);
  });

  test('falls back to the nearest PC when no exact match exists', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }]
    });
    // 0x108 is equidistant; reduce keeps the first (prev) — 0x100.
    expect(exchangeAddressForSourceLine(asm, 0x108)).toBe(10);
    // 0x109 is closer to 0x110.
    expect(exchangeAddressForSourceLine(asm, 0x109)).toBe(20);
  });

  test('handles address before the first PC', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }]
    });
    expect(exchangeAddressForSourceLine(asm, 0x000)).toBe(10);
  });

  test('handles address after the last PC', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }],
      0x110: [{ lineNo: 20, numBytes: 1 }]
    });
    expect(exchangeAddressForSourceLine(asm, 0xfff0)).toBe(20);
  });

  test('returns the first loc when a PC maps to multiple source locations', () => {
    const asm = asmWith({
      0x100: [
        { lineNo: 7, numBytes: 1 },
        { lineNo: 42, numBytes: 1 }
      ]
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
      0x103: [{ lineNo: 12, numBytes: 1 }]
    });
    expect(exchangeSourceLineNumberForAddress(asm, 11)).toBe(0x101);
  });

  test('finds an address even when the line is one of several locs at that PC', () => {
    const asm = asmWith({
      0x200: [
        { lineNo: 7, numBytes: 1 },
        { lineNo: 42, numBytes: 1 }
      ]
    });
    expect(exchangeSourceLineNumberForAddress(asm, 42)).toBe(0x200);
  });

  test('returns undefined when no PC maps to the requested source line', () => {
    const asm = asmWith({
      0x100: [{ lineNo: 10, numBytes: 1 }]
    });
    expect(exchangeSourceLineNumberForAddress(asm, 99)).toBeUndefined();
  });
});

describe('extractWatches', () => {
  test('returns undefined when no directive is present', () => {
    expect(extractWatches('; a normal comment\nhlt')).toBeUndefined();
    expect(extractWatches('')).toBeUndefined();
  });

  test('parses a single name:length watch', () => {
    expect(extractWatches(';@watch foo:5')).toEqual([
      { name: 'foo', length: 5, requested: 5 }
    ]);
  });

  test('parses multiple watches with comma and whitespace separators', () => {
    expect(extractWatches(';@watch pi:9, psum:10 fra:7,frb:7')).toEqual([
      { name: 'pi', length: 9, requested: 9 },
      { name: 'psum', length: 10, requested: 10 },
      { name: 'fra', length: 7, requested: 7 },
      { name: 'frb', length: 7, requested: 7 }
    ]);
  });

  test('defaults length to 1 when missing or non-numeric', () => {
    expect(extractWatches(';@watch foo')).toEqual([
      { name: 'foo', length: 1, requested: 1 }
    ]);
    expect(extractWatches(';@watch foo:abc')).toEqual([
      { name: 'foo', length: 1, requested: 1 }
    ]);
  });

  test('clamps over-12 length to 12 and preserves requested', () => {
    expect(extractWatches(';@watch big:30')).toEqual([
      { name: 'big', length: 12, requested: 30 }
    ]);
  });

  test('clamps below-1 length to 1', () => {
    expect(extractWatches(';@watch tiny:0')).toEqual([
      { name: 'tiny', length: 1, requested: 0 }
    ]);
    expect(extractWatches(';@watch tiny:-5')).toEqual([
      { name: 'tiny', length: 1, requested: -5 }
    ]);
  });

  test('directive is case-insensitive', () => {
    expect(extractWatches(';@WATCH foo:3')).toEqual([
      { name: 'foo', length: 3, requested: 3 }
    ]);
    expect(extractWatches(';@Watch foo:3')).toEqual([
      { name: 'foo', length: 3, requested: 3 }
    ]);
  });

  test('tolerates whitespace between semicolon and @watch', () => {
    expect(extractWatches('; @watch foo:3')).toEqual([
      { name: 'foo', length: 3, requested: 3 }
    ]);
    expect(extractWatches('  ;  @watch  foo:3  ')).toEqual([
      { name: 'foo', length: 3, requested: 3 }
    ]);
  });

  test('only the first directive line is used', () => {
    const code = [
      '; header',
      ';@watch first:2',
      'hlt',
      ';@watch second:9'
    ].join('\n');
    expect(extractWatches(code)).toEqual([
      { name: 'first', length: 2, requested: 2 }
    ]);
  });

  test('ignores non-watch annotation lines', () => {
    expect(extractWatches(';@highlight foo:5\n;@watch bar:3')).toEqual([
      { name: 'bar', length: 3, requested: 3 }
    ]);
  });
});
