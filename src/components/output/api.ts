import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import type { AssemblerResult } from '../../assembler.ts';
import { setCurrentAssembly } from '../../workers.ts';

export class OutputApi {
  private editor: monaco.editor.IStandaloneCodeEditor;

  constructor(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
  }

  /** Set the assembler result */
  setAssembly(assembly: AssemblerResult): void {
    this.editor.setValue(assembly.dasm);
    setCurrentAssembly(assembly); // Global instance for codelens providers
  }

  /** Jump to the line for the given address */
  gotoAddress(address: number) {
    const hexAddr = address.toString(16).toUpperCase().padStart(4, '0');
    const lineNo = this.getLineNumberFromHexAddress(hexAddr);
    if (lineNo) {
      this.editor.revealLineInCenterIfOutsideViewport(lineNo, monaco.editor.ScrollType.Smooth);
      this.editor.setPosition({ lineNumber: lineNo, column: 1 });
      this.editor.focus();
    }
  }

  dispose(): void {
    this.editor.dispose();
  }

  private getLineNumberFromHexAddress(hexAddr: string): number | undefined {
    const model = this.editor.getModel();
    if (!model) return;
    const matches = model.findMatches(hexAddr + ':', false, false, false, null, false);
    if (matches.length > 0) {
      const match = matches[0];
      return match.range.startLineNumber;
    }
  }
}
