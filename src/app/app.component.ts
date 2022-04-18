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
    const { prg, errors, debugInfo } = rcasm.assemble(code);
    if (errors.length > 0) {
      this.dasm = '';
    } else {
      this.dasm = rcasm.disassemble(prg, { isInstruction: debugInfo!.info().isInstruction }).join('\n');
    }
  }

}
