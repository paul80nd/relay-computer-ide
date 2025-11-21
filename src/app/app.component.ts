import { Component, isDevMode, type OnInit, inject, ViewChild } from '@angular/core';
import { EmulatorComponent } from './emulator/emulator.component';
import { ClipboardService } from 'ngx-clipboard'
import * as rcasm from '@paul80nd/rcasm';
import { ClrCheckboxModule, ClrDropdownModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ClrCheckboxModule, ClrDropdownModule, ClrVerticalNavModule, EmulatorComponent]
})
export class AppComponent implements OnInit {
  private _clipboardService = inject(ClipboardService);

  readonly emulator = ViewChild.required(EmulatorComponent);

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
    const { prg, errors, debugInfo } = rcasm.assemble(code);
    this.lastCompile = prg;
    this.lastPcToLocs = debugInfo?.pcToLocs
    this.didAssemble = errors.length == 0;
    if (this.didAssemble) {
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
}
