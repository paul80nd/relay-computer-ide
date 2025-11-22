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
