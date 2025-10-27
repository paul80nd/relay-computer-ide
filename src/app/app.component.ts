import { Component, isDevMode, OnInit, inject, viewChild } from '@angular/core';
import { EmulatorComponent } from './emulator/emulator.component';
import { IAssemblyDiagnostic, IAssemblyError, IAssemblyOutcome, IAssemblyWarning, OutputComponent } from './output/output.component';
import { ClipboardService } from 'ngx-clipboard'
import * as rcasm from '@paul80nd/rcasm';
import { EditorComponent } from './editor/editor.component';
import { ClrCheckboxModule, ClrDropdownModule, ClrVerticalNavModule } from '@clr/angular';
import { DocsComponent } from './docs/docs.component';
import { ExamplesComponent } from './examples/examples.component';
import { DiffComponent } from './diff/diff.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ClrCheckboxModule, ClrDropdownModule, DocsComponent, EditorComponent, ExamplesComponent, ClrVerticalNavModule, EmulatorComponent, OutputComponent, DiffComponent, FormsModule]
})
export class AppComponent implements OnInit {
  private _clipboardService = inject(ClipboardService);

  readonly output = viewChild.required(OutputComponent);

  readonly editor = viewChild.required(EditorComponent);

  readonly emulator = viewChild.required(EmulatorComponent);

  _showDocs = false;
  _showEmu = false;

  get showDocs() { return this._showDocs; }
  set showDocs(value: boolean) {
    this._showDocs = value;
    localStorage.setItem('showDocs', value ? 'true' : 'false');
  }

  get showEmu() { return this._showEmu; }
  set showEmu(value: boolean) {
    this._showEmu = value;
    localStorage.setItem('showEmu', value ? 'true' : 'false');
  }

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
    // Show toggles
    this._showDocs = (localStorage.getItem('showDocs') ?? 'false') == 'true';
    this._showEmu = (localStorage.getItem('showEmu') ?? 'true') == 'true';

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
    this.output().clearLabels();
    this.didAssemble = errors.length == 0;
    const outcome = <IAssemblyOutcome>{
      bytes: prg.length,
      errors: errors.map(e => <IAssemblyError>{ message: e.msg, line: e.loc.start.line, column: e.loc.start.column }),
      warnings: warnings.map(w => <IAssemblyWarning>{ message: w.msg, line: w.loc.start.line, column: w.loc.start.column })
    }
    if (this.didAssemble) {
      this.dasm = rcasm.disassemble(prg, {
        isInstruction: debugInfo?.info().isInstruction,
        isData: debugInfo?.info().isData,
        dataLength: debugInfo?.info().dataLength
      }).join('\n');
      let labelDict = Object.fromEntries(labels.map(l => [l.addr.toString(16).padStart(4, '0').toUpperCase(), { name: l.name }]));
      this.output().setLabels(labelDict);
      this.emulator().load(this.lastCompile);
    } else {
      this.dasm = `❌ Assembly failed (${errors.length} error${errors.length === 1 ? '' : 's'})`;
    }
    this.output().didAssemble(outcome);
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
      this.editor().gotoPosition({ lineNumber: locs[0].lineNo, column: 1 });
    }
  }

  gotoSourcePosition(diag: IAssemblyDiagnostic) {
    this.editor().gotoPosition({ lineNumber: diag.line, column: diag.column });
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
