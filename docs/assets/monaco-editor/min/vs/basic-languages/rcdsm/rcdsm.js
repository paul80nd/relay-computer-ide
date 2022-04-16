/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(7b8264ffaa34c598ef7d644f48f7059e9d29f9e5)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcdsm/rcdsm", ["require","require"],(require)=>{
var moduleExports=(()=>{var r=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var s=Object.getOwnPropertyNames;var u=Object.prototype.hasOwnProperty;var c=o=>r(o,"__esModule",{value:!0});var i=(o,e)=>{for(var n in e)r(o,n,{get:e[n],enumerable:!0})},l=(o,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of s(e))!u.call(o,a)&&(n||a!=="default")&&r(o,a,{get:()=>e[a],enumerable:!(t=g(e,a))||t.enumerable});return o};var f=(o=>(e,n)=>o&&o.get(e)||(n=l(c({}),e,1),o&&o.set(e,n),n))(typeof WeakMap!="undefined"?new WeakMap:0);var k={};i(k,{conf:()=>m,language:()=>d});var m={},d={defaultToken:"",ignoreCase:!1,tokenPostfix:".rcdsm",tokenizer:{root:[[/[ \t\r\n]+/,""],[/[0-9A-F]{4}:/,"number.hex"],[/[0-9A-F]{2}/,"keyword"],[/.*/,"comment"]]}};return f(k);})();
return moduleExports;
});
