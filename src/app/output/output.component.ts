import { Component, Input, output } from '@angular/core';
import { MonacoEditorComponent } from '../ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { ClrIconModule } from '@clr/angular';

@Component({
  selector: 'app-ride-output',
  templateUrl: './output.component.html',
  imports: [MonacoEditorComponent, FormsModule, ClrIconModule]
})
export class OutputComponent {
  status: { type: string, text: string } = { type: 'info', text: 'ready' }
  outcome: IAssemblyOutcome = { bytes: 0, errors: [], warnings: [] };

  code: string = '';

  @Input()
  set dasm(val: string) {
    this.code = val;
  }

  readonly gotoSource = output<number>();
  readonly gotoSourcePosition = output<IAssemblyDiagnostic>();

  editor: monaco.editor.IStandaloneCodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcdsm',
    lineNumbers: 'off',
    renderLineHighlight: 'none',
    readOnly: true, domReadOnly: true,
    scrollBeyondLastLine: false,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    minimap: { enabled: false }
  };

  labels?: {
    [k: string]: {
      name: string;
    };
  }

  onInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    // Add goto source action
    editor.addAction(<monaco.editor.IActionDescriptor>{
      id: "rcasm-jump-to-source",
      label: "Go to Source",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: (ed: monaco.editor.IStandaloneCodeEditor) => {
        const pos = ed.getPosition();
        const addrText = pos ? ed.getModel()?.getLineContent(pos.lineNumber).substring(0, 4) : '';
        if (!addrText) { return; }
        const addr = parseInt(addrText, 16);
        this.gotoSource.emit(addr);
      }
    });

    // Add goto source command
    var commandId = editor.addCommand(
      0,
      (_, addrText: string) => {
        if (addrText) {
          const addr = parseInt(addrText, 16);
          this.gotoSource.emit(addr);
        }
      },
      ""
    );

    // Add labels code lens
    (window as any).monaco.languages.registerCodeLensProvider("rcdsm", <monaco.languages.CodeLensProvider>{
      provideCodeLenses: (model: monaco.editor.ITextModel, token: monaco.CancellationToken) => {
        if (!this.labels) {
          return { lenses: [], dispose: () => { } };
        }

        // Review line-by-line looking for label matches by address
        var labelLenses: monaco.languages.CodeLens[] = [];
        model.getLinesContent().forEach((v, idx) => {
          const addr = v.substring(0, 4)
          const label = this.labels![addr];
          if (label) {
            labelLenses.push({
              range: {
                startLineNumber: idx + 1,
                startColumn: 1,
                endLineNumber: idx + 1,
                endColumn: 1,
              },
              id: `${addr}:${label.name}`,
              command: {
                id: commandId!,
                title: label.name,
                arguments: [addr]
              },
            });
          }
        });

        return { lenses: labelLenses, dispose: () => { }, };
      },
      resolveCodeLens: function (model: monaco.editor.ITextModel, codeLens: monaco.languages.CodeLens, token: monaco.CancellationToken) {
        return codeLens;
      },
    });
  }

  setStateInformation(message: string) {
    this.status = { type: 'info', text: message };
  }

  didAssemble(outcome: IAssemblyOutcome) {
    this.outcome = outcome;
    if (outcome.errors.length > 0) {
      // Had errors (and potentially warnings too)
      this.status = { type: 'danger', text: this.errorText(outcome.errors.length, outcome.warnings.length) };
    } else if (outcome.warnings.length > 0) {
      // Had warnings
      this.status = { type: 'warning', text: this.warningText(outcome.warnings.length) };
    } else {
      // Was OK
      this.status = { type: 'success', text: `Assembled OK : ${outcome.bytes} bytes` };
    }
  }

  private warningText = (warns: number) => `Assembled with ${warns} warning${warns === 1 ? '' : 's'}`;
  private errorText = (errors: number, warns: number) => {
    const errorText = `${errors} error${errors === 1 ? '' : 's'}`;
    const warningText = warns > 0 ? ` and ${warns} warning${warns === 1 ? '' : 's'}` : '';
    return `Assembly failed with ${errorText}${warningText}`;
  };

  gotoLine(hexAddr: string) {
    const model = this.editor?.getModel();
    if (!model || !this.editor) { return; }
    const matches = model.findMatches(hexAddr + ":", false, false, false, null, false);
    if (matches.length > 0) {
      const match = matches[0];
      const lineNo = match.range.startLineNumber;
      this.editor.revealLineInCenter(lineNo);
      this.editor.setPosition({ lineNumber: lineNo, column: 1 });
      this.editor.focus();
    }
  }

  onNavigateDiagnostic(diag: IAssemblyDiagnostic) {
    this.gotoSourcePosition.emit(diag);
  }

  clearLabels() {
    this.labels = undefined;
  }

  setLabels(labels: { [k: string]: { name: string; }; }) {
    this.labels = labels;
  }

}

export interface IAssemblyOutcome {
  bytes: number,
  errors: IAssemblyError[],
  warnings: IAssemblyWarning[],
}

export interface IAssemblyDiagnostic {
  message: string,
  line: number,
  column: number
}
export interface IAssemblyError extends IAssemblyDiagnostic { }
export interface IAssemblyWarning extends IAssemblyDiagnostic { }

