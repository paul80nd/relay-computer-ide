/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(436bf1645b47d9c71cf59af7751deb82d8caa0c2)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcdsm/rcdsm", ["require","require"],(require)=>{
var moduleExports=(()=>{var r=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var s=o=>r(o,"__esModule",{value:!0});var u=(o,e)=>{for(var n in e)r(o,n,{get:e[n],enumerable:!0})},c=(o,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of i(e))!l.call(o,a)&&(n||a!=="default")&&r(o,a,{get:()=>e[a],enumerable:!(t=g(e,a))||t.enumerable});return o};var f=(o=>(e,n)=>o&&o.get(e)||(n=c(s({}),e,1),o&&o.set(e,n),n))(typeof WeakMap!="undefined"?new WeakMap:0);var k={};u(k,{conf:()=>m,language:()=>d});var m={},d={defaultToken:"",ignoreCase:!1,tokenPostfix:".rcdsm",tokenizer:{root:[[/🔸.*$/,"invalid"],[/❌.*/,"invalid"],[/[ \t\r\n]+/,""],[/[0-9A-F]{4}:/,"number.hex"],[/[0-9A-F]{2}/,"keyword"],[/.*/,"comment"]]}};return f(k);})();
return moduleExports;
});
