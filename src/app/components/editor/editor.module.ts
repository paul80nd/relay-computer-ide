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
interface MonarchLanguageSignatureHelpProvider extends monaco.languages.SignatureHelpProvider {
  signatures: any;
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

  monaco.languages.registerSignatureHelpProvider('rcasm', {
    signatureHelpTriggerCharacters: [' '],
   signatures: {
     'add': [{label: 'add dest', documentation: 'Arithmetic add (dest = b + c)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],
     'and': [{label: 'and dest', documentation: 'Binary AND (dest = b & c)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                          
     'clr': [{label: 'clr dest', documentation: 'Clear (dest = 0)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                          
     'inc': [{label: 'inc dest', documentation: 'Arithmetic increment (dest = b + 1)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                           
     'ldi': [{label: 'ldi dest,value', documentation: 'Load immediate value in to dest register',
       parameters: [{label: 'dest', documentation: 'Destination register (a|b)'},
               {label: 'value', documentation: '5-bit sign extended value (-16 to 15)'}]}],
     'mov': [{label: 'mov dest,src', documentation: 'Copy 8-bit value from src to dest register',
       parameters: [{label: 'dest', documentation: 'Destination register (a|b|c|d)'},
               {label: 'src', documentation: 'Source register (a|b|c|d)'}]}],
     'not': [{label: 'not dest', documentation: 'Binary NOT (dest = ~b)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                           
     'orr': [{label: 'orr dest', documentation: 'Binary OR (dest = b | c)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                           
     'eor': [{label: 'eor dest', documentation: 'Binary exclusive OR (dest = b ^ c)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                           
     'rol': [{label: 'rol dest', documentation: 'Bitwise circular shift left (dest = <<b)',
       parameters: [{label: 'dest', documentation: 'Destination register (a|d)'}]}],                           
   },
    provideSignatureHelp: function(model, position, token) : monaco.languages.ProviderResult<monaco.languages.SignatureHelpResult> {
     // Signature help only following mnemonic
     if (position.column < 5) return null;
     var textUntilPosition = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
     var match = textUntilPosition.match(/^([a-z]{3}) (?:([a-z0-9]*)(,([a-z0-9]*))?)?$/i)
     if (match && match[1]) {
       // Get signature
       let mnemonic = match[1].toLowerCase();
       let signatures = this.signatures[mnemonic];
       let atParam = match[3] ? 1 : 0;
       // Filter signatures
       return {
         value: {
          activeParameter: atParam,
          activeSignature: 0,
          signatures: signatures.filter(function(s) { return s.parameters.length > atParam })
         }
       } as monaco.languages.SignatureHelpResult
     }
     return null;
    }  
 } as MonarchLanguageSignatureHelpProvider);

  monaco.languages.registerHoverProvider('rcasm', {
    provideHover: function(model, position, token) : monaco.languages.ProviderResult<monaco.languages.Hover> {         
      var line = model.getLineContent(position.lineNumber);
      var match = line.match(/^([a-z]{3})(?: ([a-d])(?:,([a-d]|[01]+b|0x[0-9a-f]+|-?[0-9]+))?)?/i) 
      if (match) {
        if(match[1]) {            
          var contents : monaco.IMarkdownString[];
          switch (match[1].toLowerCase()) {
            case 'add':
              contents = [{ value: '**ALU Add (b+c)**'}, { value: 'Adds the values in register b and c, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'and':
              contents = [{ value:'**ALU Binary And (b&c)**'}, { value:'Performs a binary AND on the values in register b and c, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'clr':
              contents = [{ value:'**ALU Clear**'}, { value:'Performs a ALU clear by placing the result of a no-op in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'inc':
              contents = [{ value:'**ALU Increment (b+1)**'}, { value:'Increments the value in register b, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'ldi':
              if (!match[2] || !match[3]) { return null; }
              contents = [{ value:'**Load Immediate**'},{ value:'Loads a value of '+match[3]+' in to register '+match[2]}]; break;
            case 'mov':
              if (!match[2] || !match[3]) { return null; }
              contents = [{ value:'**8-bit Move**'}, { value:'Copies the value in register '+match[3]+' to register '+match[2]}]; break;
            case 'not':
              contents = [{ value:'**ALU Binary Not (~b)**'}, { value:'Performs a binary NOT on the value in register b, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'orr':
              contents = [{ value:'**ALU Binary Or (b|c)**'}, { value:'Performs a binary OR on the values in register b and c, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'eor':
              contents = [{ value:'**ALU Binary Exclusive Or (b^c)**'}, { value:'Performs a binary exclusive or on the values in register b and c, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            case 'rol':
              contents = [{ value:'**ALU Bitwise Circular Shift Left (<<b)**'}, { value:'Performs a bitwise circular shift left on the value in register b, placing the result in register '+(match[2] ? match[2]:'a')}]; break;                       
            default:
              return null;
          }
          return {
            range: new monaco.Range(position.lineNumber, 1, position.lineNumber, match[0].length+1),
            contents: contents
          } as monaco.languages.Hover
        }
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
