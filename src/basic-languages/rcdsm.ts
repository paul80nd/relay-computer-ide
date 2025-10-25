import type { languages } from 'monaco-editor';

export const conf = <languages.LanguageConfiguration>{};

export const language = <languages.IMonarchLanguage>{
  defaultToken: '',
  ignoreCase: false,
  tokenPostfix: '.rcdsm',

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // Compile outcome
      [/🔸.*$/, 'invalid'],
      [/❌.*/, 'invalid'],

      // whitespace
      [/[ \t\r\n]+/, ''],

      // Address (four hex chars)
      [/[0-9A-F]{4}:/, 'number.hex'],

      // Instruction (two hex chars)
      [/[0-9A-F]{2}/, 'keyword'],

      // Otherwise a comment
      [/.*/, 'comment']
    ]
  }
};
