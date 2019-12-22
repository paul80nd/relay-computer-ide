import { Component, OnInit } from '@angular/core';
import { EditorComponent, ILineError } from './components/editor/editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent  {

  public assemble(editor: EditorComponent) {

    editor.clearErrors();

    // Phase 1: Lex
    var lexList = editor.code.split('\n').map((v, i) => this.stringToLex(v,i));
    var lexErrors = lexList.filter(l => l.error);
    if (lexErrors.length) {
      var errors : ILineError[] = lexErrors.map(le => ({ line: le.line, error: le.error }));
      editor.setErrors(errors);
      return;
    }


      alert(lexList.filter(v => v.isOfInterest).map(v => v.line + ' | ' + v.mnemonic + '|' + v.parameters + '|' + v.label + '|' + v.comment + '>' + v.error).join('\n'));

  }

  private stringToLex(text: string, index: number) : ILexedLine {

    var result : ILexedLine = {
      isOfInterest: false,
      line: index+1,      
      comment: null,
      error: null,
      mnemonic: null,
      label: null,
      parameters: null
    }

    // Trim whitespace
    text = text.trim();

    // Ignore empty lines
    if (text.length == 0) return result;

    // Comment lines begin with ; and whole line is a comment
    if (text[0] == ';')
    {
      result.comment = text.slice(1);
      return result;
    }

    // We're now interested
    result.isOfInterest = true;

    // Match off [label:] mnemonic [argument] [;comment]
    // Label: (?:([a-z]+):[ \t]*)
    // Mnemonic: ([a-z]{3})
    // Argument: ([a-z,0-9]*)
    // Comment: (?:;[ \t]*(.*))
    const match = text.match(/^(?:([a-z]+):[ \t]*)?([a-z]{3})(?:[ \t]+([a-z,0-9]*)?[ \t]*(?:;[ \t]*(.*))?)?$/i);
    if (!match || !match[2])
    {
      result.error = "Incorrect format - use [label:] mnemonic [argument] [;comment]";
      return result;
    }
    result.label = match[1];
    result.mnemonic = match[2];
    result.parameters = match[3];
    result.comment = match[4];

    return result;
  }

}



interface ILexedLine {
    isOfInterest: boolean;
    line: number;
    comment: string;
    error: string;
    mnemonic: string;
    label: string;
    parameters: string;
}

