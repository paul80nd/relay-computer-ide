/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(10517d799fb613d069ab531d3b2dd4304c2dd40a)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/rcasm/rcasm.ts
var conf = {
  comments: {
    lineComment: ";"
  }
};
var language = {
  defaultToken: "",
  ignoreCase: true,
  tokenPostfix: ".rcasm",
  keywords: [
    "add",
    "and",
    "bcs",
    "beq",
    "ble",
    "blt",
    "bmi",
    "bne",
    "clr",
    "cmp",
    "eor",
    "hlr",
    "hlt",
    "inc",
    "ixy",
    "jmp",
    "jsr",
    "rts",
    "ldi",
    "ldr",
    "lds",
    "mov",
    "not",
    "opc",
    "org",
    "orr",
    "rol",
    "str"
  ],
  registers: ["a", "b", "c", "d", "j", "j1", "j2", "m", "m1", "m2", "x", "y", "xy"],
  operators: ["=", "+", "-", "*", "/", "%"],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_]*:/, "type.identifier"],
      [/\![a-z]+/, "keyword.directive"],
      [
        /[a-z]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@registers": "type.register",
            "@default": "identifier"
          }
        }
      ],
      // whitespace
      [/[ \t\r\n]+/, ""],
      // Comments
      [/;.*$/, "comment"],
      // delimiters and operators
      [/[{}()]/, "@brackets"],
      [/[,§]/, "delimiter"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      // numbers
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/[0-1]+b/, "number.binary"],
      [/[0-9]+d?/, "number"],
      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ]
  }
};
export {
  conf,
  language
};
