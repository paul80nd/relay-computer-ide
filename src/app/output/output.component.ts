import { Component, Input, output } from '@angular/core';
import { MonacoEditorComponent } from '../ngx-monaco-editor';
import { ClrIconModule } from '@clr/angular';

@Component({
  selector: 'app-ride-output',
  templateUrl: './output.component.html',
  imports: [MonacoEditorComponent, ClrIconModule]
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

  editorOptions = {
    language: 'rcdsm',
    lineNumbers: 'off',
    renderLineHighlight: 'none',
    readOnly: true, domReadOnly: true,
    scrollBeyondLastLine: false,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
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

  onNavigateDiagnostic(diag: IAssemblyDiagnostic) {
    this.gotoSourcePosition.emit(diag);
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

