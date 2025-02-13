/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(cfceb029dc52d8f5a1d29e141c56ebdee3479b85)
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
