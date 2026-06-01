import type { MnemonicDoc } from '.';

export const emulatorDocs: Record<string, MnemonicDoc> = {
  '@watch': {
    title: '@watch',
    summary: 'Define Emulator Watches',
    syntax: ['; @watch <label>:<bytes>[,...]'],
    description: [
      'Shows each listed label and the next `<bytes>` of memory in a live watches block below the emulator memory view.',
      'Lengths are clamped to 1..12; over-size watches are shown in yellow, unknown labels in red. Hover the name for details.',
      'Only the first `;@watch` line in the source is used.',
      'Example: `;@watch pi:9, psum:10, fra:7, frb:7, frc:7, frd:7`'
    ]
  }
};
