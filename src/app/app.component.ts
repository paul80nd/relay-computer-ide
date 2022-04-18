import { Component, isDevMode } from '@angular/core';
import * as rcasm from '@paul80nd/rcasm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  dasm = ''
  isDevMode: boolean;

  constructor() {
    this.isDevMode = isDevMode();
  }

  onEditorCodeChanged(code: string) {
    const { prg, errors, warnings, debugInfo } = rcasm.assemble(code);
    if (errors.length > 0) {
      this.dasm = '❌ Assembly Failed\n\n';
      this.dasm += errors.map(w => `❌ ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
      this.dasm += '\n'
      this.dasm += warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
    } else {
      if (warnings.length > 0) {
        this.dasm = 'Assembled OK (with warnings)\n\n';
        this.dasm += warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
        this.dasm += '\n\n'
      } else {
        this.dasm = 'Assembled OK\n\n';
      }
      this.dasm += rcasm.disassemble(prg, { isInstruction: debugInfo!.info().isInstruction }).join('\n');
    }
  }

}
