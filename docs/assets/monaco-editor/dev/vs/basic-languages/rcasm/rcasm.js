/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(cfceb029dc52d8f5a1d29e141c56ebdee3479b85)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcasm/rcasm", ["require"],(require)=>{
"use strict";
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/basic-languages/rcasm/rcasm.ts
  var rcasm_exports = {};
  __export(rcasm_exports, {
    conf: () => conf,
    language: () => language
  });
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
    operators: ["+", "-"],
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
        [/[{}]/, "@brackets"],
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
  return __toCommonJS(rcasm_exports);
})();
return moduleExports;
});
