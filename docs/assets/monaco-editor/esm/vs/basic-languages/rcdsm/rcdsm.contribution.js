/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(10517d799fb613d069ab531d3b2dd4304c2dd40a)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/rcdsm/rcdsm.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "rcdsm",
  extensions: [".rcdsm"],
  aliases: ["RCDSM"],
  mimetypes: ["text/x-rcdsm", "text/rcdsm", "text/plaintext"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/rcdsm/rcdsm"], resolve, reject);
      });
    } else {
      return import("./rcdsm.js");
    }
  }
});
