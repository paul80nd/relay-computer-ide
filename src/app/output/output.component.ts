import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MonacoEditorModule } from '../ngx-monaco-editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-output',
  templateUrl: './output.component.html',
  imports: [MonacoEditorModule, FormsModule]
})
export class OutputComponent {

  stateType: string = 'info';
  stateText: string = 'ready';

  code: string = '';

  @Input()
  set dasm(val: string) {
    this.code = val;
  }

  @Output() gotoSource = new EventEmitter<number>();

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

  clearLabels() {
    this.labels = undefined;
  }

  setLabels(labels: { [k: string]: { name: string; }; }) {
    this.labels = labels;
  }

}
