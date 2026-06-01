import type { MnemonicDoc } from '.';

export const emulatorDocs: Record<string, MnemonicDoc> = {
  '@watch': {
    title: '@watch',
    summary: 'Define Emulator Watches',
    syntax: ['; @watch <label>:<bytes>[:le|:be][,...]'],
    description: [
      'Shows each listed label and the next `<bytes>` of memory in a live watches block below the emulator memory view.',
      'Append `:le` to display a little-endian value with bytes reversed (MSB first, matching how the number reads). Default is `:be` (raw memory order). LE rows are tagged with a small `LE` badge after the name.',
      'Lengths are clamped to 1..12; over-size watches are shown in yellow, unknown labels in red. Hover the name for details.',
      'Only the first `;@watch` line in the source is used.',
      'Example: `;@watch pi:9, psum:10:le, fra:7:le, frb:7:le, frc:7:le, frd:7:le`'
    ]
  }
};
