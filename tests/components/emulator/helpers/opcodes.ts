/** SETA: vvvvv (v: if bit4 set, sign-extended nibble) */
export const SETA = (v: number) => 0x40 | (v & 0x1f);

/** SETB: vvvvv (v: if bit4 set, sign-extended nibble) */
export const SETB = (v: number) => 0x60 | (v & 0x1f);

/** MOV8: 00 ddd sss */
export const MOV8 = (d: number, s: number) => ((d & 0x7) << 3) | (s & 0x7);

/** ALU: fff  (f = func index per aluFunc) */
export const ALU = (f: number) => 0x80 | (f & 0x7);

/** ALUD: fff  (f = func index per aluFunc) */
export const ALUD = (f: number) => 0x88 | (f & 0x7);

/** LOAD: dd */
export const LOAD = (d: number) => 0x90 | (d & 0x3);

/** STORE: ss */
export const STORE = (s: number) => 0x98 | (s & 0x3);

/** MOV16: d ss (d=0 -> XY, d=1 -> PC; s: 0=M,1=XY,2=J,3=0) */
export const MOV16 = (d: number, s: number) => 0xa0 | ((d & 0x1) << 2) | (s & 0x3);

export const LDSW = 0xac;
export const LDSWD = 0xad;
export const HALT = 0xae;
export const HALTR = 0xaf;
export const INCXY = 0xb0;

/**  GOTO: d s c z n x, then hi, then lo */
export const GOTO = (
  opts: { d?: 0 | 1; s?: 0 | 1; c?: 0 | 1; z?: 0 | 1; n?: 0 | 1; x?: 0 | 1 },
  tgt: number,
) => {
  const { d = 0, s = 0, c = 0, z = 0, n = 0, x = 0 } = opts;
  const op =
    0xc0 |
    ((d & 1) << 5) |
    ((s & 1) << 4) |
    ((c & 1) << 3) |
    ((z & 1) << 2) |
    ((n & 1) << 1) |
    (x & 1);
  return [op, (tgt >> 8) & 0xff, tgt & 0xff];
};
