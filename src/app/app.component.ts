import { Component } from '@angular/core';
import * as rcasm from '@paul80nd/rcasm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  dasm = ''

  onEditorCodeChanged(code: string) {
    const { prg, errors } = rcasm.assemble(code);
    if (errors.length > 0) {
      this.dasm = '';
    } else {
      this.dasm = rcasm.disassemble(prg).join('\n');
    }
  }

}
