import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ride-output',
  templateUrl: './output.component.html'
})
export class OutputComponent {

  stateType: string = 'info';
  stateText: string = 'ready';

  @Input()
  set dasm(val: string) {
    this.editor?.getModel()?.setValue(val);
  }

  editor: monaco.editor.ICodeEditor | null = null;

  editorOptions = <monaco.editor.IStandaloneEditorConstructionOptions>{
    language: 'rcdsm',
    lineNumbers: 'off',
    renderLineHighlight: 'none',
    readOnly: true, domReadOnly: true,
    scrollBeyondLastLine: true,
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'vs-dark' : 'vs-light',
    padding: { top: 15 },
    minimap: { enabled: false }
  };

  onInit(editor: monaco.editor.ICodeEditor) {
    this.editor = editor;
  }

  setStateAssembledOk() {
    this.stateType = 'success';
    this.stateText = 'Assembled OK';
  }
  setStateAssembledWithWarnings(warnCount: number) {
    this.stateType = 'warning';
    this.stateText = `Assembled with ${warnCount} warning${warnCount === 1 ? '' : 's'}`;
  }
  setStateAssembledWithErrors(errorCount: number, warnCount: number) {
    const errorText = `${errorCount} error${errorCount === 1 ? '' : 's'}`;
    const warningText =  warnCount > 0 ? `, ${warnCount} warning${warnCount === 1 ? '' : 's'}` : '';
    this.stateText = `Assembly failed with ${errorText}${warningText}`;
    this.stateType = 'danger';
  }
  setStateInformation(message: string){
    this.stateText = message;
    this.stateType = 'info';
  }
}
