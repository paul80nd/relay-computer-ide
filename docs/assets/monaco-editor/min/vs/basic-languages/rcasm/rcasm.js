/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(7b8264ffaa34c598ef7d644f48f7059e9d29f9e5)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcasm/rcasm", ["require","require"],(require)=>{
var moduleExports=(()=>{var t=Object.defineProperty;var a=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var i=Object.prototype.hasOwnProperty;var l=r=>t(r,"__esModule",{value:!0});var d=(r,e)=>{for(var o in e)t(r,o,{get:e[o],enumerable:!0})},g=(r,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of m(e))!i.call(r,n)&&(o||n!=="default")&&t(r,n,{get:()=>e[n],enumerable:!(s=a(e,n))||s.enumerable});return r};var c=(r=>(e,o)=>r&&r.get(e)||(o=g(l({}),e,1),r&&r.set(e,o),o))(typeof WeakMap!="undefined"?new WeakMap:0);var y={};d(y,{conf:()=>b,language:()=>u});var b={comments:{lineComment:";"}},u={defaultToken:"",ignoreCase:!0,tokenPostfix:".rcasm",keywords:["add","inc","ixy","and","orr","eor","not","rol","cmp","mov","clr","ldi","lds","ldr","str","hlt","hlr","opc","jmp","jsr","rts","bne","beq","bcs","bmi","blt","ble"],registers:["a","b","c","d","j","j1","j2","m","m1","m2","x","y","xy"],symbols:/[\.,\:]+/,tokenizer:{root:[[/[.a-zA-Z_]\w*/,{cases:{this:"variable.predefined","@keywords":{token:"keyword.$0"},"@registers":"type.register","@default":""}}],[/[ \t\r\n]+/,""],[/;.*$/,"comment"],[/@symbols/,"delimiter"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/[0-1]+b/,"number.binary"],[/[+-]?[0-9]+d?/,"number"]]}};return c(y);})();
return moduleExports;
});
