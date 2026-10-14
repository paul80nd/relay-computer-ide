// Inspired by: https://github.com/microsoft/monaco-languages/blob/master/src/mips/mips.ts
import type { languages } from 'monaco-editor';

export const conf = {
  comments: {
    lineComment: ';'
  },
  brackets: [
    ['{', '}'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '(', close: ')' },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string'] }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '(', close: ')' }
  ],
  wordPattern: /(-?\d*\.\d\w*)|([a-zA-Z_][\w]*)/
  //    "wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
} as languages.LanguageConfiguration;

export const language = {
  defaultToken: '',
  ignoreCase: true,
  tokenPostfix: '.rcasm',

  keywords: [
    'add',
    'and',
    'bcs',
    'beq',
    'ble',
    'blt',
    'bmi',
    'bne',
    'clr',
    'cmp',
    'eor',
    'hlr',
    'hlt',
    'inc',
    'ixy',
    'jmp',
    'jsr',
    'rts',
    'ldi',
    'ldr',
    'lds',
    'mov',
    'not',
    'opc',
    'org',
    'orr',
    'rol',
    'str'
  ],

  registers: ['a', 'b', 'c', 'd', 'j', 'j1', 'j2', 'm', 'm1', 'm2', 'x', 'y', 'xy'],

  operators: ['=', '+', '-', '*', '/', '%'],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // macro calls (+name(, +scope::name( or +::scope::name() and the name in a
      // macro definition. Calls must precede the label rule, which would
      // otherwise claim the 'scope:' of a scope-qualified call.
      [/\+(::)?[a-z_]\w*(::[a-z_]\w*)*(?=\s*\()/, 'keyword.macro'],
      [/(!macro)(\s+)([a-z_]\w*)/, ['keyword.directive', '', 'keyword.macro']],

      // identifiers and keywords. A label is a name followed by a single colon;
      // a double colon is a scope-qualified reference (e.g. outer::inner).
      [/[a-z_]\w*:(?!:)/, 'type.identifier'],
      [/![a-z]+/, 'keyword.directive'],
      [
        /[a-z]\w*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@registers': 'type.register',
            '@default': 'identifier'
          }
        }
      ],

      // whitespace
      [/[ \t\r\n]+/, ''],

      // IDE/emulator directives (e.g. ;@watch). Must precede the generic comment
      // rule so the whole line is tokenised as a meta-annotation, not a comment.
      [/;\s*@\w+.*$/, 'annotation'],

      // Comments
      [/;.*$/, 'comment'],

      // delimiters and operators
      [/[{}()]/, '@brackets'],
      [/[,§]/, 'delimiter'],
      [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],

      // numbers
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/[0-1]+b/, 'number.binary'],
      [/[0-9]+d?/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }]
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ]
  }
} as languages.IMonarchLanguage;
