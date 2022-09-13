import { Component, isDevMode, ViewChild } from '@angular/core';
import { OutputComponent } from './output/output.component';
import * as rcasm from '@paul80nd/rcasm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild(OutputComponent)
  private output!: OutputComponent;

  dasm = ''
  isDevMode: boolean;
  lastCompile?: Uint8Array;
  didAssemble: boolean = false;

  constructor() {
    this.isDevMode = isDevMode();
  }

  onEditorCodeChanged(code: string) {
    const { prg, errors, warnings, debugInfo } = rcasm.assemble(code);
    this.lastCompile = prg;
    if (errors.length > 0) {
      this.didAssemble = false;
      this.output.setStateAssembledWithErrors(errors.length, warnings.length);
      this.dasm = errors.map(w => `❌ ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
      this.dasm += '\n'
      this.dasm += warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
    } else {
      this.didAssemble = true;
      if (warnings.length > 0) {
        const msg = `Assembled with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`;
        this.output.setStateAssembledWithWarnings(warnings.length);
        this.dasm = warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
        this.dasm += '\n\n'
      } else {
        this.output.setStateAssembledOk();
        this.dasm = '';
      }
      this.dasm += rcasm.disassemble(prg, { isInstruction: debugInfo!.info().isInstruction }).join('\n');
    }
  }

  exportToClipboard() {
    if (this.didAssemble && this.lastCompile) {
      alert([...this.lastCompile].map(x => x.toString(16).padStart(2, "0")).join(''));
    }
  }
}
