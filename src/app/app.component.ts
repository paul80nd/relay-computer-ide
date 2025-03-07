import { Component, isDevMode, OnInit, inject, viewChild } from '@angular/core';
import { EmulatorComponent } from './emulator/emulator.component';
import { OutputComponent } from './output/output.component';
import { ClipboardService } from 'ngx-clipboard'
import * as rcasm from '@paul80nd/rcasm';
import { EditorComponent } from './editor/editor.component';
import { ClrCheckboxModule, ClrDropdownModule, ClrVerticalNavModule } from '@clr/angular';
import { DocsComponent } from './docs/docs.component';
import { ExamplesComponent } from './examples/examples.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ClrCheckboxModule, ClrDropdownModule, DocsComponent, EditorComponent, ExamplesComponent, ClrVerticalNavModule, EmulatorComponent, OutputComponent]
})
export class AppComponent implements OnInit {
  private _clipboardService = inject(ClipboardService);

  readonly output = viewChild.required(OutputComponent);

  readonly editor = viewChild.required(EditorComponent);

  readonly emulator = viewChild.required(EmulatorComponent);

  showDocs = false;
  showEmu = true;

  dasm = ''
  isDevMode: boolean;
  lastCompile?: Uint8Array;
  didAssemble: boolean = false;

  constructor() {
    this.isDevMode = isDevMode();
  }

  ngOnInit() {
    // Initially check if dark mode is enabled on system
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // If dark mode is enabled then directly switch to the dark-theme
    if (darkModeOn) {
      document.body.setAttribute("cds-theme", "dark");
    }
  }

  onEditorCodeChanged(code: string) {
    const { prg, errors, warnings, debugInfo } = rcasm.assemble(code);
    this.lastCompile = prg;
    if (errors.length > 0) {
      this.didAssemble = false;
      this.output().setStateAssembledWithErrors(errors.length, warnings.length);
      this.dasm = errors.map(w => `❌ ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
      this.dasm += '\n'
      this.dasm += warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
    } else {
      this.didAssemble = true;
      if (warnings.length > 0) {
        const msg = `Assembled with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`;
        this.output().setStateAssembledWithWarnings(warnings.length);
        this.dasm = warnings.map(w => `🔸 ${w.loc.start.line}:${w.loc.start.column} ${w.msg}`).join('\n');
        this.dasm += '\n\n'
      } else {
        this.output().setStateAssembledOk();
        this.dasm = '';
      }
      this.dasm += rcasm.disassemble(prg, { isInstruction: debugInfo!.info().isInstruction }).join('\n');
      this.emulator().load(this.lastCompile);
    }
  }

  exportToClipboard() {
    if (this.didAssemble && this.lastCompile) {
      const hex = [...this.lastCompile].map(x => x.toString(16).padStart(2, "0")).join('')
      this._clipboardService.copy(hex);
      this.output().setStateInformation(`Copied ${hex.length > 14 ? hex.substring(0, 14) + '...' : hex} to the clipboard`);
    }
  }

  exportToPaperTape() {
    if (this.didAssemble && this.lastCompile) {
      const wi = window.open('', 'tape', '');
      if (wi) {
        wi.location.href = 'assets/tape/tape.html';
        // Wait for window instance to be created
        setTimeout(() => {
          const prgId = Math.random().toString(36).slice(2, 10);
          const name = '';
          const desc = '';
          wi.document.body.innerText = `${prgId}@${name}@${desc}@${this.dasm.replace(/\n/gi, '|')}`;
          var script = document.createElement('script');
          script.src = 'tape.js';
          wi.document.head.appendChild(script);
        }, 500);
      }
    }
  }

  exportToLoadSheet() {
    if (this.didAssemble && this.lastCompile) {
      const wi = window.open('', 'loadsheet', '');
      if (wi) {
        wi.location.href = 'assets/loadsheet/ldsht.html';
        // Wait for window instance to be created
        setTimeout(() => {
          const prgId = Math.random().toString(36).slice(2, 10);
          const name = '';
          const desc = '';
          wi.document.body.innerText = `${prgId}@${name}@${desc}@${this.dasm.replace(/\n/gi, '|')}`;
          var script = document.createElement('script');
          script.src = 'ldsht.js';
          wi.document.head.appendChild(script);
        }, 500);
      }
    }
  }

  onExampleRequested(example: string) {
    this.editor().loadExample(example);
  }
}
