/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(10517d799fb613d069ab531d3b2dd4304c2dd40a)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/rcdsm/rcdsm.ts
var conf = {};
var language = {
  defaultToken: "",
  ignoreCase: false,
  tokenPostfix: ".rcdsm",
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // Compile outcome
      [/🔸.*$/, "invalid"],
      [/❌.*/, "invalid"],
      // whitespace
      [/[ \t\r\n]+/, ""],
      // Address (four hex chars)
      [/[0-9A-F]{4}:/, "number.hex"],
      // Instruction (two hex chars)
      [/[0-9A-F]{2}/, "keyword"],
      // Otherwise a comment
      [/.*/, "comment"]
    ]
  }
};
export {
  conf,
  language
};
