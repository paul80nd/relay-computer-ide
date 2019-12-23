import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { EditorComponent } from './editor.component';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

interface MonarchLanguageConfiguration extends monaco.languages.IMonarchLanguage {
  keywords: string[];
}
interface MonarchLanguageCompletionItemProvider extends monaco.languages.CompletionItemProvider {
  completionMnemonics: any;
}

export function onMonacoLoad() {

  monaco.languages.register({ id: 'xrcasm' });

  monaco.languages.setMonarchTokensProvider('xrcasm', {
    ignoreCase: true,
    keywords: [
      'add', 'and', 'bnz', 'clr', 'inc', 'jmp', 'mov', 'not', 'ldi', 'orr', 'eor', 'rol'
    ],
    types: [
      'a', 'b', 'c', 'd'
    ],
    tokenizer: {
      root: [
        // Identifiers and keywords
        [/^[a-z]+:/, 'identifier'],
        [/[a-z]{3}/, {cases: {'@keywords': 'keyword'}}],
        [/[a-d]/, {cases: {'@types': 'type'}}],

        // Whitespace
        { include: '@whitespace'},

        // Numbers
        [/[01]+b/, 'number'],
        [/0[xX][0-9a-fA-F]+/, 'number'],
        [/-?\d+/, 'number']
      ],
      whitespace: [
        [/[\t\r\n]+/, 'white'],
        [/;.*$/, 'comment'],
      ],
    },
  } as MonarchLanguageConfiguration);

  monaco.languages.registerCompletionItemProvider('xrcasm', {
    completionMnemonics: [
      { label: 'add', detail: 'Arithmetic Add [ALU]', insertText: 'add', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'and', detail: 'Logic And [ALU]', insertText: 'and', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'clr', detail: 'Zero Value [ALU]', insertText: 'clr', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'inc', detail: 'Increment [ALU]', insertText: 'inc', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'not', detail: 'Logic Not [ALU]', insertText: 'not', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'orr', detail: 'Logic Or [ALU]', insertText: 'orr', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'eor', detail: 'Logic Xor [ALU]', insertText: 'eor', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'rol', detail: 'Bitwise Circular Shift Left [ALU]', insertText: 'rol', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'ldi', detail: 'Load Immediate [SETAB]', insertText: 'ldi ${1:a},${2:0}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      kind: monaco.languages.CompletionItemKind.Function },
      { label: 'mov', detail: 'Copy Register to Register [MOV8]', insertText: 'mov ${1:b},${2:a}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      kind: monaco.languages.CompletionItemKind.Function },
      { label: 'jmp', detail: 'Jump to Label [GOTO]', insertText: 'jmp', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'bnz', detail: 'Branch if Not Zero [GOTO]', insertText: 'bnz ${1:label}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      kind: monaco.languages.CompletionItemKind.Function }
    ],
    provideCompletionItems(model, position) {
      // Provide mnemonic completions following label or tabs/spaces at start of line only
      var textOnLine = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
      var match = textOnLine.match(/^([a-z]+:)?[ \t]+/);            
      if (!match) { return { suggestions: [] }; }
      return { suggestions:  this.completionMnemonics };
    }
  } as MonarchLanguageCompletionItemProvider);

  monaco.languages.registerHoverProvider('xrcasm', {
    provideHover(model, position, token): monaco.languages.ProviderResult<monaco.languages.Hover> {
      const line = model.getLineContent(position.lineNumber);
      let contents: monaco.IMarkdownString[] = null;

      // ALU match
      const aluMatch = line.match(/^(?:[a-z]+:)?[ \t]+(add|and|clr|inc|not|orr|eor|rol)(?: ([ad]))?/i);
      if (aluMatch && aluMatch[1])
      {
        let opcode = aluMatch[1];
        let optParam = (aluMatch[2] ? aluMatch[2] : 'a').toUpperCase();
        switch (opcode.toLowerCase()) {
          case 'add':
            contents = [{ value: '**Arithmetic Add [ALU]**'}, { value: '`'+optParam+' = B + C`  \nAdds the values in register B and C, placing the result in register ' + optParam}]; break;
          case 'and':
            contents = [{ value: '**Logical AND [ALU]**'}, { value: '`'+optParam+' = B & C`  \nPerforms a logical AND on the values in register B and C, placing the result in register ' + optParam}]; break;
          case 'clr':
            contents = [{ value: '**Clear Value [ALU]**'}, { value: '`'+optParam+' = 0`  \nPerforms a ALU clear by placing the result of a no-op in register ' + optParam}]; break;
          case 'inc':
            contents = [{ value: '**Increment [ALU]**'}, { value: '`'+optParam+' = B + 1`  \nIncrements the value in register B, placing the result in register ' + optParam}]; break;
          case 'not':
            contents = [{ value: '**Logical NOT [ALU]**'}, { value: '`'+optParam+' = ~B`  \nPerforms a logical NOT on the value in register B, placing the result in register ' + optParam}]; break;
          case 'orr':
            contents = [{ value: '**Logical OR [ALU]**'}, { value: '`'+optParam+' = B | C`  \nPerforms a logical OR on the values in register B and C, placing the result in register ' + optParam}]; break;
          case 'eor':
            contents = [{ value: '**Logical XOR [ALU]**'}, { value: '`'+optParam+' = B ^ C`  \nPerforms a logical exclusive or on the values in register B and C, placing the result in register ' + optParam}]; break;
          case 'rol':
            contents = [{ value: '**Bitwise Circular Shift Left [ALU]**'}, { value: '`'+optParam+' = <<B`  \nPerforms a bitwise circular shift left on the value in register B, placing the result in register ' + optParam}]; break;
          default:
            return null;
        }
        return {
          range: new monaco.Range(position.lineNumber, 1, position.lineNumber, aluMatch[0].length + 1),
          contents
        } as monaco.languages.Hover;
      }

      // MOV match
      const movMatch = line.match(/^(?:[a-z]+:)?[ \t]+(mov) ([a-d]),([a-d])/i);
      if (movMatch && movMatch[1] && movMatch[2])
      {
        let from = movMatch[3].toUpperCase();
        let to = movMatch[2].toUpperCase();
        contents = [{ value: '**8-bit Move [MOV8]**'}, { value: '`'+to+' = '+ from +'`  \nCopies the value in register ' + from + ' to register ' + to}];
        return {
          range: new monaco.Range(position.lineNumber, 1, position.lineNumber, movMatch[0].length + 1),
          contents
        } as monaco.languages.Hover;
      }

      // SETAB match
      const setMatch = line.match(/^(?:[a-z]+:)?[ \t]+(ldi) ([ab]),([01]+b|0x[0-9a-f]+|-?[0-9]+)/i)
      if (setMatch && setMatch[1] && setMatch[2])
      {
        let val = setMatch[3];
        let to = setMatch[2].toUpperCase();
        contents = [{ value: '**Load Immediate [SETAB]**'}, { value: '`'+to+' = '+ val +'`  \nLoads a value of ' + val + ' in to register ' + to}];
        return {
          range: new monaco.Range(position.lineNumber, 1, position.lineNumber, setMatch[0].length + 1),
          contents
        } as monaco.languages.Hover;
      }

      // GOTO match
      const gotoMatch = line.match(/^(?:[a-z]+:)?[ \t]+(bnz|jmp) ([a-z]+)/i);
      if (gotoMatch && gotoMatch[1] && gotoMatch[2]) {
          let label = gotoMatch[2];
          switch (gotoMatch[1].toLowerCase()) {
            case 'bnz':
              contents = [{ value: '**Branch if Not Zero [GOTO]**'}, { value: 'Branches to the line labeled _' + label + '_ if the last ALU result was non-zero'}]; break;
            case 'jmp':
              contents = [{ value: '**Unconditional Jump [GOTO]**'}, { value: 'Unconditionally jumps to the line labeled _' + label + '_'}]; break;
            default:
              return null;
          }
          return {
            range: new monaco.Range(position.lineNumber, 1, position.lineNumber, gotoMatch[0].length + 1),
            contents
          } as monaco.languages.Hover;
      }
    
      return null;
    }
  });
}


const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad
};

@NgModule({
  declarations: [ EditorComponent ],
  imports:      [
      BrowserModule,
      FormsModule,
      MonacoEditorModule.forRoot(monacoConfig) ],
  exports:      [ EditorComponent ]
})
export class EditorModule { }
