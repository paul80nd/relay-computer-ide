"use strict";/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.44.0(0528bcdfa41725e806ab6b214d284b49ef87231d)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/rcasm/rcasm", ["require","require"],(require)=>{
var moduleExports=(()=>{var o=Object.defineProperty;var a=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var l=(r,e)=>{for(var n in e)o(r,n,{get:e[n],enumerable:!0})},m=(r,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of i(e))!g.call(r,t)&&t!==n&&o(r,t,{get:()=>e[t],enumerable:!(s=a(e,t))||s.enumerable});return r};var d=r=>m(o({},"__esModule",{value:!0}),r);var u={};l(u,{conf:()=>c,language:()=>b});var c={comments:{lineComment:";"}},b={defaultToken:"",ignoreCase:!0,tokenPostfix:".rcasm",keywords:["add","inc","and","orr","eor","not","rol","cmp","mov","clr","ldi","lds","ldr","str","ixy","hlt","hlr","opc","jmp","jsr","rts","bne","beq","bcs","bmi","blt","ble","org","dfb","dfw","dff"],registers:["a","b","c","d","j","j1","j2","m","m1","m2","x","y","xy"],symbols:/[\.,\:]+/,tokenizer:{root:[[/[.a-zA-Z_]\w*/,{cases:{this:"variable.predefined","@keywords":{token:"keyword.$0"},"@registers":"type.register","@default":""}}],[/[ \t\r\n]+/,""],[/;.*$/,"comment"],[/@symbols/,"delimiter"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/[0-1]+b/,"number.binary"],[/[+-]?[0-9]+d?/,"number"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/"/,{token:"string.quote",bracket:"@open",next:"@string"}]],string:[[/[^\\"]+/,"string"],[/"/,{token:"string.quote",bracket:"@close",next:"@pop"}]]}};return d(u);})();
return moduleExports;
});
