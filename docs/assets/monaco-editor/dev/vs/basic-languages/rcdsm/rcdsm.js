/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(cfceb029dc52d8f5a1d29e141c56ebdee3479b85)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcdsm/rcdsm", ["require"],(require)=>{
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

  // src/basic-languages/rcdsm/rcdsm.ts
  var rcdsm_exports = {};
  __export(rcdsm_exports, {
    conf: () => conf,
    language: () => language
  });
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
  return __toCommonJS(rcdsm_exports);
})();
return moduleExports;
});
