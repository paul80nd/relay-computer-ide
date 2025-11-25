export function program(offset: number, ...bytes: number[]): Uint8Array {
  const hdr = [offset & 0xff, (offset >> 8) & 0xff];
  return new Uint8Array([...hdr, ...bytes.map(b => b & 0xff)]);
}

export function padTo(addrStart: number, currentLen: number, targetAddr: number): number[] {
  const currentAddr = (addrStart + currentLen) & 0xffff;
  const pad = (targetAddr - currentAddr) & 0xffff;
  return new Array(pad).fill(0x00);
}
