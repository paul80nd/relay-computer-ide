import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { EditorComponent } from './editor.component';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { debug, log } from 'util';

interface MonarchLanguageConfiguration extends monaco.languages.IMonarchLanguage {
  keywords: string[];
}
interface MonarchLanguageCompletionItemProvider extends monaco.languages.CompletionItemProvider {
  completionMnemonics: any;
}

export function onMonacoLoad() {

  monaco.languages.register({ id: 'rcasm' });

  monaco.languages.setMonarchTokensProvider('rcasm', {
    ignoreCase: true,
    keywords: [
      'add', 'and', 'clr', 'inc', 'mov', 'not', 'ldi', 'orr', 'eor', 'rol'
    ],
    types: [
      'a', 'b', 'c', 'd'
    ],
    tokenizer: {        
      root: [
        // Identifiers and keywords
        [/^[a-z]{3}/, {cases:{'@keywords':'keyword'}}],
        [/[a-d]/, {cases:{'@types':'type'}}],

        // Whitespace
        { include: '@whitespace'},

        // Numbers
        [/[01]+b/,'number'],
        [/0[xX][0-9a-fA-F]+/,'number'],
        [/-?\d+/,'number']
      ],
      whitespace: [
        [/[\t\r\n]+/,'white'],
        [/;.*$/, 'comment'],
      ],
    },
  } as MonarchLanguageConfiguration);

  monaco.languages.registerCompletionItemProvider('rcasm', {
    completionMnemonics:[
      { label: 'add', detail: 'ALU', insertText: 'add', documentation: 'Arithmetic add (b + c) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                   
      { label: 'and', detail: 'ALU', insertText: 'and', documentation: 'Binary AND (b & c) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                           
      { label: 'clr', detail: 'ALU', insertText: 'clr', documentation: 'Clear register a via an ALU NO-OP (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                           
      { label: 'inc', detail: 'ALU', insertText: 'inc', documentation: 'Arithmetic increment (b + 1) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                   
      { label: 'not', detail: 'ALU', insertText: 'not', documentation: 'Binary NOT (~b) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                           
      { label: 'orr', detail: 'ALU', insertText: 'orr', documentation: 'Binary OR (b | c) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },                           
      { label: 'eor', detail: 'ALU', insertText: 'eor', documentation: 'Binary exlusive OR (b ^ c) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },   
      { label: 'rol', detail: 'ALU', insertText: 'rol', documentation: 'Bitwise circular shift left (<<b) to register a (or to register d if specified).', kind: monaco.languages.CompletionItemKind.Function },
      { label: 'ldi', detail: 'SETAB', insertText: 'ldi ${1:a},${2:0}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, 
                      documentation: 'Load immediate value to register a or b.', kind: monaco.languages.CompletionItemKind.Function },                      
      { label: 'mov', detail: 'MOVE8', insertText: 'mov ${1:b},${2:a}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, 
                      documentation: 'Copy 8-bit value from register to register.', kind: monaco.languages.CompletionItemKind.Function }
    ],
    provideCompletionItems: function(model, position) {
      // Provide mnemonic completions at start of line only
      if (position.column !== 2) return { suggestions: [] };
      return { suggestions:  this.completionMnemonics };
    }
  } as MonarchLanguageCompletionItemProvider);
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
