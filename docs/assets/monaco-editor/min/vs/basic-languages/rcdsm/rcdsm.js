/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(10517d799fb613d069ab531d3b2dd4304c2dd40a)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcdsm/rcdsm", ["require","require"],(require)=>{
"use strict";var moduleExports=(()=>{var r=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var s=(o,e)=>{for(var a in e)r(o,a,{get:e[a],enumerable:!0})},u=(o,e,a,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of i(e))!l.call(o,n)&&n!==a&&r(o,n,{get:()=>e[n],enumerable:!(t=g(e,n))||t.enumerable});return o};var c=o=>u(r({},"__esModule",{value:!0}),o);var d={};s(d,{conf:()=>f,language:()=>m});var f={},m={defaultToken:"",ignoreCase:!1,tokenPostfix:".rcdsm",tokenizer:{root:[[/🔸.*$/,"invalid"],[/❌.*/,"invalid"],[/[ \t\r\n]+/,""],[/[0-9A-F]{4}:/,"number.hex"],[/[0-9A-F]{2}/,"keyword"],[/.*/,"comment"]]}};return c(d);})();
return moduleExports;
});
