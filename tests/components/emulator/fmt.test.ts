import { toCycleStatus } from '../../../src/components/emulator/fmt';

describe('toCycleStatus', () => {
  test('formats zero cycles', () => {
    expect(toCycleStatus(0)).toBe('0 cycles, 0h 00m 00s runtime');
  });

  test('runtime is whole seconds at 12 cycles per second', () => {
    expect(toCycleStatus(11)).toBe('11 cycles, 0h 00m 00s runtime');
    expect(toCycleStatus(1534)).toBe('1534 cycles, 0h 02m 07s runtime');
  });

  test('matches the runtime documented for pi-bbp-v1 (12h35m15s)', () => {
    expect(toCycleStatus(543786)).toBe('543786 cycles, 12h 35m 15s runtime');
  });
});
