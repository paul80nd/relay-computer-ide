/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(cfceb029dc52d8f5a1d29e141c56ebdee3479b85)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcasm/rcasm", ["require","require"],(require)=>{
"use strict";var moduleExports=(()=>{var n=Object.defineProperty;var a=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var l=(r,e)=>{for(var o in e)n(r,o,{get:e[o],enumerable:!0})},m=(r,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of i(e))!g.call(r,t)&&t!==o&&n(r,t,{get:()=>e[t],enumerable:!(s=a(e,t))||s.enumerable});return r};var c=r=>m(n({},"__esModule",{value:!0}),r);var u={};l(u,{conf:()=>d,language:()=>b});var d={comments:{lineComment:";"}},b={defaultToken:"",ignoreCase:!0,tokenPostfix:".rcasm",keywords:["add","and","bcs","beq","ble","blt","bmi","bne","clr","cmp","eor","hlr","hlt","inc","ixy","jmp","jsr","rts","ldi","ldr","lds","mov","not","opc","org","orr","rol","str"],registers:["a","b","c","d","j","j1","j2","m","m1","m2","x","y","xy"],operators:["+","-"],symbols:/[=><!~?:&|+\-*\/\^%]+/,tokenizer:{root:[[/[a-z_]*:/,"type.identifier"],[/\![a-z]+/,"keyword.directive"],[/[a-z]\w*/,{cases:{"@keywords":"keyword","@registers":"type.register","@default":"identifier"}}],[/[ \t\r\n]+/,""],[/;.*$/,"comment"],[/[{}]/,"@brackets"],[/[,§]/,"delimiter"],[/@symbols/,{cases:{"@operators":"operator","@default":""}}],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/[0-1]+b/,"number.binary"],[/[0-9]+d?/,"number"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/"/,{token:"string.quote",bracket:"@open",next:"@string"}]],string:[[/[^\\"]+/,"string"],[/"/,{token:"string.quote",bracket:"@close",next:"@pop"}]]}};return c(u);})();
return moduleExports;
});
