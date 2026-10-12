export function toHex(v: number, width: number) {
  const mask = width <= 2 ? 0xff : 0xffff;
  const n = (v ?? 0) & mask;
  return n.toString(16).toUpperCase().padStart(width, '0');
}
export function toBin(v: number, width: number) {
  const mask = width <= 2 ? 0xff : 0xffff;
  const n = (v ?? 0) & mask;
  return n.toString(2).padStart(width * 4, '0');
}
export function toDec(v: number) {
  return String(v ?? 0);
}
/** Status text for a cycle count, with runtime at the computer's 12 cycles/second */
export function toCycleStatus(cycles: number) {
  const d = Math.floor(cycles / 12);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d - h * 3600) / 60);
  const s = d - h * 3600 - m * 60;
  return `${cycles} cycles, ${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s runtime`;
}
