import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-ride-output',
  templateUrl: './output.component.html',
  imports: [MonacoEditorModule]
})
export class OutputComponent {

  stateType: string = 'info';
  stateText: string = 'ready';

  @Input()
  set dasm(val: string) {
    this.editor?.getModel()?.setValue(val);
  }

  @Output() gotoSource = new EventEmitter<number>();

  editor: monaco.editor.IStandaloneCodeEditor | null = null;

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

  onInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
    editor.addAction(<monaco.editor.IActionDescriptor>{
      id: "rcasm-jump-to-source",
      label: "Go to Source",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: (ed) => {
        const pos = ed.getPosition();
        const addrText = pos ? ed.getModel()?.getLineContent(pos.lineNumber).substring(0, 4) : '';
        if (!addrText) { return; }
        const addr = parseInt(addrText, 16);
        this.gotoSource.emit(addr);
      },
    });
  }

  setStateAssembledOk(byteCount: number) {
    this.stateType = 'success';
    this.stateText = `Assembled OK : ${byteCount} bytes`;
  }
  setStateAssembledWithWarnings(warnCount: number) {
    this.stateType = 'warning';
    this.stateText = `Assembled with ${warnCount} warning${warnCount === 1 ? '' : 's'}`;
  }
  setStateAssembledWithErrors(errorCount: number, warnCount: number) {
    const errorText = `${errorCount} error${errorCount === 1 ? '' : 's'}`;
    const warningText = warnCount > 0 ? `, ${warnCount} warning${warnCount === 1 ? '' : 's'}` : '';
    this.stateText = `Assembly failed with ${errorText}${warningText}`;
    this.stateType = 'danger';
  }
  setStateInformation(message: string) {
    this.stateText = message;
    this.stateType = 'info';
  }

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
}
