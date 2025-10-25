import { Component, isDevMode, OnInit, inject, viewChild } from '@angular/core';
import { EmulatorComponent } from './emulator/emulator.component';
import { OutputComponent } from './output/output.component';
import { ClipboardService } from 'ngx-clipboard'
import * as rcasm from '@paul80nd/rcasm';
import { RcasmEditorComponent } from './editor/editor.component';
import { ClrCheckboxModule, ClrDropdownModule, ClrVerticalNavModule } from '@clr/angular';
import { DocsComponent } from './docs/docs.component';
import { ExamplesComponent } from './examples/examples.component';
import { DiffComponent } from './diff/diff.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ClrCheckboxModule, ClrDropdownModule, DocsComponent, RcasmEditorComponent, ExamplesComponent, ClrVerticalNavModule, EmulatorComponent, OutputComponent, DiffComponent]
})
export class AppComponent implements OnInit {
  private _clipboardService = inject(ClipboardService);

  readonly output = viewChild.required(OutputComponent);

  readonly editor = viewChild.required(RcasmEditorComponent);

  readonly emulator = viewChild.required(EmulatorComponent);

  showDocs = false;
  showEmu = true;

  dasm = ''
  isDevMode: boolean;
  lastCompile?: Uint8Array;
  didAssemble: boolean = false;
  lastPcToLocs: { [pc: number]: { lineNo: number; numBytes: number; }[]; } | undefined;
  diff: boolean = false;

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
    const { prg, errors, warnings, labels, debugInfo } = rcasm.assemble(code);
    this.lastCompile = prg;
    this.lastPcToLocs = debugInfo?.pcToLocs
    this.editor().setDiagnostics(errors, warnings);
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
        this.output().setStateAssembledOk(prg.length);
        this.dasm = '';
      }
      if (code.startsWith('; LABELS')) {
        this.dasm += `🔹 LABELS (${labels.length})\n`;
        this.dasm += labels.map(l => `🔹 ${l.addr.toString(16).padStart(4, '0')}: ${l.name}`).join('\n');
        this.dasm += '\n\n'
      }
      this.dasm += rcasm.disassemble(prg, { isInstruction: debugInfo!.info().isInstruction }).join('\n');
      this.emulator().load(this.lastCompile);
    }
  }

  gotoSource(addr: number) {
    if (!this.lastPcToLocs) { return; }
    let locs = this.lastPcToLocs?.[addr];
    if (!locs) {
      const closestAddr = Object.keys(this.lastPcToLocs)
        .map(Number)
        .reduce((prev, curr) => (Math.abs(curr - addr) < Math.abs(prev - addr) ? curr : prev));
      locs = this.lastPcToLocs[closestAddr];
    }

    if (locs) {
      this.editor().gotoLine(locs[0].lineNo);
    }
  }

  gotoAssembled(line: number) {
    if (!this.lastPcToLocs) { return; }
    const matchingAddr = Object.keys(this.lastPcToLocs)
      .map(Number)
      .find(pc => this.lastPcToLocs![pc].some(loc => loc.lineNo === line));
    if (matchingAddr) {
      const hexAddr = matchingAddr.toString(16).toUpperCase().padStart(4, '0');
      this.output().gotoLine(hexAddr)
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
