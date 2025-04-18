import '../../editor/editor.api.js';
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(10517d799fb613d069ab531d3b2dd4304c2dd40a)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
import * as monaco_editor_core_star from "../../editor/editor.api.js";

// src/language/rcasm/monaco.contribution.ts
var LanguageServiceDefaultsImpl = class {
  constructor(languageId, modeConfiguration) {
    this._onDidChange = new monaco_editor_core_exports.Emitter();
    this._languageId = languageId;
    this.setModeConfiguration(modeConfiguration);
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  get languageId() {
    return this._languageId;
  }
  get modeConfiguration() {
    return this._modeConfiguration;
  }
  setModeConfiguration(modeConfiguration) {
    this._modeConfiguration = modeConfiguration || /* @__PURE__ */ Object.create(null);
    this._onDidChange.fire(this);
  }
};
var modeConfigurationDefault = {
  completionItems: true,
  hovers: true,
  documentSymbols: true,
  definitions: true,
  references: true,
  documentHighlights: true,
  rename: true,
  foldingRanges: true,
  diagnostics: true
};
var rcasmDefaults = new LanguageServiceDefaultsImpl(
  "rcasm",
  modeConfigurationDefault
);
monaco_editor_core_exports.languages.rcasm = { rcasmDefaults };
function getMode() {
  if (false) {
    return new Promise((resolve, reject) => {
      __require(["vs/language/rcasm/rcasmMode"], resolve, reject);
    });
  } else {
    return import("./rcasmMode.js");
  }
}
monaco_editor_core_exports.languages.onLanguage("rcasm", () => {
  getMode().then((mode) => mode.setupMode(rcasmDefaults));
});
export {
  rcasmDefaults
};
