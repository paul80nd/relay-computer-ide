/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(cfceb029dc52d8f5a1d29e141c56ebdee3479b85)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/ast.js
var ast_exports = {};
__export(ast_exports, {
  DataSize: () => DataSize,
  mkAlign: () => mkAlign,
  mkAsmLine: () => mkAsmLine,
  mkBinaryOp: () => mkBinaryOp,
  mkData: () => mkData,
  mkFill: () => mkFill,
  mkGetCurPC: () => mkGetCurPC,
  mkInsn: () => mkInsn,
  mkLabel: () => mkLabel,
  mkLiteral: () => mkLiteral,
  mkProgram: () => mkProgram,
  mkRegister: () => mkRegister,
  mkScopeQualifiedIdent: () => mkScopeQualifiedIdent,
  mkSetPC: () => mkSetPC
});
function mkProgram(lines, loc) {
  return { lines, loc };
}
function mkAsmLine(label, stmt, scopedStmts, loc) {
  return { label, stmt, scopedStmts, loc };
}
function mkLabel(name, loc) {
  return { name, loc };
}
function mkSetPC(pc, loc) {
  return { type: "setpc", pc, loc };
}
function mkGetCurPC(loc) {
  return {
    type: "getcurpc",
    loc
  };
}
function mkInsn(mnemonic, p1, p2, loc) {
  return { type: "insn", mnemonic, p1, p2, loc };
}
function mkData(dataSize, values2, loc) {
  return {
    type: "data",
    values: values2,
    dataSize,
    loc
  };
}
function mkFill(numBytes, fillValue, loc) {
  return { type: "fill", numBytes, fillValue, loc };
}
function mkAlign(alignBytes, loc) {
  return { type: "align", alignBytes, loc };
}
function mkLiteral(lit, ot, loc) {
  return { type: "literal", lit, ot, loc };
}
function mkRegister(value, loc) {
  return { type: "register", value, loc };
}
function mkScopeQualifiedIdent(path, absolute, loc) {
  return { type: "qualified-ident", path, absolute, loc };
}
function mkBinaryOp(op, left, right, loc) {
  return { type: "binary", op, left, right, loc };
}
var DataSize;
var init_ast = __esm({
  "../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/ast.js"() {
    (function(DataSize2) {
      DataSize2[DataSize2["Byte"] = 0] = "Byte";
      DataSize2[DataSize2["Word"] = 1] = "Word";
    })(DataSize || (DataSize = {}));
  }
});

// ../rcasm-languageservice/node_modules/fastbitset/FastBitSet.js
var require_FastBitSet = __commonJS({
  "../rcasm-languageservice/node_modules/fastbitset/FastBitSet.js"(exports, module) {
    "use strict";
    function FastBitSet2(iterable) {
      this.words = [];
      if (iterable) {
        if (Symbol && Symbol.iterator && iterable[Symbol.iterator] !== void 0) {
          const iterator = iterable[Symbol.iterator]();
          let current = iterator.next();
          while (!current.done) {
            this.add(current.value);
            current = iterator.next();
          }
        } else {
          for (let i = 0; i < iterable.length; i++) {
            this.add(iterable[i]);
          }
        }
      }
    }
    FastBitSet2.fromWords = function(words) {
      const bitSet = Object.create(FastBitSet2.prototype);
      bitSet.words = words;
      return bitSet;
    };
    FastBitSet2.prototype.add = function(index) {
      this.resize(index);
      this.words[index >>> 5] |= 1 << index;
    };
    FastBitSet2.prototype.flip = function(index) {
      this.resize(index);
      this.words[index >>> 5] ^= 1 << index;
    };
    FastBitSet2.prototype.clear = function() {
      this.words.length = 0;
    };
    FastBitSet2.prototype.remove = function(index) {
      this.resize(index);
      this.words[index >>> 5] &= ~(1 << index);
    };
    FastBitSet2.prototype.isEmpty = function(index) {
      const c = this.words.length;
      for (let i = 0; i < c; i++) {
        if (this.words[i] !== 0)
          return false;
      }
      return true;
    };
    FastBitSet2.prototype.has = function(index) {
      return (this.words[index >>> 5] & 1 << index) !== 0;
    };
    FastBitSet2.prototype.checkedAdd = function(index) {
      this.resize(index);
      const word = this.words[index >>> 5];
      const newword = word | 1 << index;
      this.words[index >>> 5] = newword;
      return (newword ^ word) >>> index;
    };
    FastBitSet2.prototype.trim = function(index) {
      let nl = this.words.length;
      while (nl > 0 && this.words[nl - 1] === 0) {
        nl--;
      }
      this.words.length = nl;
    };
    FastBitSet2.prototype.resize = function(index) {
      const count = index + 32 >>> 5;
      for (let i = this.words.length; i < count; i++)
        this.words[i] = 0;
    };
    FastBitSet2.prototype.hammingWeight = function(v) {
      v -= v >>> 1 & 1431655765;
      v = (v & 858993459) + (v >>> 2 & 858993459);
      return (v + (v >>> 4) & 252645135) * 16843009 >>> 24;
    };
    FastBitSet2.prototype.hammingWeight4 = function(v1, v2, v3, v4) {
      v1 -= v1 >>> 1 & 1431655765;
      v2 -= v2 >>> 1 & 1431655765;
      v3 -= v3 >>> 1 & 1431655765;
      v4 -= v4 >>> 1 & 1431655765;
      v1 = (v1 & 858993459) + (v1 >>> 2 & 858993459);
      v2 = (v2 & 858993459) + (v2 >>> 2 & 858993459);
      v3 = (v3 & 858993459) + (v3 >>> 2 & 858993459);
      v4 = (v4 & 858993459) + (v4 >>> 2 & 858993459);
      v1 = v1 + (v1 >>> 4) & 252645135;
      v2 = v2 + (v2 >>> 4) & 252645135;
      v3 = v3 + (v3 >>> 4) & 252645135;
      v4 = v4 + (v4 >>> 4) & 252645135;
      return (v1 + v2 + v3 + v4) * 16843009 >>> 24;
    };
    FastBitSet2.prototype.size = function() {
      let answer = 0;
      const c = this.words.length;
      const w = this.words;
      for (let i = 0; i < c; i++) {
        answer += this.hammingWeight(w[i]);
      }
      return answer;
    };
    FastBitSet2.prototype.array = function() {
      const answer = new Array(this.size());
      let pos = 0 | 0;
      const c = this.words.length;
      for (let k = 0; k < c; ++k) {
        let w = this.words[k];
        while (w != 0) {
          const t = w & -w;
          answer[pos++] = (k << 5) + this.hammingWeight(t - 1 | 0);
          w ^= t;
        }
      }
      return answer;
    };
    FastBitSet2.prototype.forEach = function(fnc) {
      const c = this.words.length;
      for (let k = 0; k < c; ++k) {
        let w = this.words[k];
        while (w != 0) {
          const t = w & -w;
          fnc((k << 5) + this.hammingWeight(t - 1 | 0));
          w ^= t;
        }
      }
    };
    FastBitSet2.prototype[Symbol.iterator] = function() {
      const c = this.words.length;
      let k = 0;
      let w = this.words[k];
      let hw = this.hammingWeight;
      let words = this.words;
      return {
        [Symbol.iterator]() {
          return this;
        },
        next() {
          while (k < c) {
            if (w !== 0) {
              const t = w & -w;
              const value = (k << 5) + hw(t - 1 | 0);
              w ^= t;
              return { done: false, value };
            } else {
              k++;
              if (k < c) {
                w = words[k];
              }
            }
          }
          return { done: true, value: void 0 };
        }
      };
    };
    FastBitSet2.prototype.clone = function() {
      const clone = Object.create(FastBitSet2.prototype);
      clone.words = this.words.slice();
      return clone;
    };
    FastBitSet2.prototype.intersects = function(otherbitmap) {
      const newcount = Math.min(this.words.length, otherbitmap.words.length);
      for (let k = 0 | 0; k < newcount; ++k) {
        if ((this.words[k] & otherbitmap.words[k]) !== 0)
          return true;
      }
      return false;
    };
    FastBitSet2.prototype.intersection = function(otherbitmap) {
      const newcount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0 | 0;
      for (; k + 7 < newcount; k += 8) {
        this.words[k] &= otherbitmap.words[k];
        this.words[k + 1] &= otherbitmap.words[k + 1];
        this.words[k + 2] &= otherbitmap.words[k + 2];
        this.words[k + 3] &= otherbitmap.words[k + 3];
        this.words[k + 4] &= otherbitmap.words[k + 4];
        this.words[k + 5] &= otherbitmap.words[k + 5];
        this.words[k + 6] &= otherbitmap.words[k + 6];
        this.words[k + 7] &= otherbitmap.words[k + 7];
      }
      for (; k < newcount; ++k) {
        this.words[k] &= otherbitmap.words[k];
      }
      const c = this.words.length;
      for (k = newcount; k < c; ++k) {
        this.words[k] = 0;
      }
      return this;
    };
    FastBitSet2.prototype.intersection_size = function(otherbitmap) {
      const newcount = Math.min(this.words.length, otherbitmap.words.length);
      let answer = 0 | 0;
      for (let k = 0 | 0; k < newcount; ++k) {
        answer += this.hammingWeight(this.words[k] & otherbitmap.words[k]);
      }
      return answer;
    };
    FastBitSet2.prototype.new_intersection = function(otherbitmap) {
      const answer = Object.create(FastBitSet2.prototype);
      const count = Math.min(this.words.length, otherbitmap.words.length);
      answer.words = new Array(count);
      let k = 0 | 0;
      for (; k + 7 < count; k += 8) {
        answer.words[k] = this.words[k] & otherbitmap.words[k];
        answer.words[k + 1] = this.words[k + 1] & otherbitmap.words[k + 1];
        answer.words[k + 2] = this.words[k + 2] & otherbitmap.words[k + 2];
        answer.words[k + 3] = this.words[k + 3] & otherbitmap.words[k + 3];
        answer.words[k + 4] = this.words[k + 4] & otherbitmap.words[k + 4];
        answer.words[k + 5] = this.words[k + 5] & otherbitmap.words[k + 5];
        answer.words[k + 6] = this.words[k + 6] & otherbitmap.words[k + 6];
        answer.words[k + 7] = this.words[k + 7] & otherbitmap.words[k + 7];
      }
      for (; k < count; ++k) {
        answer.words[k] = this.words[k] & otherbitmap.words[k];
      }
      return answer;
    };
    FastBitSet2.prototype.equals = function(otherbitmap) {
      const mcount = Math.min(this.words.length, otherbitmap.words.length);
      for (let k = 0 | 0; k < mcount; ++k) {
        if (this.words[k] != otherbitmap.words[k])
          return false;
      }
      if (this.words.length < otherbitmap.words.length) {
        const c = otherbitmap.words.length;
        for (let k = this.words.length; k < c; ++k) {
          if (otherbitmap.words[k] != 0)
            return false;
        }
      } else if (otherbitmap.words.length < this.words.length) {
        const c = this.words.length;
        for (let k = otherbitmap.words.length; k < c; ++k) {
          if (this.words[k] != 0)
            return false;
        }
      }
      return true;
    };
    FastBitSet2.prototype.difference = function(otherbitmap) {
      const newcount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0 | 0;
      for (; k + 7 < newcount; k += 8) {
        this.words[k] &= ~otherbitmap.words[k];
        this.words[k + 1] &= ~otherbitmap.words[k + 1];
        this.words[k + 2] &= ~otherbitmap.words[k + 2];
        this.words[k + 3] &= ~otherbitmap.words[k + 3];
        this.words[k + 4] &= ~otherbitmap.words[k + 4];
        this.words[k + 5] &= ~otherbitmap.words[k + 5];
        this.words[k + 6] &= ~otherbitmap.words[k + 6];
        this.words[k + 7] &= ~otherbitmap.words[k + 7];
      }
      for (; k < newcount; ++k) {
        this.words[k] &= ~otherbitmap.words[k];
      }
      return this;
    };
    FastBitSet2.prototype.new_difference = function(otherbitmap) {
      return this.clone().difference(otherbitmap);
    };
    FastBitSet2.prototype.difference2 = function(otherbitmap) {
      const mincount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0 | 0;
      for (; k + 7 < mincount; k += 8) {
        otherbitmap.words[k] = this.words[k] & ~otherbitmap.words[k];
        otherbitmap.words[k + 1] = this.words[k + 1] & ~otherbitmap.words[k + 1];
        otherbitmap.words[k + 2] = this.words[k + 2] & ~otherbitmap.words[k + 2];
        otherbitmap.words[k + 3] = this.words[k + 3] & ~otherbitmap.words[k + 3];
        otherbitmap.words[k + 4] = this.words[k + 4] & ~otherbitmap.words[k + 4];
        otherbitmap.words[k + 5] = this.words[k + 5] & ~otherbitmap.words[k + 5];
        otherbitmap.words[k + 6] = this.words[k + 6] & ~otherbitmap.words[k + 6];
        otherbitmap.words[k + 7] = this.words[k + 7] & ~otherbitmap.words[k + 7];
      }
      for (; k < mincount; ++k) {
        otherbitmap.words[k] = this.words[k] & ~otherbitmap.words[k];
      }
      for (k = this.words.length - 1; k >= mincount; --k) {
        otherbitmap.words[k] = this.words[k];
      }
      otherbitmap.words.length = this.words.length;
      return otherbitmap;
    };
    FastBitSet2.prototype.difference_size = function(otherbitmap) {
      const newcount = Math.min(this.words.length, otherbitmap.words.length);
      let answer = 0 | 0;
      let k = 0 | 0;
      for (; k < newcount; ++k) {
        answer += this.hammingWeight(this.words[k] & ~otherbitmap.words[k]);
      }
      const c = this.words.length;
      for (; k < c; ++k) {
        answer += this.hammingWeight(this.words[k]);
      }
      return answer;
    };
    FastBitSet2.prototype.change = function(otherbitmap) {
      const mincount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0 | 0;
      for (; k + 7 < mincount; k += 8) {
        this.words[k] ^= otherbitmap.words[k];
        this.words[k + 1] ^= otherbitmap.words[k + 1];
        this.words[k + 2] ^= otherbitmap.words[k + 2];
        this.words[k + 3] ^= otherbitmap.words[k + 3];
        this.words[k + 4] ^= otherbitmap.words[k + 4];
        this.words[k + 5] ^= otherbitmap.words[k + 5];
        this.words[k + 6] ^= otherbitmap.words[k + 6];
        this.words[k + 7] ^= otherbitmap.words[k + 7];
      }
      for (; k < mincount; ++k) {
        this.words[k] ^= otherbitmap.words[k];
      }
      for (k = otherbitmap.words.length - 1; k >= mincount; --k) {
        this.words[k] = otherbitmap.words[k];
      }
      return this;
    };
    FastBitSet2.prototype.new_change = function(otherbitmap) {
      const answer = Object.create(FastBitSet2.prototype);
      const count = Math.max(this.words.length, otherbitmap.words.length);
      answer.words = new Array(count);
      const mcount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0;
      for (; k + 7 < mcount; k += 8) {
        answer.words[k] = this.words[k] ^ otherbitmap.words[k];
        answer.words[k + 1] = this.words[k + 1] ^ otherbitmap.words[k + 1];
        answer.words[k + 2] = this.words[k + 2] ^ otherbitmap.words[k + 2];
        answer.words[k + 3] = this.words[k + 3] ^ otherbitmap.words[k + 3];
        answer.words[k + 4] = this.words[k + 4] ^ otherbitmap.words[k + 4];
        answer.words[k + 5] = this.words[k + 5] ^ otherbitmap.words[k + 5];
        answer.words[k + 6] = this.words[k + 6] ^ otherbitmap.words[k + 6];
        answer.words[k + 7] = this.words[k + 7] ^ otherbitmap.words[k + 7];
      }
      for (; k < mcount; ++k) {
        answer.words[k] = this.words[k] ^ otherbitmap.words[k];
      }
      const c = this.words.length;
      for (k = mcount; k < c; ++k) {
        answer.words[k] = this.words[k];
      }
      const c2 = otherbitmap.words.length;
      for (k = mcount; k < c2; ++k) {
        answer.words[k] = otherbitmap.words[k];
      }
      return answer;
    };
    FastBitSet2.prototype.change_size = function(otherbitmap) {
      const mincount = Math.min(this.words.length, otherbitmap.words.length);
      let answer = 0 | 0;
      let k = 0 | 0;
      for (; k < mincount; ++k) {
        answer += this.hammingWeight(this.words[k] ^ otherbitmap.words[k]);
      }
      const longer = this.words.length > otherbitmap.words.length ? this : otherbitmap;
      const c = longer.words.length;
      for (; k < c; ++k) {
        answer += this.hammingWeight(longer.words[k]);
      }
      return answer;
    };
    FastBitSet2.prototype.toString = function() {
      return "{" + this.array().join(",") + "}";
    };
    FastBitSet2.prototype.union = function(otherbitmap) {
      const mcount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0 | 0;
      for (; k + 7 < mcount; k += 8) {
        this.words[k] |= otherbitmap.words[k];
        this.words[k + 1] |= otherbitmap.words[k + 1];
        this.words[k + 2] |= otherbitmap.words[k + 2];
        this.words[k + 3] |= otherbitmap.words[k + 3];
        this.words[k + 4] |= otherbitmap.words[k + 4];
        this.words[k + 5] |= otherbitmap.words[k + 5];
        this.words[k + 6] |= otherbitmap.words[k + 6];
        this.words[k + 7] |= otherbitmap.words[k + 7];
      }
      for (; k < mcount; ++k) {
        this.words[k] |= otherbitmap.words[k];
      }
      if (this.words.length < otherbitmap.words.length) {
        this.resize((otherbitmap.words.length << 5) - 1);
        const c = otherbitmap.words.length;
        for (let k2 = mcount; k2 < c; ++k2) {
          this.words[k2] = otherbitmap.words[k2];
        }
      }
      return this;
    };
    FastBitSet2.prototype.new_union = function(otherbitmap) {
      const answer = Object.create(FastBitSet2.prototype);
      const count = Math.max(this.words.length, otherbitmap.words.length);
      answer.words = new Array(count);
      const mcount = Math.min(this.words.length, otherbitmap.words.length);
      let k = 0;
      for (; k + 7 < mcount; k += 8) {
        answer.words[k] = this.words[k] | otherbitmap.words[k];
        answer.words[k + 1] = this.words[k + 1] | otherbitmap.words[k + 1];
        answer.words[k + 2] = this.words[k + 2] | otherbitmap.words[k + 2];
        answer.words[k + 3] = this.words[k + 3] | otherbitmap.words[k + 3];
        answer.words[k + 4] = this.words[k + 4] | otherbitmap.words[k + 4];
        answer.words[k + 5] = this.words[k + 5] | otherbitmap.words[k + 5];
        answer.words[k + 6] = this.words[k + 6] | otherbitmap.words[k + 6];
        answer.words[k + 7] = this.words[k + 7] | otherbitmap.words[k + 7];
      }
      for (; k < mcount; ++k) {
        answer.words[k] = this.words[k] | otherbitmap.words[k];
      }
      const c = this.words.length;
      for (k = mcount; k < c; ++k) {
        answer.words[k] = this.words[k];
      }
      const c2 = otherbitmap.words.length;
      for (k = mcount; k < c2; ++k) {
        answer.words[k] = otherbitmap.words[k];
      }
      return answer;
    };
    FastBitSet2.prototype.union_size = function(otherbitmap) {
      const mcount = Math.min(this.words.length, otherbitmap.words.length);
      let answer = 0 | 0;
      for (let k = 0 | 0; k < mcount; ++k) {
        answer += this.hammingWeight(this.words[k] | otherbitmap.words[k]);
      }
      if (this.words.length < otherbitmap.words.length) {
        const c = otherbitmap.words.length;
        for (let k = this.words.length; k < c; ++k) {
          answer += this.hammingWeight(otherbitmap.words[k] | 0);
        }
      } else {
        const c = this.words.length;
        for (let k = otherbitmap.words.length; k < c; ++k) {
          answer += this.hammingWeight(this.words[k] | 0);
        }
      }
      return answer;
    };
    module.exports = FastBitSet2;
  }
});

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/g_parser.js
var require_g_parser = __commonJS({
  "../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/g_parser.js"(exports, module) {
    "use strict";
    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }
    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }
    peg$subclass(peg$SyntaxError, Error);
    peg$SyntaxError.buildMessage = function(expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return '"' + literalEscape(expectation.text) + '"';
        },
        "class": function(expectation) {
          var escapedParts = "", i;
          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
          }
          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },
        any: function(expectation) {
          return "any character";
        },
        end: function(expectation) {
          return "end of input";
        },
        other: function(expectation) {
          return expectation.description;
        }
      };
      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }
      function literalEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function classEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }
      function describeExpected(expected2) {
        var descriptions = new Array(expected2.length), i, j;
        for (i = 0; i < expected2.length; i++) {
          descriptions[i] = describeExpectation(expected2[i]);
        }
        descriptions.sort();
        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }
        switch (descriptions.length) {
          case 1:
            return descriptions[0];
          case 2:
            return descriptions[0] + " or " + descriptions[1];
          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }
      function describeFound(found2) {
        return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
      }
      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };
    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};
      var peg$FAILED = {}, peg$startRuleFunctions = { Program: peg$parseProgram }, peg$startRuleFunction = peg$parseProgram, peg$c0 = function(ls) {
        return ast.mkProgram(ls, loc());
      }, peg$c1 = function(head, tail) {
        return buildList(head, tail, 1);
      }, peg$c2 = function(line) {
        return line;
      }, peg$c3 = function(l, sl) {
        return ast.mkAsmLine(l, null, sl, loc());
      }, peg$c4 = function(l, s) {
        return ast.mkAsmLine(l, s, null, loc());
      }, peg$c5 = function(l) {
        return ast.mkAsmLine(l, null, null, loc());
      }, peg$c6 = function(o) {
        return ast.mkAsmLine(null, o, null, loc());
      }, peg$c7 = function(s) {
        return ast.mkAsmLine(null, s, null, loc());
      }, peg$c8 = function() {
        return ast.mkAsmLine(null, null, null, loc());
      }, peg$c9 = function(drct) {
        return drct;
      }, peg$c10 = function(insn) {
        return insn;
      }, peg$c11 = peg$otherExpectation("directive"), peg$c12 = function(size, values2) {
        const dataSize = size == "byte" ? ast.DataSize.Byte : ast.DataSize.Word;
        return ast.mkData(dataSize, values2, loc());
      }, peg$c13 = function(numBytes, fillValue) {
        return ast.mkFill(numBytes, fillValue, loc());
      }, peg$c14 = function(alignBytes) {
        return ast.mkAlign(alignBytes, loc());
      }, peg$c15 = function(m, o1, o2) {
        return ast.mkInsn(m, o1, o2, loc());
      }, peg$c16 = function(m, o1) {
        return ast.mkInsn(m, o1, null, loc());
      }, peg$c17 = function(m) {
        return ast.mkInsn(m, null, null, loc());
      }, peg$c18 = function(first, rest) {
        return rest.reduce(function(memo, curr) {
          return ast.mkBinaryOp(curr[0], memo, curr[1], loc());
        }, first);
      }, peg$c19 = /^[a-zA-Z_]/, peg$c20 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false), peg$c21 = /^[a-zA-Z_0-9]/, peg$c22 = peg$classExpectation([["a", "z"], ["A", "Z"], "_", ["0", "9"]], false, false), peg$c23 = /^[0-9a-f]/i, peg$c24 = peg$classExpectation([["0", "9"], ["a", "f"]], false, true), peg$c25 = /^[0-1]/, peg$c26 = peg$classExpectation([["0", "1"]], false, false), peg$c27 = /^[+\-]/, peg$c28 = peg$classExpectation(["+", "-"], false, false), peg$c29 = /^[0-9]/, peg$c30 = peg$classExpectation([["0", "9"]], false, false), peg$c31 = /^[a-z]/i, peg$c32 = peg$classExpectation([["a", "z"]], false, true), peg$c33 = /^[0-9a-z_]/i, peg$c34 = peg$classExpectation([["0", "9"], ["a", "z"], "_"], false, true), peg$c35 = "a", peg$c36 = peg$literalExpectation("a", true), peg$c37 = "b", peg$c38 = peg$literalExpectation("b", true), peg$c39 = "c", peg$c40 = peg$literalExpectation("c", true), peg$c41 = "d", peg$c42 = peg$literalExpectation("d", true), peg$c43 = "g", peg$c44 = peg$literalExpectation("g", true), peg$c45 = "h", peg$c46 = peg$literalExpectation("h", true), peg$c47 = "j", peg$c48 = peg$literalExpectation("j", true), peg$c49 = "m", peg$c50 = peg$literalExpectation("m", true), peg$c51 = "o", peg$c52 = peg$literalExpectation("o", true), peg$c53 = "p", peg$c54 = peg$literalExpectation("p", true), peg$c55 = "r", peg$c56 = peg$literalExpectation("r", true), peg$c57 = "s", peg$c58 = peg$literalExpectation("s", true), peg$c59 = "x", peg$c60 = peg$literalExpectation("x", true), peg$c61 = "y", peg$c62 = peg$literalExpectation("y", true), peg$c63 = "0", peg$c64 = peg$literalExpectation("0", false), peg$c65 = "1", peg$c66 = peg$literalExpectation("1", false), peg$c67 = "2", peg$c68 = peg$literalExpectation("2", false), peg$c69 = ",", peg$c70 = peg$literalExpectation(",", false), peg$c71 = function(s) {
        return s;
      }, peg$c72 = "{", peg$c73 = peg$literalExpectation("{", false), peg$c74 = "}", peg$c75 = peg$literalExpectation("}", false), peg$c76 = "-", peg$c77 = peg$literalExpectation("-", false), peg$c78 = "+", peg$c79 = peg$literalExpectation("+", false), peg$c80 = "\xA7", peg$c81 = peg$literalExpectation("\xA7", false), peg$c82 = "*", peg$c83 = peg$literalExpectation("*", false), peg$c84 = "!align", peg$c85 = peg$literalExpectation("!align", false), peg$c86 = "!byte", peg$c87 = peg$literalExpectation("!byte", false), peg$c88 = function() {
        return "byte";
      }, peg$c89 = "!word", peg$c90 = peg$literalExpectation("!word", false), peg$c91 = function() {
        return "word";
      }, peg$c92 = "!fill", peg$c93 = peg$literalExpectation("!fill", false), peg$c94 = function(v) {
        return parseInt(v, 2);
      }, peg$c95 = function(v) {
        return parseInt(v, 16);
      }, peg$c96 = function(v) {
        return parseInt(v);
      }, peg$c97 = '"', peg$c98 = peg$literalExpectation('"', false), peg$c99 = function(c) {
        return c.join("");
      }, peg$c100 = peg$anyExpectation(), peg$c101 = function(char) {
        return char;
      }, peg$c102 = function() {
        return text();
      }, peg$c103 = peg$otherExpectation("whitespace"), peg$c104 = "	", peg$c105 = peg$literalExpectation("	", false), peg$c106 = "\v", peg$c107 = peg$literalExpectation("\v", false), peg$c108 = "\f", peg$c109 = peg$literalExpectation("\f", false), peg$c110 = " ", peg$c111 = peg$literalExpectation(" ", false), peg$c112 = "\xA0", peg$c113 = peg$literalExpectation("\xA0", false), peg$c114 = "\uFEFF", peg$c115 = peg$literalExpectation("\uFEFF", false), peg$c116 = peg$otherExpectation("end of line"), peg$c117 = /^[\n\r]/, peg$c118 = peg$classExpectation(["\n", "\r"], false, false), peg$c119 = peg$otherExpectation("comment"), peg$c120 = ";", peg$c121 = peg$literalExpectation(";", false), peg$c122 = peg$otherExpectation("label"), peg$c123 = ":", peg$c124 = peg$literalExpectation(":", false), peg$c125 = function(lbl) {
        return ast.mkLabel(lbl, loc());
      }, peg$c126 = peg$otherExpectation("ORG"), peg$c127 = function(v) {
        return ast.mkSetPC(v, loc());
      }, peg$c128 = peg$otherExpectation("mnemonic"), peg$c129 = function(mne) {
        return mne;
      }, peg$c130 = peg$otherExpectation("literal"), peg$c131 = function(v) {
        return ast.mkLiteral(v, "b", loc());
      }, peg$c132 = function(v) {
        return ast.mkLiteral(v, "h", loc());
      }, peg$c133 = function(v) {
        return ast.mkLiteral(v, "d", loc());
      }, peg$c134 = function(s) {
        return ast.mkLiteral(s, "s", loc());
      }, peg$c135 = peg$otherExpectation("identifier"), peg$c136 = "::", peg$c137 = peg$literalExpectation("::", false), peg$c138 = function(head, tail) {
        return ast.mkScopeQualifiedIdent(buildList(head, tail, 1), false, loc());
      }, peg$c139 = function(head, tail) {
        return ast.mkScopeQualifiedIdent(buildList(head, tail, 1), true, loc());
      }, peg$c140 = peg$otherExpectation("register"), peg$c141 = function(name) {
        return ast.mkRegister(name.toLowerCase(), loc());
      }, peg$c142 = peg$otherExpectation("current-pc"), peg$c143 = function() {
        return ast.mkGetCurPC(loc());
      }, peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }
      function text() {
        return input.substring(peg$savedPos, peg$currPos);
      }
      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }
      function expected(description, location2) {
        location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError(
          [peg$otherExpectation(description)],
          input.substring(peg$savedPos, peg$currPos),
          location2
        );
      }
      function error(message, location2) {
        location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location2);
      }
      function peg$literalExpectation(text2, ignoreCase) {
        return { type: "literal", text: text2, ignoreCase };
      }
      function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts, inverted, ignoreCase };
      }
      function peg$anyExpectation() {
        return { type: "any" };
      }
      function peg$endExpectation() {
        return { type: "end" };
      }
      function peg$otherExpectation(description) {
        return { type: "other", description };
      }
      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos], p;
        if (details) {
          return details;
        } else {
          p = pos - 1;
          while (!peg$posDetailsCache[p]) {
            p--;
          }
          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };
          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }
            p++;
          }
          peg$posDetailsCache[pos] = details;
          return details;
        }
      }
      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }
      function peg$fail(expected2) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }
        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected2);
      }
      function peg$buildSimpleError(message, location2) {
        return new peg$SyntaxError(message, null, null, location2);
      }
      function peg$buildStructuredError(expected2, found, location2) {
        return new peg$SyntaxError(
          peg$SyntaxError.buildMessage(expected2, found),
          expected2,
          found,
          location2
        );
      }
      function peg$parseProgram() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parseLines();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s1);
        }
        s0 = s1;
        return s0;
      }
      function peg$parseLines() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parseLineWithComment();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parseEOL();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseLineWithComment();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parseEOL();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseLineWithComment();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseLineWithComment() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parseWSS();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLine();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseCOMMENT();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c2(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseLine() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parseLABEL();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLWING();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseLines();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseRWING();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseLABEL();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseStatement();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c4(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseLABEL();
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c5(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseORG();
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1);
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseStatement();
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s1);
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parseWSS();
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c8();
                  }
                  s0 = s1;
                }
              }
            }
          }
        }
        return s0;
      }
      function peg$parseStatement() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parseDirective();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c9(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseInstruction();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c10(s1);
          }
          s0 = s1;
        }
        return s0;
      }
      function peg$parseDirective() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parsePSEUDO_BYTE();
        if (s1 === peg$FAILED) {
          s1 = peg$parsePSEUDO_WORD();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseExprList();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsePSEUDO_FILL();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseAdditive();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseCOMMA();
              if (s3 !== peg$FAILED) {
                s4 = peg$parseAdditive();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c13(s2, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsePSEUDO_ALIGN();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseAdditive();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c14(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c11);
          }
        }
        return s0;
      }
      function peg$parseExprList() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parseAdditive();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAdditive();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parseCOMMA();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseAdditive();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseInstruction() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parseMNEMONIC();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseAdditive();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseCOMMA();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseAdditive();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c15(s1, s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseMNEMONIC();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseAdditive();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c16(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseMNEMONIC();
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c17(s1);
            }
            s0 = s1;
          }
        }
        return s0;
      }
      function peg$parseAdditive() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parsePrimary();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parsePLUS();
          if (s4 === peg$FAILED) {
            s4 = peg$parseMINUS();
            if (s4 === peg$FAILED) {
              s4 = peg$parseSECT();
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsePrimary();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parsePLUS();
            if (s4 === peg$FAILED) {
              s4 = peg$parseMINUS();
              if (s4 === peg$FAILED) {
                s4 = peg$parseSECT();
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsePrimary();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePrimary() {
        var s0;
        s0 = peg$parseLITERAL();
        if (s0 === peg$FAILED) {
          s0 = peg$parseREGISTER();
          if (s0 === peg$FAILED) {
            s0 = peg$parseSQIDENTIFIER();
            if (s0 === peg$FAILED) {
              s0 = peg$parseCURRENTPC();
            }
          }
        }
        return s0;
      }
      function peg$parsealpha() {
        var s0;
        if (peg$c19.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c20);
          }
        }
        return s0;
      }
      function peg$parsealphanum() {
        var s0;
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c22);
          }
        }
        return s0;
      }
      function peg$parsehexadecimal() {
        var s0, s1;
        s0 = [];
        if (peg$c23.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c24);
          }
        }
        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c23.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c24);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsebinary() {
        var s0, s1;
        s0 = [];
        if (peg$c25.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }
        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c25.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c26);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsedecimal() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        if (peg$c27.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c28);
          }
        }
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c29.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c30);
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c29.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c30);
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseident() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c31.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c32);
          }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c31.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c32);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c33.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c34);
            }
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c33.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c34);
              }
            }
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseA() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c35) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c36);
          }
        }
        return s0;
      }
      function peg$parseB() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c37) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }
        return s0;
      }
      function peg$parseC() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c39) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c40);
          }
        }
        return s0;
      }
      function peg$parseD() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c41) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c42);
          }
        }
        return s0;
      }
      function peg$parseG() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c43) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c44);
          }
        }
        return s0;
      }
      function peg$parseH() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c45) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c46);
          }
        }
        return s0;
      }
      function peg$parseJ() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c47) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c48);
          }
        }
        return s0;
      }
      function peg$parseM() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c49) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c50);
          }
        }
        return s0;
      }
      function peg$parseO() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c51) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c52);
          }
        }
        return s0;
      }
      function peg$parseP() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c53) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c54);
          }
        }
        return s0;
      }
      function peg$parseR() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c55) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c56);
          }
        }
        return s0;
      }
      function peg$parseS() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c57) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c58);
          }
        }
        return s0;
      }
      function peg$parseX() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c59) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c60);
          }
        }
        return s0;
      }
      function peg$parseY() {
        var s0;
        if (input.substr(peg$currPos, 1).toLowerCase() === peg$c61) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c62);
          }
        }
        return s0;
      }
      function peg$parse_0() {
        var s0;
        if (input.charCodeAt(peg$currPos) === 48) {
          s0 = peg$c63;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c64);
          }
        }
        return s0;
      }
      function peg$parse_1() {
        var s0;
        if (input.charCodeAt(peg$currPos) === 49) {
          s0 = peg$c65;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c66);
          }
        }
        return s0;
      }
      function peg$parse_2() {
        var s0;
        if (input.charCodeAt(peg$currPos) === 50) {
          s0 = peg$c67;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c68);
          }
        }
        return s0;
      }
      function peg$parseCOMMA() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s1 = peg$c69;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c70);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseLWING() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c72;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c73);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseRWING() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 125) {
          s1 = peg$c74;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c75);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseMINUS() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c76;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c77);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePLUS() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 43) {
          s1 = peg$c78;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c79);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseSECT() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 167) {
          s1 = peg$c80;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c81);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseSTAR() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 42) {
          s1 = peg$c82;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c83);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c71(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePSEUDO_ALIGN() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c84) {
          s1 = peg$c84;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c85);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePSEUDO_BYTE() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c86) {
          s1 = peg$c86;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c87);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c88();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePSEUDO_WORD() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c89) {
          s1 = peg$c89;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c90);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c91();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsePSEUDO_FILL() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c92) {
          s1 = peg$c92;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c93);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseBIN() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsebinary();
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseB();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c94(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseHEX() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_0();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseX();
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parsehexadecimal();
            if (s4 !== peg$FAILED) {
              s3 = input.substring(s3, peg$currPos);
            } else {
              s3 = s4;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c95(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseDEC() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parsedecimal();
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseD();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c96(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseSTR() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c97;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c98);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsedoubleStringCharacter();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsedoubleStringCharacter();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s3 = peg$c97;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c98);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c99(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parsedoubleStringCharacter() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c97;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c98);
          }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c100);
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c101(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseidentNoWS() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = [];
        s3 = peg$parsealpha();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsealpha();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsealphanum();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsealphanum();
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c102();
        }
        s0 = s1;
        return s0;
      }
      function peg$parseWSS() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        s1 = peg$parseWS();
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parseWS();
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c103);
          }
        }
        return s0;
      }
      function peg$parseWS() {
        var s0, s1;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 9) {
          s0 = peg$c104;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c105);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 11) {
            s0 = peg$c106;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c107);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 12) {
              s0 = peg$c108;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c109);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 32) {
                s0 = peg$c110;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c111);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 160) {
                  s0 = peg$c112;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c113);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 65279) {
                    s0 = peg$c114;
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c115);
                    }
                  }
                }
              }
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c103);
          }
        }
        return s0;
      }
      function peg$parseEOL() {
        var s0, s1;
        peg$silentFails++;
        if (peg$c117.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c118);
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c116);
          }
        }
        return s0;
      }
      function peg$parseCOMMENT() {
        var s0, s1, s2, s3, s4, s5;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 59) {
          s1 = peg$c120;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c121);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseEOL();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$currPos;
            peg$silentFails++;
            s5 = peg$parseEOL();
            peg$silentFails--;
            if (s5 === peg$FAILED) {
              s4 = void 0;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 !== peg$FAILED) {
              if (input.length > peg$currPos) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c100);
                }
              }
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c119);
          }
        }
        return s0;
      }
      function peg$parseLABEL() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseidentNoWS();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s2 = peg$c123;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c124);
            }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseWSS();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c125(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c122);
          }
        }
        return s0;
      }
      function peg$parseORG() {
        var s0, s1, s2, s3, s4, s5, s6;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseO();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseR();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseG();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseWSS();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseLITERAL();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseWSS();
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c127(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c126);
          }
        }
        return s0;
      }
      function peg$parseMNEMONIC() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseidentNoWS();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c129(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c128);
          }
        }
        return s0;
      }
      function peg$parseLITERAL() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseBIN();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWSS();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c131(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseHEX();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseWSS();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c132(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseDEC();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseWSS();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c133(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseSTR();
              if (s1 !== peg$FAILED) {
                s2 = peg$parseWSS();
                if (s2 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c134(s1);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c130);
          }
        }
        return s0;
      }
      function peg$parseSQIDENTIFIER() {
        var s0, s1, s2, s3, s4, s5, s6;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseidentNoWS();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c136) {
            s4 = peg$c136;
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c137);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseidentNoWS();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c136) {
              s4 = peg$c136;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c137);
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseidentNoWS();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseWSS();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c138(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c136) {
            s1 = peg$c136;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c137);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseidentNoWS();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c136) {
                s5 = peg$c136;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c137);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseidentNoWS();
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c136) {
                  s5 = peg$c136;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c137);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseidentNoWS();
                  if (s6 !== peg$FAILED) {
                    s5 = [s5, s6];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseWSS();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c139(s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c135);
          }
        }
        return s0;
      }
      function peg$parseREGISTER() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        s3 = peg$parseA();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseS();
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseA();
          if (s2 === peg$FAILED) {
            s2 = peg$parseB();
            if (s2 === peg$FAILED) {
              s2 = peg$parseC();
              if (s2 === peg$FAILED) {
                s2 = peg$parseD();
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$parseM();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parse_2();
                    if (s4 !== peg$FAILED) {
                      s3 = [s3, s4];
                      s2 = s3;
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                  if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$parseM();
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parse_1();
                      if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                      } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                    if (s2 === peg$FAILED) {
                      s2 = peg$parseM();
                      if (s2 === peg$FAILED) {
                        s2 = peg$currPos;
                        s3 = peg$parseP();
                        if (s3 !== peg$FAILED) {
                          s4 = peg$parseC();
                          if (s4 !== peg$FAILED) {
                            s3 = [s3, s4];
                            s2 = s3;
                          } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s2;
                          s2 = peg$FAILED;
                        }
                        if (s2 === peg$FAILED) {
                          s2 = peg$currPos;
                          s3 = peg$parseX();
                          if (s3 !== peg$FAILED) {
                            s4 = peg$parseY();
                            if (s4 !== peg$FAILED) {
                              s3 = [s3, s4];
                              s2 = s3;
                            } else {
                              peg$currPos = s2;
                              s2 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                          }
                          if (s2 === peg$FAILED) {
                            s2 = peg$parseX();
                            if (s2 === peg$FAILED) {
                              s2 = peg$parseY();
                              if (s2 === peg$FAILED) {
                                s2 = peg$currPos;
                                s3 = peg$parseJ();
                                if (s3 !== peg$FAILED) {
                                  s4 = peg$parse_1();
                                  if (s4 !== peg$FAILED) {
                                    s3 = [s3, s4];
                                    s2 = s3;
                                  } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s2;
                                  s2 = peg$FAILED;
                                }
                                if (s2 === peg$FAILED) {
                                  s2 = peg$currPos;
                                  s3 = peg$parseJ();
                                  if (s3 !== peg$FAILED) {
                                    s4 = peg$parse_2();
                                    if (s4 !== peg$FAILED) {
                                      s3 = [s3, s4];
                                      s2 = s3;
                                    } else {
                                      peg$currPos = s2;
                                      s2 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                  }
                                  if (s2 === peg$FAILED) {
                                    s2 = peg$parseJ();
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parsealpha();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseWSS();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c141(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c140);
          }
        }
        return s0;
      }
      function peg$parseCURRENTPC() {
        var s0, s1;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseSTAR();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c143();
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c142);
          }
        }
        return s0;
      }
      var ast = (init_ast(), __toCommonJS(ast_exports));
      function extractList(list, index) {
        return list.map(function(element) {
          return element[index];
        });
      }
      function buildList(head, tail, index) {
        return [head].concat(extractList(tail, index));
      }
      function loc() {
        return { ...location() };
      }
      peg$result = peg$startRuleFunction();
      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(
          peg$maxFailExpected,
          peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
          peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
        );
      }
    }
    module.exports = {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  }
});

// src/language/rcasm/rcasm.worker.ts
import * as worker from "../../editor/editor.worker.js";

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/opcodes.js
var aluDests = {
  "a": 0,
  "d": 1
};
var ldsDests = {
  "a": 0,
  "d": 1
};
var set8Dests = {
  "a": 0,
  "b": 1
};
var set16Dests = {
  "m": 0,
  "j": 1
};
var mov8Targets = {
  "a": 0,
  "b": 1,
  "c": 2,
  "d": 3,
  "m1": 4,
  "m2": 5,
  "x": 6,
  "y": 7
};
var mov16Dests = {
  "xy": 0,
  "pc": 1
};
var mov16Sources = {
  "m": 0,
  "xy": 1,
  "j": 2,
  "as": 3
};
var clr16Targets = {
  "xy": 1
};
var loadStoreDests = {
  "a": 0,
  "b": 1,
  "c": 2,
  "d": 3
};
var MnemonicType;
(function(MnemonicType2) {
  MnemonicType2[MnemonicType2["Direct"] = 0] = "Direct";
  MnemonicType2[MnemonicType2["Alu"] = 1] = "Alu";
  MnemonicType2[MnemonicType2["Clear"] = 2] = "Clear";
  MnemonicType2[MnemonicType2["Goto"] = 3] = "Goto";
  MnemonicType2[MnemonicType2["LodSw"] = 4] = "LodSw";
  MnemonicType2[MnemonicType2["LitOpc"] = 5] = "LitOpc";
  MnemonicType2[MnemonicType2["Move"] = 6] = "Move";
  MnemonicType2[MnemonicType2["Set"] = 7] = "Set";
  MnemonicType2[MnemonicType2["LoadStore"] = 8] = "LoadStore";
})(MnemonicType || (MnemonicType = {}));
var mnemonics = {
  "add": { mt: MnemonicType.Alu, ops: [{ op: 128 | 1, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "inc": { mt: MnemonicType.Alu, ops: [{ op: 128 | 2, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "and": { mt: MnemonicType.Alu, ops: [{ op: 128 | 3, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "orr": { mt: MnemonicType.Alu, ops: [{ op: 128 | 4, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "eor": { mt: MnemonicType.Alu, ops: [{ op: 128 | 5, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "cmp": { mt: MnemonicType.Alu, ops: [{ op: 128 | 5, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "not": { mt: MnemonicType.Alu, ops: [{ op: 128 | 6, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "rol": { mt: MnemonicType.Alu, ops: [{ op: 128 | 7, p1: { cs: aluDests, op: (p) => p << 3 }, p2: null }] },
  "mov": {
    mt: MnemonicType.Move,
    ops: [
      { op: 0, p1: { cs: mov8Targets, op: (p) => p << 3 }, p2: { cs: mov8Targets, op: (p) => p } },
      { op: 160, p1: { cs: mov16Dests, op: (p) => p << 2 }, p2: { cs: mov16Sources, op: (p) => p } }
    ]
  },
  "clr": {
    mt: MnemonicType.Clear,
    ops: [
      { op: 0, p1: { cs: mov8Targets, op: (p) => p << 3 | p }, p2: null },
      { op: 160, p1: { cs: clr16Targets, op: (p) => p }, p2: null }
    ]
  },
  "rts": { mt: MnemonicType.Direct, ops: [{ op: 160 | 5, p1: null, p2: null }] },
  "ldr": { mt: MnemonicType.LoadStore, ops: [{ op: 144, p1: { cs: loadStoreDests, op: (p) => p }, p2: null }] },
  "str": { mt: MnemonicType.LoadStore, ops: [{ op: 152, p1: { cs: loadStoreDests, op: (p) => p }, p2: null }] },
  "ldi": {
    mt: MnemonicType.Set,
    ops: [
      { op: 64, p1: { cs: set8Dests, op: (p) => p << 5 }, p2: { cs: null, op: (p) => p & 31 } },
      { op: 192, p1: { cs: set16Dests, op: (p) => p << 5 }, p2: null }
    ]
  },
  "hlt": { mt: MnemonicType.Direct, ops: [{ op: 168 | 6, p1: null, p2: null }] },
  "hlr": { mt: MnemonicType.Direct, ops: [{ op: 168 | 7, p1: null, p2: null }] },
  "lds": { mt: MnemonicType.LodSw, ops: [{ op: 168 | 4, p1: { cs: ldsDests, op: (p) => p }, p2: null }] },
  "ixy": { mt: MnemonicType.Direct, ops: [{ op: 176, p1: null, p2: null }] },
  "jmp": { mt: MnemonicType.Goto, ops: [{ op: 192 | 38, p1: null, p2: null }] },
  "jsr": { mt: MnemonicType.Goto, ops: [{ op: 192 | 39, p1: null, p2: null }] },
  "bne": { mt: MnemonicType.Goto, ops: [{ op: 192 | 34, p1: null, p2: null }] },
  "beq": { mt: MnemonicType.Goto, ops: [{ op: 192 | 36, p1: null, p2: null }] },
  "bcs": { mt: MnemonicType.Goto, ops: [{ op: 192 | 40, p1: null, p2: null }] },
  "bmi": { mt: MnemonicType.Goto, ops: [{ op: 192 | 48, p1: null, p2: null }] },
  "blt": { mt: MnemonicType.Goto, ops: [{ op: 192 | 48, p1: null, p2: null }] },
  "ble": { mt: MnemonicType.Goto, ops: [{ op: 192 | 52, p1: null, p2: null }] },
  "opc": { mt: MnemonicType.LitOpc, ops: [{ op: 0 | 0, p1: { cs: null, op: (p) => p }, p2: null }] }
};

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/util.js
function toHex16(v) {
  return v.toString(16).padStart(4, "0");
}

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/asm.js
init_ast();

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/segment.js
var Segment = class {
  constructor(start, end, inferStart, id) {
    this.start = start;
    this.end = end;
    this.inferStart = inferStart;
    this.id = id;
    this.blocks = [{
      start,
      binary: []
    }];
    this.curBlock = this.blocks[0];
  }
  setCurrentPC(pc) {
    let err = void 0;
    if (this.inferStart && this.blocks.length === 1 && this.blocks[0].binary.length === 0) {
      this.start = pc;
    } else {
      const endstr = this.end !== void 0 ? `$${toHex16(this.end)}` : "";
      const range = `Segment address range: $${toHex16(this.start)}-${endstr}`;
      if (pc < this.start) {
        err = `${range}.  Cannot set program counter to a lower address $${toHex16(pc)}.`;
      } else {
        if (this.end !== void 0 && pc > this.end) {
          err = `${range}.  Trying to set program counter to $${toHex16(pc)} -- it is past segment end ${endstr}.`;
        } else {
          if (this.blocks.length === 1 && this.blocks[0].binary.length === 0) {
            this.start = pc;
          }
        }
      }
    }
    const newBlock = {
      start: pc,
      binary: []
    };
    const idx = this.blocks.push(newBlock);
    this.curBlock = this.blocks[idx - 1];
    return err;
  }
  empty() {
    return this.blocks.every((b) => b.binary.length === 0);
  }
  currentPC() {
    return this.curBlock.start + this.curBlock.binary.length;
  }
  emit(byte) {
    if (this.currentPC() < this.start || this.end !== void 0 && this.currentPC() > this.end) {
      const endstr = this.end !== void 0 ? `$${toHex16(this.end)}` : "";
      const startstr = this.start !== void 0 ? `$${toHex16(this.start)}` : "";
      return `Segment overflow at $${toHex16(this.currentPC())}.  Segment address range: ${startstr}-${endstr}`;
    }
    this.curBlock.binary.push(byte);
    return void 0;
  }
  formatRange() {
    const endstr = this.end !== void 0 ? `$${toHex16(this.end)}` : "";
    const startstr = this.start !== void 0 ? `$${toHex16(this.start)}` : "";
    return `${startstr}-${endstr}`;
  }
  overlaps(another) {
    const startA = this.start;
    const startB = another.start;
    const endA = this.end !== void 0 ? this.end : this.currentPC();
    const endB = another.end !== void 0 ? another.end : another.currentPC();
    if (startA < startB) {
      return startB <= endA;
    }
    return endB >= startA;
  }
};
function compact(segments) {
  const out = [];
  for (const [name, seg] of segments) {
    const compactBlocks = seg.blocks.filter((b) => b.binary.length !== 0).sort((a, b) => a.start - b.start);
    if (compactBlocks.length !== 0) {
      const newSeg = new Segment(seg.start, seg.end, seg.inferStart, out.length - 1);
      newSeg.blocks = compactBlocks;
      newSeg.curBlock = compactBlocks[compactBlocks.length - 1];
      out.push([name, newSeg]);
    }
  }
  return out;
}
function mergeSegments(segments_) {
  const segments = compact(segments_);
  if (segments.length === 0) {
    return {
      startPC: 0,
      binary: Uint8Array.from([])
    };
  }
  const [, s0] = segments[0];
  const block0 = s0.blocks[0];
  const blockN = s0.blocks[s0.blocks.length - 1];
  let minAddr = block0.start;
  let maxAddr = blockN.start + blockN.binary.length;
  for (let i = 1; i < segments.length; i++) {
    const s = segments[i][1];
    const firstPC = s.blocks[0].start;
    const lastPC = s.curBlock.start + s.curBlock.binary.length;
    minAddr = Math.min(firstPC, minAddr);
    maxAddr = Math.max(lastPC, maxAddr);
  }
  const buf = new Uint8Array(maxAddr);
  for (const [, seg] of segments) {
    for (const b of seg.blocks) {
      for (let i = 0; i < b.binary.length; i++) {
        buf[b.start + i] = b.binary[i];
      }
    }
  }
  return {
    startPC: minAddr,
    binary: buf.slice(minAddr)
  };
}
function collectSegmentInfo(segments_) {
  const segments = compact(segments_).sort((a, b) => a[1].start - b[1].start);
  return segments.map(([name, s]) => {
    const blocks = s.blocks.map((b) => {
      return { start: b.start, end: b.start + b.binary.length - 1 };
    });
    return { name, blocks };
  });
}

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/debugInfo.js
var FastBitSet = require_FastBitSet();
var DebugInfoTracker = class {
  constructor() {
    this.lineStack = [];
    this.pcToLocs = {};
    this.insnBitset = new FastBitSet();
  }
  startLine(loc, codePC, segment) {
    const l = {
      lineNo: loc.start.line,
      segmentId: segment.id,
      numBytes: 0
    };
    this.lineStack.push({ loc: l, pc: codePC, segmentId: segment.id });
  }
  endLine(curPC, curSegment) {
    const entry = this.lineStack.pop();
    if (!entry) {
      throw new Error("internal compiler error, mismatching start/end lines in debugInfo");
    }
    const numBytesEmitted = curPC - entry.pc;
    if (numBytesEmitted > 0 && curSegment.id === entry.segmentId) {
      const e = { ...entry.loc, numBytes: numBytesEmitted };
      if (this.pcToLocs[entry.pc] === void 0) {
        this.pcToLocs[entry.pc] = [e];
      } else {
        this.pcToLocs[entry.pc].push(e);
      }
    }
  }
  markAsInstruction(start, end) {
    for (let i = start; i < end; i++) {
      this.insnBitset.add(i);
    }
  }
  info() {
    const insnBitset = this.insnBitset.clone();
    const isInstruction = (addr) => {
      return insnBitset.has(addr);
    };
    return {
      pcToLocs: this.pcToLocs,
      isInstruction
    };
  }
};

// ../rcasm-languageservice/node_modules/@paul80nd/rcasm/lib/esm/src/asm.js
var parser = require_g_parser();
function mkErrorValue(v) {
  return { value: v, errors: true, completeFirstPass: false };
}
function mkEvalValue(v, complete) {
  return { value: v, errors: false, completeFirstPass: complete };
}
function anyErrors(...args) {
  return args.some((e) => e !== void 0 && e.errors);
}
function combineEvalPassInfo(...args) {
  return args.every((e) => e !== void 0 && e.completeFirstPass);
}
var NamedScope = class _NamedScope {
  constructor(parent, name) {
    this.syms = /* @__PURE__ */ new Map();
    this.parent = null;
    this.children = /* @__PURE__ */ new Map();
    this.parent = parent;
    this.name = name;
  }
  newScope(name, parent) {
    const s = this.children.get(name);
    if (s !== void 0) {
      return s;
    }
    const newScope = new _NamedScope(parent, name);
    this.children.set(name, newScope);
    return newScope;
  }
  findSymbol(name) {
    for (let cur = this; cur !== null; cur = cur.parent) {
      const n = cur.syms.get(name);
      if (n !== void 0) {
        return n;
      }
    }
    return void 0;
  }
  findSymbolPath(path) {
    if (path.length === 1) {
      return this.findSymbol(path[0]);
    }
    let tab = this;
    while (tab.children.get(path[0]) === void 0) {
      tab = tab.parent;
      if (tab === null) {
        return void 0;
      }
    }
    for (let i = 0; i < path.length - 1; i++) {
      tab = tab.children.get(path[i]);
      if (tab === void 0) {
        return void 0;
      }
    }
    return tab.syms.get(path[path.length - 1]);
  }
  addSymbol(name, val, pass) {
    this.syms.set(name, { ...val, seen: pass });
  }
  updateSymbol(name, val, pass) {
    for (let cur = this; cur !== null; cur = cur.parent) {
      const v = cur.syms.get(name);
      if (v !== void 0) {
        cur.syms.set(name, { ...val, seen: pass });
        return;
      }
    }
  }
};
var Scopes = class {
  constructor() {
    this.passCount = 0;
    this.root = new NamedScope(null, "");
    this.curSymtab = this.root;
    this.anonScopeCount = 0;
  }
  startPass(pass) {
    this.curSymtab = this.root;
    this.anonScopeCount = 0;
    this.passCount = pass;
  }
  withLabelScope(name, body, parent) {
    const curSym = this.curSymtab;
    this.curSymtab = this.curSymtab.newScope(name, parent || curSym);
    body();
    this.curSymtab = curSym;
  }
  findPath(path, absolute) {
    if (absolute) {
      return this.root.findSymbolPath(path);
    }
    return this.curSymtab.findSymbolPath(path);
  }
  findQualifiedSym(path, absolute) {
    return this.findPath(path, absolute);
  }
  symbolSeen(name) {
    const n = this.curSymtab.syms.get(name);
    if (n !== void 0) {
      return n.seen === this.passCount;
    }
    return false;
  }
  declareLabelSymbol(symbol, codePC, segment) {
    const { name, loc } = symbol;
    const prevLabel = this.curSymtab.syms.get(name);
    if (prevLabel === void 0) {
      const lblsym = {
        type: "label",
        segment,
        data: mkEvalValue({ addr: codePC, loc }, false)
      };
      this.curSymtab.addSymbol(name, lblsym, this.passCount);
      return false;
    }
    if (prevLabel.type !== "label") {
      throw new Error("ICE: declareLabelSymbol should be called only on labels");
    }
    const lbl = prevLabel;
    if (lbl.data.value.addr !== codePC) {
      const newSymValue = {
        type: "label",
        segment,
        data: {
          ...prevLabel.data,
          value: {
            ...prevLabel.data.value,
            addr: codePC
          }
        }
      };
      this.curSymtab.updateSymbol(name, newSymValue, this.passCount);
      return true;
    }
    this.curSymtab.updateSymbol(name, prevLabel, this.passCount);
    return false;
  }
  dumpLabels(codePC, segments) {
    const segmentToName = {};
    for (const [n, s] of segments) {
      segmentToName[s.id] = n;
    }
    const stack = [];
    const pushScope = (path, sym) => {
      if (path !== void 0) {
        const newPath = [...path, sym.name];
        stack.push({ path: newPath, sym });
      } else {
        stack.push({ path: [], sym });
      }
    };
    pushScope(void 0, this.root);
    const labels = [];
    while (stack.length > 0) {
      const s = stack.pop();
      if (s) {
        for (const [k, lbl] of s.sym.syms) {
          if (lbl.type === "label") {
            labels.push({
              path: [...s.path, k],
              addr: lbl.data.value.addr,
              size: 0,
              segmentName: segmentToName[lbl.segment.id]
            });
          }
        }
        for (const [, sym] of s.sym.children) {
          pushScope(s.path, sym);
        }
      }
    }
    const sortedLabels = labels.sort((a, b) => {
      return a.addr - b.addr;
    });
    const numLabels = sortedLabels.length;
    if (numLabels > 0) {
      for (let i = 1; i < numLabels; i++) {
        sortedLabels[i - 1].size = sortedLabels[i].addr - sortedLabels[i - 1].addr;
      }
      const last = sortedLabels[numLabels - 1];
      last.size = codePC - last.addr;
    }
    return sortedLabels.map(({ path, addr, size, segmentName }) => {
      return { name: path.join("::"), addr, size, segmentName };
    });
  }
};
function formatTypename(v) {
  const typeName = typeof v;
  if (typeName === "object") {
    if (v instanceof Array) {
      return "array";
    }
  }
  return typeName;
}
function formatSymbolPath(p) {
  return `${p.absolute ? "::" : ""}${p.path.join("::")}`;
}
var runBinop = (a, b, f) => {
  const res = f(a.value, b.value);
  const firstPassComplete = combineEvalPassInfo(a, b);
  if (typeof res == "boolean") {
    return mkEvalValue(res ? 1 : 0, firstPassComplete);
  }
  return mkEvalValue(res, firstPassComplete);
};
var Assembler = class {
  constructor() {
    this.curSegmentName = "";
    this.curSegment = new Segment(0, 0, false, 0);
    this.pass = 0;
    this.needPass = false;
    this.scopes = new Scopes();
    this.segments = [];
    this.errorList = [];
    this.warningList = [];
    this.debugInfo = new DebugInfoTracker();
    this.errors = () => {
      return this.formatErrors(this.errorList, "error");
    };
    this.warnings = () => {
      return this.formatErrors(this.warningList, "warning");
    };
  }
  prg() {
    const { startPC, binary } = mergeSegments(this.segments);
    const startLo = startPC & 255;
    const startHi = startPC >> 8 & 255;
    return Uint8Array.from([startLo, startHi, ...binary]);
  }
  anyErrors() {
    return this.errorList.length !== 0;
  }
  formatErrors(diags, errType) {
    const set = new Set(diags.map((v) => JSON.stringify(v)));
    return [...set].map((errJson) => {
      const { loc, msg } = JSON.parse(errJson);
      let formatted = `<unknown>:1:1: ${errType}: ${msg}`;
      if (loc) {
        formatted = `${loc.start.line}:${loc.start.column}: ${errType}: ${msg}`;
      }
      return {
        loc,
        msg,
        formatted
      };
    });
  }
  addError(msg, loc) {
    this.errorList.push({ msg, loc });
  }
  addWarning(msg, loc) {
    this.warningList.push({ msg, loc });
  }
  startPass(pass) {
    this.pass = pass;
    this.needPass = false;
    this.errorList = [];
    this.scopes.startPass(pass);
    this.debugInfo = new DebugInfoTracker();
    this.segments = [];
    const segment = this.newSegment("default", 0, void 0, true);
    this.setCurrentSegment({ type: "segment", data: segment }, "default");
  }
  setCurrentSegment(sym, segmentName) {
    this.curSegmentName = segmentName;
    this.curSegment = sym.data;
  }
  newSegment(name, startAddr, endAddr, inferStart) {
    const segment = new Segment(startAddr, endAddr, inferStart, this.segments.length - 1);
    this.segments.push([name, segment]);
    return segment;
  }
  getPC() {
    return this.curSegment.currentPC();
  }
  evalExprType(node, ty, msg) {
    const res = this.evalExpr(node);
    const { errors, value, completeFirstPass } = res;
    if (!errors && typeof value !== ty) {
      this.addError(`Expecting ${msg} to be '${ty}' type, got '${formatTypename(value)}'`, node.loc);
      return {
        errors: true,
        completeFirstPass,
        value
      };
    }
    return res;
  }
  evalExprToInt(node, msg) {
    return this.evalExprType(node, "number", msg);
  }
  evalExpr(node) {
    switch (node.type) {
      case "binary": {
        const left = this.evalExpr(node.left);
        const right = this.evalExpr(node.right);
        if (anyErrors(left, right)) {
          return mkErrorValue(0);
        }
        if (typeof left.value !== typeof right.value) {
          this.addError(`Binary expression operands are expected to be of the same type.  Got: '${formatTypename(left.value)}' (left), '${formatTypename(right.value)}' (right)`, node.loc);
          return mkErrorValue(0);
        }
        if (typeof left.value !== "string" && typeof left.value !== "number") {
          this.addError(`Binary expression operands can only operator on numbers or strings.  Got: '${formatTypename(left.value)}'`, node.loc);
          return mkErrorValue(0);
        }
        if (typeof left.value == "string") {
          const okOps = ["+"];
          if (okOps.indexOf(node.op) < 0) {
            this.addError(`'${node.op}' operator is not supported for strings.  Valid operators for strings are: ${okOps.join(", ")}`, node.loc);
            return mkErrorValue(0);
          }
        }
        switch (node.op) {
          case "+":
            return runBinop(left, right, (a, b) => a + b);
          case "-":
            return runBinop(left, right, (a, b) => a - b);
          case "\xA7":
            return runBinop(left, right, (a, b) => (a & 255) << 8 | b & 255);
          default:
            throw new Error(`Unhandled binary operator ${node.op}`);
        }
      }
      case "literal": {
        return mkEvalValue(node.lit, true);
      }
      case "register": {
        this.addError("Unexpected register", node.loc);
        return mkErrorValue(0);
      }
      case "ident": {
        throw new Error("should not see an ident here -- if you do, it is probably a wrong type node in parser");
      }
      case "qualified-ident": {
        const sym = this.scopes.findQualifiedSym(node.path, node.absolute);
        if (sym === void 0) {
          if (this.pass >= 1) {
            this.addError(`Undefined symbol '${formatSymbolPath(node)}'`, node.loc);
            return mkErrorValue(0);
          }
          this.needPass = true;
          return mkEvalValue(0, false);
        }
        switch (sym.type) {
          case "label":
            return {
              errors: sym.data.errors,
              value: sym.data.value.addr,
              completeFirstPass: sym.seen === this.pass
            };
        }
        break;
      }
      case "getcurpc": {
        return mkEvalValue(this.getPC(), true);
      }
      default:
        break;
    }
    throw new Error(`should be unreachable on ${node}`);
    return mkErrorValue(0);
  }
  emit(byte) {
    const err = this.curSegment.emit(byte);
    if (err !== void 0) {
      this.addError(err, this.lineLoc);
    }
  }
  emit16(word) {
    this.emit(word >> 8 & 255);
    this.emit(word & 255);
  }
  assembleNonInstr(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p1) {
      this.addWarning(`Parameter not required`, stmt.p1.loc);
    }
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    this.emit(opc.op);
  }
  assembleAluInstr(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    let opcode = opc.op;
    if (stmt.p1 && opc.p1) {
      const tgt = this.checkRegister(stmt.p1, opc.p1);
      if (tgt === void 0) {
        return;
      }
      opcode |= opc.p1.op(tgt);
    }
    this.emit(opcode);
  }
  assembleClrInstr(mne, stmt) {
    if (!stmt.p1) {
      this.addError(`Parameter required`, stmt.loc);
      return;
    }
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    if (!mne.ops[0] || !mne.ops[0].p1 || !mne.ops[1] || !mne.ops[1].p1) {
      this.addError(`Internal opcode definition error`, stmt.loc);
      return;
    }
    const tgt = this.checkRegister(stmt.p1, mne.ops[0].p1, mne.ops[1].p1);
    if (tgt === void 0) {
      return;
    }
    const opc = this.hasRegister(stmt.p1, mne.ops[1].p1) ? mne.ops[1] : mne.ops[0];
    if (!opc.p1) {
      this.addError(`Internal opcode definition error`, stmt.loc);
      return;
    }
    let opcode = opc.op;
    opcode |= opc.p1.op(tgt);
    this.emit(opcode);
  }
  assembleMovInstr(mne, stmt) {
    if (!stmt.p1 || !stmt.p2) {
      this.addError(`Two parameters required`, stmt.loc);
      return;
    }
    if (!mne.ops[0] || !mne.ops[0].p1 || !mne.ops[1] || !mne.ops[1].p1) {
      this.addError(`Internal opcode definition error`, stmt.loc);
      return;
    }
    const tgt = this.checkRegister(stmt.p1, mne.ops[0].p1, mne.ops[1].p1);
    if (tgt === void 0) {
      return;
    }
    const opc = this.hasRegister(stmt.p1, mne.ops[1].p1) ? mne.ops[1] : mne.ops[0];
    if (!stmt.p1 || !opc.p1 || !stmt.p2 || !opc.p2) {
      this.addError(`Two parameters required`, stmt.loc);
      return;
    }
    let opcode = opc.op;
    opcode |= opc.p1.op(tgt);
    const src = this.checkRegister(stmt.p2, opc.p2);
    if (src === void 0) {
      return;
    }
    opcode |= opc.p2.op(src);
    this.emit(opcode);
  }
  assembleLitOpc(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    let opcode = opc.op;
    if (!stmt.p1 || !opc.p1) {
      this.addError(`Parameter required`, stmt.loc);
      return;
    }
    const val = this.checkLiteral(stmt.p1, 0, 255, "h");
    if (val === void 0) {
      return;
    }
    opcode |= opc.p1.op(val);
    this.emit(opcode);
  }
  assembleLodSwInstr(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    let opcode = opc.op;
    if (!stmt.p1 || !opc.p1) {
      this.addError(`Parameter required`, stmt.loc);
      return;
    }
    const tgt = this.checkRegister(stmt.p1, opc.p1);
    if (tgt === void 0) {
      return;
    }
    opcode |= opc.p1.op(tgt);
    this.emit(opcode);
  }
  assembleSetInstr(mne, stmt) {
    if (!stmt.p1 || !stmt.p2) {
      this.addError(`Two parameters required`, stmt.loc);
      return;
    }
    if (!mne.ops[0] || !mne.ops[0].p1 || !mne.ops[1] || !mne.ops[1].p1) {
      this.addError(`Internal opcode definition error`, stmt.loc);
      return;
    }
    const tgt = this.checkRegister(stmt.p1, mne.ops[0].p1, mne.ops[1].p1);
    if (tgt === void 0) {
      return;
    }
    const is16bit = this.hasRegister(stmt.p1, mne.ops[1].p1);
    const opc = is16bit ? mne.ops[1] : mne.ops[0];
    if (!opc.p1) {
      this.addError(`Internal opcode definition error`, stmt.loc);
      return;
    }
    let opcode = opc.op;
    opcode |= opc.p1.op(tgt);
    if (is16bit) {
      const ev = this.evalExpr(stmt.p2);
      if (anyErrors(ev)) {
        return;
      }
      if (typeof ev.value !== "number") {
        this.addError(`Expecting branch label to evaluate to integer, got ${formatTypename(ev.value)}`, stmt.p2.loc);
        return;
      }
      const { value: addr } = ev;
      if (addr > 65535) {
        this.addError(`Value out of range (must be between 0x0000 and 0xFFFF)`, stmt.p2.loc);
        return;
      }
      this.emit(opcode);
      this.emit((addr & 65280) >> 8);
      this.emit(addr & 255);
    } else {
      if (!opc.p2) {
        this.addError(`Internal opcode definition error`, stmt.loc);
        return;
      }
      const val = this.checkLiteral(stmt.p2, -16, 15);
      if (val === void 0) {
        return;
      }
      opcode |= opc.p2.op(val);
      this.emit(opcode);
    }
  }
  assembleLoadStoreInstr(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    let opcode = opc.op;
    if (!stmt.p1 || !opc.p1) {
      this.addError(`Parameter required`, stmt.loc);
      return;
    }
    const tgt = this.checkRegister(stmt.p1, opc.p1);
    if (tgt === void 0) {
      return;
    }
    opcode |= opc.p1.op(tgt);
    this.emit(opcode);
  }
  checkRegister(given, available, furtherAvailable = void 0) {
    if (given.type !== "register") {
      this.addError(`Register required`, given.loc);
    } else {
      const reg = available.cs?.[given.value] ?? furtherAvailable?.cs?.[given.value];
      if (reg === void 0) {
        if (available.cs) {
          if (furtherAvailable && furtherAvailable.cs) {
            this.addError(`Invalid register - choose one of [${Object.keys(available.cs).join("|")}] or [${Object.keys(furtherAvailable.cs).join("|")}]`, given.loc);
          } else {
            this.addError(`Invalid register - choose one of [${Object.keys(available.cs).join("|")}]`, given.loc);
          }
        } else {
          this.addError(`Invalid register`, given.loc);
        }
      }
      return reg;
    }
    return void 0;
  }
  hasRegister(given, available) {
    if (given.type !== "register") {
      return false;
    } else {
      const reg = available.cs?.[given.value];
      return reg !== void 0;
    }
  }
  checkLiteral(given, min, max, rangeDisplay = "d") {
    const ev = this.evalExprToInt(given, "value");
    if (!anyErrors(ev)) {
      const val = ev.value;
      if (val < min || val > max) {
        let range = "";
        switch (rangeDisplay) {
          case "b": {
            const maxb = max.toString(2);
            const minb = ("0".repeat(maxb.length) + min.toString(2)).slice(-maxb.length);
            range = `${minb}b and ${maxb}b`;
            break;
          }
          case "h": {
            const maxh = max.toString(16).toUpperCase();
            const minh = ("0".repeat(maxh.length) + min.toString(16).toUpperCase()).slice(-maxh.length);
            range = `0x${minh} and 0x${maxh}`;
            break;
          }
          default:
            range = `${min} and ${max}`;
        }
        this.addError(`Literal out of range (must be between ${range})`, given.loc);
      } else {
        return val;
      }
    }
    return void 0;
  }
  assembleBranch(mne, stmt) {
    const opc = mne.ops[0];
    if (stmt.p2) {
      this.addWarning(`Parameter not required`, stmt.p2.loc);
    }
    if (!stmt.p1) {
      this.addError(`Parameter required`, stmt.loc);
      return;
    }
    const ev = this.evalExpr(stmt.p1);
    if (anyErrors(ev)) {
      return;
    }
    if (typeof ev.value !== "number") {
      this.addError(`Expecting branch label to evaluate to integer, got ${formatTypename(ev.value)}`, stmt.p1.loc);
      return;
    }
    const { value: addr } = ev;
    this.emit(opc.op);
    this.emit((addr & 65280) >> 8);
    this.emit(addr & 255);
  }
  handleSetPC(valueExpr) {
    const ev = this.evalExprToInt(valueExpr, "pc");
    if (!anyErrors(ev)) {
      const { value: v, completeFirstPass } = ev;
      if (!completeFirstPass) {
        this.addError("Value for new program counter must evaluate to a value in the first pass", valueExpr.loc);
        return;
      }
      if (!this.curSegment.empty() && this.curSegment.currentPC() > v) {
        this.addError(`Cannot set program counter to a smaller value than current (current: $${toHex16(this.curSegment.currentPC())}, trying to set $${toHex16(v)})`, valueExpr.loc);
      }
      const err = this.curSegment.setCurrentPC(v);
      if (err !== void 0) {
        this.addError(err, valueExpr.loc);
      }
    }
  }
  emit8or16(v, bits) {
    if (bits === 8) {
      this.emit(v);
      return;
    }
    this.emit16(v);
  }
  emitData(exprList, bits) {
    const maxval = Math.pow(2, bits);
    for (let i = 0; i < exprList.length; i++) {
      const ee = this.evalExpr(exprList[i]);
      if (anyErrors(ee)) {
        continue;
      }
      const { value: e } = ee;
      if (typeof e === "number") {
        if (e >= maxval) {
          this.addError(`Data out of range for ${bits} bits`, exprList[i].loc);
        } else {
          this.emit8or16(e, bits);
        }
      } else if (typeof e === "string") {
        const vs = e.split("").map((c) => c.charCodeAt(0));
        if (vs.find((n) => n >= maxval)) {
          this.addError(`Data contains character out of range for ${bits} bits`, exprList[i].loc);
        } else {
          vs.forEach((v) => this.emit8or16(v, bits));
        }
      } else {
        this.addError(`Only literal types can be emitted. Got ${formatTypename(e)}`, exprList[i].loc);
      }
    }
  }
  fillBytes(n) {
    const numVals = this.evalExprToInt(n.numBytes, "!fill num_bytes");
    const fillValue = this.evalExprToInt(n.fillValue, "!fill value");
    if (anyErrors(numVals, fillValue)) {
      return;
    }
    const { value: fv } = fillValue;
    if (fv < 0 || fv >= 256) {
      this.addError(`!fill value to repeat must be in 8-bit range, '${fv}' given`, n.fillValue.loc);
      return;
    }
    const nb = numVals.value;
    if (nb < 0) {
      this.addError(`!fill repeat count must be >= 0, got ${nb}`, n.numBytes.loc);
      return;
    }
    for (let i = 0; i < nb; i++) {
      this.emit(fv);
    }
  }
  alignBytes(n) {
    const v = this.evalExprToInt(n.alignBytes, "alignment");
    if (anyErrors(v)) {
      return;
    }
    const { value: nb } = v;
    if (nb < 1) {
      this.addError(`Alignment must be a positive integer, ${nb} given`, n.alignBytes.loc);
      return;
    }
    if ((nb & nb - 1) != 0) {
      this.addError(`Alignment must be a power of two, ${nb} given`, n.loc);
      return;
    }
    while ((this.getPC() & nb - 1) != 0) {
      this.emit(0);
    }
  }
  withLabelScope(name, compileScope, _parent) {
    this.scopes.withLabelScope(name, compileScope);
  }
  checkDirectives(node, _localScopeName) {
    switch (node.type) {
      case "data": {
        this.emitData(node.values, node.dataSize === DataSize.Byte ? 8 : 16);
        break;
      }
      case "fill": {
        this.fillBytes(node);
        break;
      }
      case "align": {
        this.alignBytes(node);
        break;
      }
      case "setpc": {
        this.handleSetPC(node.pc);
        break;
      }
      default:
        this.addError(`unknown directive ${node.type}`, node.loc);
        return;
    }
  }
  assembleLines(lst) {
    if (lst === null || lst.length === 0) {
      return;
    }
    if (lst.length === 0) {
      return;
    }
    const assemble2 = (lines) => {
      for (let i = 0; i < lines.length; i++) {
        this.debugInfo.startLine(lines[i].loc, this.getPC(), this.curSegment);
        this.assembleLine(lines[i]);
        this.debugInfo.endLine(this.getPC(), this.curSegment);
      }
    };
    let firstLine = 0;
    while (firstLine < lst.length) {
      const { label, stmt } = lst[firstLine];
      if (label === null && stmt === null) {
        firstLine++;
      } else {
        break;
      }
    }
    if (firstLine >= lst.length) {
      return;
    }
    return assemble2(lst);
  }
  checkAndDeclareLabel(label) {
    if (this.scopes.symbolSeen(label.name)) {
      this.addError(`Symbol '${label.name}' already defined`, label.loc);
    } else {
      const labelChanged = this.scopes.declareLabelSymbol(label, this.getPC(), this.curSegment);
      if (labelChanged) {
        this.needPass = true;
      }
    }
  }
  assembleLine(line) {
    this.lineLoc = line.loc;
    if (line.label === null && line.stmt === null && line.scopedStmts === null) {
      return;
    }
    if (line.label !== null) {
      this.checkAndDeclareLabel(line.label);
    }
    const scopedStmts = line.scopedStmts;
    if (scopedStmts != null) {
      if (!line.label) {
        throw new Error("ICE: line.label cannot be undefined");
      }
      this.withLabelScope(line.label.name, () => {
        this.assembleLines(scopedStmts);
      });
      return;
    }
    if (line.stmt === null) {
      return;
    }
    if (line.stmt.type !== "insn") {
      this.checkDirectives(line.stmt, line.label === null ? null : line.label.name);
      return;
    }
    const stmt = line.stmt;
    const mne = mnemonics[stmt.mnemonic.toLocaleLowerCase()];
    const withMarkAsInsn = (f) => {
      const startPC = this.getPC();
      f();
      const endPC = this.getPC();
      this.debugInfo.markAsInstruction(startPC, endPC);
    };
    if (mne !== void 0) {
      withMarkAsInsn(() => {
        switch (mne.mt) {
          case MnemonicType.Direct:
            this.assembleNonInstr(mne, stmt);
            break;
          case MnemonicType.Alu:
            this.assembleAluInstr(mne, stmt);
            break;
          case MnemonicType.Clear:
            this.assembleClrInstr(mne, stmt);
            break;
          case MnemonicType.Move:
            this.assembleMovInstr(mne, stmt);
            break;
          case MnemonicType.LitOpc:
            this.assembleLitOpc(mne, stmt);
            break;
          case MnemonicType.LodSw:
            this.assembleLodSwInstr(mne, stmt);
            break;
          case MnemonicType.Set:
            this.assembleSetInstr(mne, stmt);
            break;
          case MnemonicType.LoadStore:
            this.assembleLoadStoreInstr(mne, stmt);
            break;
          case MnemonicType.Goto:
            this.assembleBranch(mne, stmt);
            break;
          default:
            this.addError(`Couldn't encode instruction '${stmt.mnemonic} '`, line.loc);
        }
      });
    } else {
      this.addError(`Unknown mnemonic '${stmt.mnemonic}'`, stmt.loc);
    }
  }
  assemble(source) {
    try {
      const program = parser.parse(source.toString());
      if (program !== void 0 && program.lines) {
        this.assembleLines(program.lines);
      }
    } catch (err) {
      if ("name" in err && err.name === "SyntaxError") {
        this.addError(`Syntax error: ${err.message}`, {
          ...err.location
        });
      } else if ("name" in err && err.name === "semantic") {
        return;
      } else {
        throw err;
      }
    }
  }
  dumpLabels() {
    return this.scopes.dumpLabels(this.getPC(), this.segments);
  }
  collectSegmentInfo() {
    return collectSegmentInfo(this.segments);
  }
};
function parseOnly(source) {
  try {
    return parser.parse(source.toString());
  } catch {
    return;
  }
}
function assemble(source) {
  const asm = new Assembler();
  let pass = 0;
  do {
    asm.startPass(pass);
    asm.assemble(source);
    if (pass > 0 && asm.anyErrors()) {
      return {
        prg: Uint8Array.from([]),
        labels: [],
        segments: [],
        debugInfo: void 0,
        errors: asm.errors(),
        warnings: asm.warnings()
      };
    }
    pass += 1;
  } while (asm.needPass);
  return {
    prg: asm.prg(),
    errors: asm.errors(),
    warnings: asm.warnings(),
    labels: asm.dumpLabels(),
    segments: asm.collectSegmentInfo(),
    debugInfo: asm.debugInfo
  };
}

// ../rcasm-languageservice/lib/esm/parser/rcasmNodes.js
var NodeType;
(function(NodeType2) {
  NodeType2[NodeType2["Program"] = 0] = "Program";
  NodeType2[NodeType2["Line"] = 1] = "Line";
  NodeType2[NodeType2["Label"] = 2] = "Label";
  NodeType2[NodeType2["LabelRef"] = 3] = "LabelRef";
  NodeType2[NodeType2["Instruction"] = 4] = "Instruction";
  NodeType2[NodeType2["Literal"] = 5] = "Literal";
  NodeType2[NodeType2["Register"] = 6] = "Register";
  NodeType2[NodeType2["SetPC"] = 7] = "SetPC";
  NodeType2[NodeType2["Expr"] = 8] = "Expr";
  NodeType2[NodeType2["Directive"] = 9] = "Directive";
  NodeType2[NodeType2["Fill"] = 10] = "Fill";
  NodeType2[NodeType2["Scope"] = 11] = "Scope";
  NodeType2[NodeType2["Expression"] = 12] = "Expression";
})(NodeType || (NodeType = {}));
var ReferenceType;
(function(ReferenceType2) {
  ReferenceType2[ReferenceType2["Label"] = 0] = "Label";
})(ReferenceType || (ReferenceType = {}));
function getNodeAtOffset(node, offset) {
  let candidate = null;
  if (!node || offset < node.offset || offset > node.end) {
    return null;
  }
  node.accept((node2) => {
    if (node2.offset === -1 && node2.length === -1) {
      return true;
    }
    if (node2.offset <= offset && node2.end >= offset) {
      if (!candidate) {
        candidate = node2;
      } else if (node2.length <= candidate.length) {
        candidate = node2;
      }
      return true;
    }
    return false;
  });
  return candidate;
}
function getNodePath(node, offset) {
  let candidate = getNodeAtOffset(node, offset);
  const path = [];
  while (candidate) {
    path.unshift(candidate);
    candidate = candidate.parent;
  }
  return path;
}
var Node = class {
  get end() {
    return this.offset + this.length;
  }
  constructor(rnode, nodeType) {
    this.nodeType = nodeType;
    this.parent = null;
    this.offset = rnode?.loc.start.offset ?? 0;
    this.length = (rnode?.loc.end.offset ?? 0) - this.offset;
  }
  get type() {
    return this.nodeType;
  }
  getTextProvider() {
    let node = this;
    while (node && !node.textProvider) {
      node = node.parent;
    }
    if (node) {
      return node.textProvider;
    }
    return () => {
      return "unknown";
    };
  }
  getText() {
    return this.getTextProvider()(this.offset, this.length);
  }
  matches(str) {
    return this.length === str.length && this.getTextProvider()(this.offset, this.length) === str;
  }
  accept(visitor) {
    if (visitor(this) && this.children) {
      for (const child of this.children) {
        child.accept(visitor);
      }
    }
  }
  acceptVisitor(visitor) {
    this.accept(visitor.visitNode.bind(visitor));
  }
  adoptChild(node) {
    node.parent = this;
    let children = this.children;
    if (!children) {
      children = this.children = [];
    }
    children.push(node);
    return node;
  }
};
var Program = class extends Node {
  constructor(p) {
    super(p, NodeType.Program);
    p?.lines?.forEach((l) => this.adoptChild(new Line(l)));
  }
};
var Line = class extends Node {
  constructor(l) {
    super(l, NodeType.Line);
    if (l.label) {
      this.adoptChild(new Label(l.label));
    }
    if (l.scopedStmts) {
      this.adoptChild(new Scope(l));
    }
    if (l.stmt) {
      switch (l.stmt.type) {
        case "insn":
          this.adoptChild(new Instruction(l.stmt));
          break;
        case "setpc":
          this.adoptChild(new SetPC(l.stmt));
          break;
        case "data":
          this.adoptChild(new DataDirective(l.stmt));
          break;
        case "fill":
          this.adoptChild(new FillDirective(l.stmt));
          break;
        case "align":
          this.adoptChild(new AlignDirective(l.stmt));
      }
    }
  }
};
var Label = class extends Node {
  constructor(l) {
    super(l, NodeType.Label);
    this.length = l.name.length;
  }
  getName() {
    return this.getText();
  }
};
var Scope = class extends Node {
  constructor(ss) {
    super(ss, NodeType.Scope);
    ss.scopedStmts.forEach((s) => {
      this.adoptChild(new Line(s));
    });
  }
};
var SetPC = class extends Node {
  constructor(spc) {
    super(spc, NodeType.SetPC);
    this.pcExpr = this.adoptChild(new Expression(spc.pc));
  }
};
var DataDirective = class extends Node {
  constructor(d) {
    super(d, NodeType.Directive);
  }
};
var FillDirective = class extends Node {
  constructor(d) {
    super(d, NodeType.Directive);
  }
};
var AlignDirective = class extends Node {
  constructor(d) {
    super(d, NodeType.Directive);
  }
};
var Instruction = class extends Node {
  constructor(si) {
    super(si, NodeType.Instruction);
    const addParam = (p) => {
      switch (p.type) {
        case "literal":
          return this.adoptChild(new Literal(p));
        case "register":
          return this.adoptChild(new Register(p));
        case "qualified-ident":
          return this.adoptChild(new LabelRef(p));
        default:
          return this.adoptChild(new Expression(p));
      }
    };
    this.mnemonic = si.mnemonic.toLowerCase();
    if (si.p1) {
      this.p1 = addParam(si.p1);
    }
    if (si.p2) {
      this.p2 = addParam(si.p2);
    }
  }
};
var LabelRef = class extends Node {
  constructor(sqi) {
    super(sqi, NodeType.LabelRef);
    this.length = sqi.path.at(-1).length;
  }
};
var Literal = class extends Node {
  constructor(l) {
    super(l, NodeType.Literal);
    this.value = l.lit;
  }
};
var Expression = class extends Node {
  constructor(e) {
    super(e, NodeType.Expression);
  }
};
var Register = class extends Node {
  constructor(r) {
    super(r, NodeType.Register);
    this.value = r.value.toUpperCase();
  }
};

// ../rcasm-languageservice/lib/esm/parser/rcasmParser.js
var RCASMParser = class {
  parseProgram(textDocument) {
    const versionId = textDocument.version;
    const text = textDocument.getText();
    const program = parseOnly(textDocument.getText());
    const root = new Program(program);
    const textProvider = (offset, length) => {
      if (textDocument.version !== versionId) {
        throw new Error("Underlying model has changed, AST is no longer valid");
      }
      return text.substring(offset, offset + length);
    };
    root.textProvider = textProvider;
    return root;
  }
};

// ../rcasm-languageservice/lib/esm/languageFacts/entry.js
function getEntryDescription(entry, doesSupportMarkdown) {
  let result;
  if (doesSupportMarkdown) {
    result = {
      kind: "markdown",
      value: getEntryMarkdownDescription(entry)
    };
  } else {
    result = {
      kind: "plaintext",
      value: getEntryStringDescription(entry)
    };
  }
  if (result.value === "") {
    return void 0;
  }
  return result;
}
function getEntryStringDescription(entry) {
  if (!entry.description || entry.description === "") {
    return "";
  }
  let result = `${entry.summary}

${entry.description}`;
  if ("syntax" in entry) {
    result += `

Syntax: ${entry.syntax}`;
  }
  if ("variants" in entry && entry.variants) {
    entry.variants.forEach((variant) => {
      result += `


${entry.summary}

${variant.description}`;
      if ("syntax" in variant) {
        result += `

Syntax: ${variant.syntax}`;
      }
    });
  }
  return result;
}
function getEntryMarkdownDescription(entry) {
  if (!entry.description || entry.description === "") {
    return "";
  }
  let result = `__${entry.summary}__  
${entry.description}`;
  if ("syntax" in entry) {
    result += `  
Syntax: \`${entry.syntax}\``;
  }
  if ("variants" in entry && entry.variants) {
    entry.variants.forEach((variant) => {
      result += `
___
__${variant.summary}__  
${variant.description}`;
      if ("syntax" in variant) {
        result += `  
Syntax: \`${variant.syntax}\``;
      }
    });
  }
  return result;
}
function getEntrySpecificDescription(entry, paramNames, doesSupportMarkdown) {
  let result;
  if (doesSupportMarkdown) {
    result = {
      kind: "markdown",
      value: fillParamPlaceholders(getEntrySpecificMarkdownDescription(entry, paramNames), paramNames)
    };
  } else {
    result = {
      kind: "plaintext",
      value: fillParamPlaceholders(getEntrySpecificStringDescription(entry, paramNames), paramNames)
    };
  }
  if (result.value === "") {
    return void 0;
  }
  return result;
}
function fillParamPlaceholders(value, paramNames) {
  if (!paramNames || paramNames.length === 0) {
    return value;
  }
  for (let i = 0; i < paramNames.length; i++) {
    value = value.replace(`{${i}}`, paramNames[i]);
  }
  return value;
}
function findVariantMatch(entry, paramNames) {
  if (!entry.variants || entry.variants.length === 0 || !paramNames || paramNames.length === 0) {
    return void 0;
  }
  for (let i = 0; i < entry.variants.length; i++) {
    var idx = entry.variants[i].whenFirstParamIs.indexOf(paramNames[0].toLowerCase());
    if (idx !== -1) {
      return entry.variants[i];
    }
  }
  return void 0;
}
function getEntrySpecificStringDescription(entry, paramNames) {
  if (!("synopsis" in entry) || !entry.synopsis || entry.synopsis === "") {
    return "";
  }
  const variant = findVariantMatch(entry, paramNames);
  const summary = variant ? variant.summary : entry.summary;
  const cls = variant ? variant.class : entry.class;
  const cycles = variant ? variant.cycles : entry.cycles;
  const desc = variant ? variant.description : entry.description;
  return `${summary} ${cls} ${cycles}

${desc}

Synopsis: ${entry.synopsis}`;
}
function getEntrySpecificMarkdownDescription(entry, paramNames) {
  if (!("synopsis" in entry) || !entry.synopsis || entry.synopsis === "") {
    return "";
  }
  const variant = findVariantMatch(entry, paramNames);
  const summary = variant ? variant.summary : entry.summary;
  const cls = variant ? variant.class : entry.class;
  const cycles = variant ? variant.cycles : entry.cycles;
  const desc = variant ? variant.description : entry.description;
  return `__${summary}__ ${cls} ${cycles}  
${desc}  
Synopsis: \`${entry.synopsis}\``;
}

// ../rcasm-languageservice/node_modules/vscode-languageserver-types/lib/esm/main.js
var DocumentUri;
(function(DocumentUri2) {
  function is(value) {
    return typeof value === "string";
  }
  DocumentUri2.is = is;
})(DocumentUri || (DocumentUri = {}));
var URI;
(function(URI2) {
  function is(value) {
    return typeof value === "string";
  }
  URI2.is = is;
})(URI || (URI = {}));
var integer;
(function(integer2) {
  integer2.MIN_VALUE = -2147483648;
  integer2.MAX_VALUE = 2147483647;
  function is(value) {
    return typeof value === "number" && integer2.MIN_VALUE <= value && value <= integer2.MAX_VALUE;
  }
  integer2.is = is;
})(integer || (integer = {}));
var uinteger;
(function(uinteger2) {
  uinteger2.MIN_VALUE = 0;
  uinteger2.MAX_VALUE = 2147483647;
  function is(value) {
    return typeof value === "number" && uinteger2.MIN_VALUE <= value && value <= uinteger2.MAX_VALUE;
  }
  uinteger2.is = is;
})(uinteger || (uinteger = {}));
var Position;
(function(Position2) {
  function create(line, character) {
    if (line === Number.MAX_VALUE) {
      line = uinteger.MAX_VALUE;
    }
    if (character === Number.MAX_VALUE) {
      character = uinteger.MAX_VALUE;
    }
    return { line, character };
  }
  Position2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
  }
  Position2.is = is;
})(Position || (Position = {}));
var Range;
(function(Range2) {
  function create(one, two, three, four) {
    if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
      return { start: Position.create(one, two), end: Position.create(three, four) };
    } else if (Position.is(one) && Position.is(two)) {
      return { start: one, end: two };
    } else {
      throw new Error(`Range#create called with invalid arguments[${one}, ${two}, ${three}, ${four}]`);
    }
  }
  Range2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
  }
  Range2.is = is;
})(Range || (Range = {}));
var Location;
(function(Location2) {
  function create(uri, range) {
    return { uri, range };
  }
  Location2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
  }
  Location2.is = is;
})(Location || (Location = {}));
var LocationLink;
(function(LocationLink2) {
  function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
    return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
  }
  LocationLink2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range.is(candidate.targetSelectionRange) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
  }
  LocationLink2.is = is;
})(LocationLink || (LocationLink = {}));
var Color;
(function(Color2) {
  function create(red, green, blue, alpha) {
    return {
      red,
      green,
      blue,
      alpha
    };
  }
  Color2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
  }
  Color2.is = is;
})(Color || (Color = {}));
var ColorInformation;
(function(ColorInformation2) {
  function create(range, color) {
    return {
      range,
      color
    };
  }
  ColorInformation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Range.is(candidate.range) && Color.is(candidate.color);
  }
  ColorInformation2.is = is;
})(ColorInformation || (ColorInformation = {}));
var ColorPresentation;
(function(ColorPresentation2) {
  function create(label, textEdit, additionalTextEdits) {
    return {
      label,
      textEdit,
      additionalTextEdits
    };
  }
  ColorPresentation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
  }
  ColorPresentation2.is = is;
})(ColorPresentation || (ColorPresentation = {}));
var FoldingRangeKind;
(function(FoldingRangeKind2) {
  FoldingRangeKind2.Comment = "comment";
  FoldingRangeKind2.Imports = "imports";
  FoldingRangeKind2.Region = "region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
var FoldingRange;
(function(FoldingRange2) {
  function create(startLine, endLine, startCharacter, endCharacter, kind, collapsedText) {
    const result = {
      startLine,
      endLine
    };
    if (Is.defined(startCharacter)) {
      result.startCharacter = startCharacter;
    }
    if (Is.defined(endCharacter)) {
      result.endCharacter = endCharacter;
    }
    if (Is.defined(kind)) {
      result.kind = kind;
    }
    if (Is.defined(collapsedText)) {
      result.collapsedText = collapsedText;
    }
    return result;
  }
  FoldingRange2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
  }
  FoldingRange2.is = is;
})(FoldingRange || (FoldingRange = {}));
var DiagnosticRelatedInformation;
(function(DiagnosticRelatedInformation2) {
  function create(location, message) {
    return {
      location,
      message
    };
  }
  DiagnosticRelatedInformation2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
  }
  DiagnosticRelatedInformation2.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
var DiagnosticSeverity;
(function(DiagnosticSeverity2) {
  DiagnosticSeverity2.Error = 1;
  DiagnosticSeverity2.Warning = 2;
  DiagnosticSeverity2.Information = 3;
  DiagnosticSeverity2.Hint = 4;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
var DiagnosticTag;
(function(DiagnosticTag2) {
  DiagnosticTag2.Unnecessary = 1;
  DiagnosticTag2.Deprecated = 2;
})(DiagnosticTag || (DiagnosticTag = {}));
var CodeDescription;
(function(CodeDescription2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.href);
  }
  CodeDescription2.is = is;
})(CodeDescription || (CodeDescription = {}));
var Diagnostic;
(function(Diagnostic2) {
  function create(range, message, severity, code, source, relatedInformation) {
    let result = { range, message };
    if (Is.defined(severity)) {
      result.severity = severity;
    }
    if (Is.defined(code)) {
      result.code = code;
    }
    if (Is.defined(source)) {
      result.source = source;
    }
    if (Is.defined(relatedInformation)) {
      result.relatedInformation = relatedInformation;
    }
    return result;
  }
  Diagnostic2.create = create;
  function is(value) {
    var _a;
    let candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
  }
  Diagnostic2.is = is;
})(Diagnostic || (Diagnostic = {}));
var Command;
(function(Command2) {
  function create(title, command, ...args) {
    let result = { title, command };
    if (Is.defined(args) && args.length > 0) {
      result.arguments = args;
    }
    return result;
  }
  Command2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
  }
  Command2.is = is;
})(Command || (Command = {}));
var TextEdit;
(function(TextEdit2) {
  function replace(range, newText) {
    return { range, newText };
  }
  TextEdit2.replace = replace;
  function insert(position, newText) {
    return { range: { start: position, end: position }, newText };
  }
  TextEdit2.insert = insert;
  function del(range) {
    return { range, newText: "" };
  }
  TextEdit2.del = del;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
  }
  TextEdit2.is = is;
})(TextEdit || (TextEdit = {}));
var ChangeAnnotation;
(function(ChangeAnnotation2) {
  function create(label, needsConfirmation, description) {
    const result = { label };
    if (needsConfirmation !== void 0) {
      result.needsConfirmation = needsConfirmation;
    }
    if (description !== void 0) {
      result.description = description;
    }
    return result;
  }
  ChangeAnnotation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
  }
  ChangeAnnotation2.is = is;
})(ChangeAnnotation || (ChangeAnnotation = {}));
var ChangeAnnotationIdentifier;
(function(ChangeAnnotationIdentifier2) {
  function is(value) {
    const candidate = value;
    return Is.string(candidate);
  }
  ChangeAnnotationIdentifier2.is = is;
})(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
var AnnotatedTextEdit;
(function(AnnotatedTextEdit2) {
  function replace(range, newText, annotation) {
    return { range, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.replace = replace;
  function insert(position, newText, annotation) {
    return { range: { start: position, end: position }, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.insert = insert;
  function del(range, annotation) {
    return { range, newText: "", annotationId: annotation };
  }
  AnnotatedTextEdit2.del = del;
  function is(value) {
    const candidate = value;
    return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  AnnotatedTextEdit2.is = is;
})(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
var TextDocumentEdit;
(function(TextDocumentEdit2) {
  function create(textDocument, edits) {
    return { textDocument, edits };
  }
  TextDocumentEdit2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
  }
  TextDocumentEdit2.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var CreateFile;
(function(CreateFile2) {
  function create(uri, options, annotation) {
    let result = {
      kind: "create",
      uri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  CreateFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  CreateFile2.is = is;
})(CreateFile || (CreateFile = {}));
var RenameFile;
(function(RenameFile2) {
  function create(oldUri, newUri, options, annotation) {
    let result = {
      kind: "rename",
      oldUri,
      newUri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  RenameFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  RenameFile2.is = is;
})(RenameFile || (RenameFile = {}));
var DeleteFile;
(function(DeleteFile2) {
  function create(uri, options, annotation) {
    let result = {
      kind: "delete",
      uri
    };
    if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  DeleteFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  DeleteFile2.is = is;
})(DeleteFile || (DeleteFile = {}));
var WorkspaceEdit;
(function(WorkspaceEdit2) {
  function is(value) {
    let candidate = value;
    return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every((change) => {
      if (Is.string(change.kind)) {
        return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
      } else {
        return TextDocumentEdit.is(change);
      }
    }));
  }
  WorkspaceEdit2.is = is;
})(WorkspaceEdit || (WorkspaceEdit = {}));
var TextDocumentIdentifier;
(function(TextDocumentIdentifier2) {
  function create(uri) {
    return { uri };
  }
  TextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri);
  }
  TextDocumentIdentifier2.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
var VersionedTextDocumentIdentifier;
(function(VersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  VersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
  }
  VersionedTextDocumentIdentifier2.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
var OptionalVersionedTextDocumentIdentifier;
(function(OptionalVersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  OptionalVersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
  }
  OptionalVersionedTextDocumentIdentifier2.is = is;
})(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
var TextDocumentItem;
(function(TextDocumentItem2) {
  function create(uri, languageId, version, text) {
    return { uri, languageId, version, text };
  }
  TextDocumentItem2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
  }
  TextDocumentItem2.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
var MarkupKind;
(function(MarkupKind2) {
  MarkupKind2.PlainText = "plaintext";
  MarkupKind2.Markdown = "markdown";
  function is(value) {
    const candidate = value;
    return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
  }
  MarkupKind2.is = is;
})(MarkupKind || (MarkupKind = {}));
var MarkupContent;
(function(MarkupContent2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
  }
  MarkupContent2.is = is;
})(MarkupContent || (MarkupContent = {}));
var CompletionItemKind;
(function(CompletionItemKind2) {
  CompletionItemKind2.Text = 1;
  CompletionItemKind2.Method = 2;
  CompletionItemKind2.Function = 3;
  CompletionItemKind2.Constructor = 4;
  CompletionItemKind2.Field = 5;
  CompletionItemKind2.Variable = 6;
  CompletionItemKind2.Class = 7;
  CompletionItemKind2.Interface = 8;
  CompletionItemKind2.Module = 9;
  CompletionItemKind2.Property = 10;
  CompletionItemKind2.Unit = 11;
  CompletionItemKind2.Value = 12;
  CompletionItemKind2.Enum = 13;
  CompletionItemKind2.Keyword = 14;
  CompletionItemKind2.Snippet = 15;
  CompletionItemKind2.Color = 16;
  CompletionItemKind2.File = 17;
  CompletionItemKind2.Reference = 18;
  CompletionItemKind2.Folder = 19;
  CompletionItemKind2.EnumMember = 20;
  CompletionItemKind2.Constant = 21;
  CompletionItemKind2.Struct = 22;
  CompletionItemKind2.Event = 23;
  CompletionItemKind2.Operator = 24;
  CompletionItemKind2.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
var InsertTextFormat;
(function(InsertTextFormat2) {
  InsertTextFormat2.PlainText = 1;
  InsertTextFormat2.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
var CompletionItemTag;
(function(CompletionItemTag2) {
  CompletionItemTag2.Deprecated = 1;
})(CompletionItemTag || (CompletionItemTag = {}));
var InsertReplaceEdit;
(function(InsertReplaceEdit2) {
  function create(newText, insert, replace) {
    return { newText, insert, replace };
  }
  InsertReplaceEdit2.create = create;
  function is(value) {
    const candidate = value;
    return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
  }
  InsertReplaceEdit2.is = is;
})(InsertReplaceEdit || (InsertReplaceEdit = {}));
var InsertTextMode;
(function(InsertTextMode2) {
  InsertTextMode2.asIs = 1;
  InsertTextMode2.adjustIndentation = 2;
})(InsertTextMode || (InsertTextMode = {}));
var CompletionItemLabelDetails;
(function(CompletionItemLabelDetails2) {
  function is(value) {
    const candidate = value;
    return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
  }
  CompletionItemLabelDetails2.is = is;
})(CompletionItemLabelDetails || (CompletionItemLabelDetails = {}));
var CompletionItem;
(function(CompletionItem2) {
  function create(label) {
    return { label };
  }
  CompletionItem2.create = create;
})(CompletionItem || (CompletionItem = {}));
var CompletionList;
(function(CompletionList2) {
  function create(items, isIncomplete) {
    return { items: items ? items : [], isIncomplete: !!isIncomplete };
  }
  CompletionList2.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function(MarkedString2) {
  function fromPlainText(plainText) {
    return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  MarkedString2.fromPlainText = fromPlainText;
  function is(value) {
    const candidate = value;
    return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
  }
  MarkedString2.is = is;
})(MarkedString || (MarkedString = {}));
var Hover;
(function(Hover2) {
  function is(value) {
    let candidate = value;
    return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
  }
  Hover2.is = is;
})(Hover || (Hover = {}));
var ParameterInformation;
(function(ParameterInformation2) {
  function create(label, documentation) {
    return documentation ? { label, documentation } : { label };
  }
  ParameterInformation2.create = create;
})(ParameterInformation || (ParameterInformation = {}));
var SignatureInformation;
(function(SignatureInformation2) {
  function create(label, documentation, ...parameters) {
    let result = { label };
    if (Is.defined(documentation)) {
      result.documentation = documentation;
    }
    if (Is.defined(parameters)) {
      result.parameters = parameters;
    } else {
      result.parameters = [];
    }
    return result;
  }
  SignatureInformation2.create = create;
})(SignatureInformation || (SignatureInformation = {}));
var DocumentHighlightKind;
(function(DocumentHighlightKind2) {
  DocumentHighlightKind2.Text = 1;
  DocumentHighlightKind2.Read = 2;
  DocumentHighlightKind2.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
var DocumentHighlight;
(function(DocumentHighlight2) {
  function create(range, kind) {
    let result = { range };
    if (Is.number(kind)) {
      result.kind = kind;
    }
    return result;
  }
  DocumentHighlight2.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
var SymbolKind;
(function(SymbolKind2) {
  SymbolKind2.File = 1;
  SymbolKind2.Module = 2;
  SymbolKind2.Namespace = 3;
  SymbolKind2.Package = 4;
  SymbolKind2.Class = 5;
  SymbolKind2.Method = 6;
  SymbolKind2.Property = 7;
  SymbolKind2.Field = 8;
  SymbolKind2.Constructor = 9;
  SymbolKind2.Enum = 10;
  SymbolKind2.Interface = 11;
  SymbolKind2.Function = 12;
  SymbolKind2.Variable = 13;
  SymbolKind2.Constant = 14;
  SymbolKind2.String = 15;
  SymbolKind2.Number = 16;
  SymbolKind2.Boolean = 17;
  SymbolKind2.Array = 18;
  SymbolKind2.Object = 19;
  SymbolKind2.Key = 20;
  SymbolKind2.Null = 21;
  SymbolKind2.EnumMember = 22;
  SymbolKind2.Struct = 23;
  SymbolKind2.Event = 24;
  SymbolKind2.Operator = 25;
  SymbolKind2.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
var SymbolTag;
(function(SymbolTag2) {
  SymbolTag2.Deprecated = 1;
})(SymbolTag || (SymbolTag = {}));
var SymbolInformation;
(function(SymbolInformation2) {
  function create(name, kind, range, uri, containerName) {
    let result = {
      name,
      kind,
      location: { uri, range }
    };
    if (containerName) {
      result.containerName = containerName;
    }
    return result;
  }
  SymbolInformation2.create = create;
})(SymbolInformation || (SymbolInformation = {}));
var WorkspaceSymbol;
(function(WorkspaceSymbol2) {
  function create(name, kind, uri, range) {
    return range !== void 0 ? { name, kind, location: { uri, range } } : { name, kind, location: { uri } };
  }
  WorkspaceSymbol2.create = create;
})(WorkspaceSymbol || (WorkspaceSymbol = {}));
var DocumentSymbol;
(function(DocumentSymbol2) {
  function create(name, detail, kind, range, selectionRange, children) {
    let result = {
      name,
      detail,
      kind,
      range,
      selectionRange
    };
    if (children !== void 0) {
      result.children = children;
    }
    return result;
  }
  DocumentSymbol2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
  }
  DocumentSymbol2.is = is;
})(DocumentSymbol || (DocumentSymbol = {}));
var CodeActionKind;
(function(CodeActionKind2) {
  CodeActionKind2.Empty = "";
  CodeActionKind2.QuickFix = "quickfix";
  CodeActionKind2.Refactor = "refactor";
  CodeActionKind2.RefactorExtract = "refactor.extract";
  CodeActionKind2.RefactorInline = "refactor.inline";
  CodeActionKind2.RefactorRewrite = "refactor.rewrite";
  CodeActionKind2.Source = "source";
  CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
  CodeActionKind2.SourceFixAll = "source.fixAll";
})(CodeActionKind || (CodeActionKind = {}));
var CodeActionTriggerKind;
(function(CodeActionTriggerKind2) {
  CodeActionTriggerKind2.Invoked = 1;
  CodeActionTriggerKind2.Automatic = 2;
})(CodeActionTriggerKind || (CodeActionTriggerKind = {}));
var CodeActionContext;
(function(CodeActionContext2) {
  function create(diagnostics, only, triggerKind) {
    let result = { diagnostics };
    if (only !== void 0 && only !== null) {
      result.only = only;
    }
    if (triggerKind !== void 0 && triggerKind !== null) {
      result.triggerKind = triggerKind;
    }
    return result;
  }
  CodeActionContext2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
  }
  CodeActionContext2.is = is;
})(CodeActionContext || (CodeActionContext = {}));
var CodeAction;
(function(CodeAction2) {
  function create(title, kindOrCommandOrEdit, kind) {
    let result = { title };
    let checkKind = true;
    if (typeof kindOrCommandOrEdit === "string") {
      checkKind = false;
      result.kind = kindOrCommandOrEdit;
    } else if (Command.is(kindOrCommandOrEdit)) {
      result.command = kindOrCommandOrEdit;
    } else {
      result.edit = kindOrCommandOrEdit;
    }
    if (checkKind && kind !== void 0) {
      result.kind = kind;
    }
    return result;
  }
  CodeAction2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
  }
  CodeAction2.is = is;
})(CodeAction || (CodeAction = {}));
var CodeLens;
(function(CodeLens2) {
  function create(range, data) {
    let result = { range };
    if (Is.defined(data)) {
      result.data = data;
    }
    return result;
  }
  CodeLens2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
  }
  CodeLens2.is = is;
})(CodeLens || (CodeLens = {}));
var FormattingOptions;
(function(FormattingOptions2) {
  function create(tabSize, insertSpaces) {
    return { tabSize, insertSpaces };
  }
  FormattingOptions2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
  }
  FormattingOptions2.is = is;
})(FormattingOptions || (FormattingOptions = {}));
var DocumentLink;
(function(DocumentLink2) {
  function create(range, target, data) {
    return { range, target, data };
  }
  DocumentLink2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
  }
  DocumentLink2.is = is;
})(DocumentLink || (DocumentLink = {}));
var SelectionRange;
(function(SelectionRange2) {
  function create(range, parent) {
    return { range, parent };
  }
  SelectionRange2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
  }
  SelectionRange2.is = is;
})(SelectionRange || (SelectionRange = {}));
var SemanticTokenTypes;
(function(SemanticTokenTypes2) {
  SemanticTokenTypes2["namespace"] = "namespace";
  SemanticTokenTypes2["type"] = "type";
  SemanticTokenTypes2["class"] = "class";
  SemanticTokenTypes2["enum"] = "enum";
  SemanticTokenTypes2["interface"] = "interface";
  SemanticTokenTypes2["struct"] = "struct";
  SemanticTokenTypes2["typeParameter"] = "typeParameter";
  SemanticTokenTypes2["parameter"] = "parameter";
  SemanticTokenTypes2["variable"] = "variable";
  SemanticTokenTypes2["property"] = "property";
  SemanticTokenTypes2["enumMember"] = "enumMember";
  SemanticTokenTypes2["event"] = "event";
  SemanticTokenTypes2["function"] = "function";
  SemanticTokenTypes2["method"] = "method";
  SemanticTokenTypes2["macro"] = "macro";
  SemanticTokenTypes2["keyword"] = "keyword";
  SemanticTokenTypes2["modifier"] = "modifier";
  SemanticTokenTypes2["comment"] = "comment";
  SemanticTokenTypes2["string"] = "string";
  SemanticTokenTypes2["number"] = "number";
  SemanticTokenTypes2["regexp"] = "regexp";
  SemanticTokenTypes2["operator"] = "operator";
  SemanticTokenTypes2["decorator"] = "decorator";
})(SemanticTokenTypes || (SemanticTokenTypes = {}));
var SemanticTokenModifiers;
(function(SemanticTokenModifiers2) {
  SemanticTokenModifiers2["declaration"] = "declaration";
  SemanticTokenModifiers2["definition"] = "definition";
  SemanticTokenModifiers2["readonly"] = "readonly";
  SemanticTokenModifiers2["static"] = "static";
  SemanticTokenModifiers2["deprecated"] = "deprecated";
  SemanticTokenModifiers2["abstract"] = "abstract";
  SemanticTokenModifiers2["async"] = "async";
  SemanticTokenModifiers2["modification"] = "modification";
  SemanticTokenModifiers2["documentation"] = "documentation";
  SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
})(SemanticTokenModifiers || (SemanticTokenModifiers = {}));
var SemanticTokens;
(function(SemanticTokens2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
  }
  SemanticTokens2.is = is;
})(SemanticTokens || (SemanticTokens = {}));
var InlineValueText;
(function(InlineValueText2) {
  function create(range, text) {
    return { range, text };
  }
  InlineValueText2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.string(candidate.text);
  }
  InlineValueText2.is = is;
})(InlineValueText || (InlineValueText = {}));
var InlineValueVariableLookup;
(function(InlineValueVariableLookup2) {
  function create(range, variableName, caseSensitiveLookup) {
    return { range, variableName, caseSensitiveLookup };
  }
  InlineValueVariableLookup2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
  }
  InlineValueVariableLookup2.is = is;
})(InlineValueVariableLookup || (InlineValueVariableLookup = {}));
var InlineValueEvaluatableExpression;
(function(InlineValueEvaluatableExpression2) {
  function create(range, expression) {
    return { range, expression };
  }
  InlineValueEvaluatableExpression2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
  }
  InlineValueEvaluatableExpression2.is = is;
})(InlineValueEvaluatableExpression || (InlineValueEvaluatableExpression = {}));
var InlineValueContext;
(function(InlineValueContext2) {
  function create(frameId, stoppedLocation) {
    return { frameId, stoppedLocation };
  }
  InlineValueContext2.create = create;
  function is(value) {
    const candidate = value;
    return Is.defined(candidate) && Range.is(value.stoppedLocation);
  }
  InlineValueContext2.is = is;
})(InlineValueContext || (InlineValueContext = {}));
var InlayHintKind;
(function(InlayHintKind2) {
  InlayHintKind2.Type = 1;
  InlayHintKind2.Parameter = 2;
  function is(value) {
    return value === 1 || value === 2;
  }
  InlayHintKind2.is = is;
})(InlayHintKind || (InlayHintKind = {}));
var InlayHintLabelPart;
(function(InlayHintLabelPart2) {
  function create(value) {
    return { value };
  }
  InlayHintLabelPart2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.location === void 0 || Location.is(candidate.location)) && (candidate.command === void 0 || Command.is(candidate.command));
  }
  InlayHintLabelPart2.is = is;
})(InlayHintLabelPart || (InlayHintLabelPart = {}));
var InlayHint;
(function(InlayHint2) {
  function create(position, label, kind) {
    const result = { position, label };
    if (kind !== void 0) {
      result.kind = kind;
    }
    return result;
  }
  InlayHint2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Position.is(candidate.position) && (Is.string(candidate.label) || Is.typedArray(candidate.label, InlayHintLabelPart.is)) && (candidate.kind === void 0 || InlayHintKind.is(candidate.kind)) && candidate.textEdits === void 0 || Is.typedArray(candidate.textEdits, TextEdit.is) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.paddingLeft === void 0 || Is.boolean(candidate.paddingLeft)) && (candidate.paddingRight === void 0 || Is.boolean(candidate.paddingRight));
  }
  InlayHint2.is = is;
})(InlayHint || (InlayHint = {}));
var StringValue;
(function(StringValue2) {
  function createSnippet(value) {
    return { kind: "snippet", value };
  }
  StringValue2.createSnippet = createSnippet;
})(StringValue || (StringValue = {}));
var InlineCompletionItem;
(function(InlineCompletionItem2) {
  function create(insertText, filterText, range, command) {
    return { insertText, filterText, range, command };
  }
  InlineCompletionItem2.create = create;
})(InlineCompletionItem || (InlineCompletionItem = {}));
var InlineCompletionList;
(function(InlineCompletionList2) {
  function create(items) {
    return { items };
  }
  InlineCompletionList2.create = create;
})(InlineCompletionList || (InlineCompletionList = {}));
var InlineCompletionTriggerKind;
(function(InlineCompletionTriggerKind2) {
  InlineCompletionTriggerKind2.Invoked = 0;
  InlineCompletionTriggerKind2.Automatic = 1;
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
var SelectedCompletionInfo;
(function(SelectedCompletionInfo2) {
  function create(range, text) {
    return { range, text };
  }
  SelectedCompletionInfo2.create = create;
})(SelectedCompletionInfo || (SelectedCompletionInfo = {}));
var InlineCompletionContext;
(function(InlineCompletionContext2) {
  function create(triggerKind, selectedCompletionInfo) {
    return { triggerKind, selectedCompletionInfo };
  }
  InlineCompletionContext2.create = create;
})(InlineCompletionContext || (InlineCompletionContext = {}));
var WorkspaceFolder;
(function(WorkspaceFolder2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && URI.is(candidate.uri) && Is.string(candidate.name);
  }
  WorkspaceFolder2.is = is;
})(WorkspaceFolder || (WorkspaceFolder = {}));
var TextDocument;
(function(TextDocument3) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }
  TextDocument3.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
  }
  TextDocument3.is = is;
  function applyEdits(document, edits) {
    let text = document.getText();
    let sortedEdits = mergeSort2(edits, (a, b) => {
      let diff = a.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }
      return diff;
    });
    let lastModifiedOffset = text.length;
    for (let i = sortedEdits.length - 1; i >= 0; i--) {
      let e = sortedEdits[i];
      let startOffset = document.offsetAt(e.range.start);
      let endOffset = document.offsetAt(e.range.end);
      if (endOffset <= lastModifiedOffset) {
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
      } else {
        throw new Error("Overlapping edit");
      }
      lastModifiedOffset = startOffset;
    }
    return text;
  }
  TextDocument3.applyEdits = applyEdits;
  function mergeSort2(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    const p = data.length / 2 | 0;
    const left = data.slice(0, p);
    const right = data.slice(p);
    mergeSort2(left, compare);
    mergeSort2(right, compare);
    let leftIdx = 0;
    let rightIdx = 0;
    let i = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      let ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i++] = left[leftIdx++];
      } else {
        data[i++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }
    return data;
  }
})(TextDocument || (TextDocument = {}));
var FullTextDocument = class {
  constructor(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(range) {
    if (range) {
      let start = this.offsetAt(range.start);
      let end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  }
  update(event, version) {
    this._content = event.text;
    this._version = version;
    this._lineOffsets = void 0;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      let lineOffsets = [];
      let text = this._content;
      let isLineStart = true;
      for (let i = 0; i < text.length; i++) {
        if (isLineStart) {
          lineOffsets.push(i);
          isLineStart = false;
        }
        let ch = text.charAt(i);
        isLineStart = ch === "\r" || ch === "\n";
        if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
          i++;
        }
      }
      if (isLineStart && text.length > 0) {
        lineOffsets.push(text.length);
      }
      this._lineOffsets = lineOffsets;
    }
    return this._lineOffsets;
  }
  positionAt(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    let lineOffsets = this.getLineOffsets();
    let low = 0, high = lineOffsets.length;
    if (high === 0) {
      return Position.create(0, offset);
    }
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    let line = low - 1;
    return Position.create(line, offset - lineOffsets[line]);
  }
  offsetAt(position) {
    let lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    let lineOffset = lineOffsets[position.line];
    let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
};
var Is;
(function(Is2) {
  const toString = Object.prototype.toString;
  function defined(value) {
    return typeof value !== "undefined";
  }
  Is2.defined = defined;
  function undefined2(value) {
    return typeof value === "undefined";
  }
  Is2.undefined = undefined2;
  function boolean(value) {
    return value === true || value === false;
  }
  Is2.boolean = boolean;
  function string(value) {
    return toString.call(value) === "[object String]";
  }
  Is2.string = string;
  function number(value) {
    return toString.call(value) === "[object Number]";
  }
  Is2.number = number;
  function numberRange(value, min, max) {
    return toString.call(value) === "[object Number]" && min <= value && value <= max;
  }
  Is2.numberRange = numberRange;
  function integer2(value) {
    return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
  }
  Is2.integer = integer2;
  function uinteger2(value) {
    return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
  }
  Is2.uinteger = uinteger2;
  function func(value) {
    return toString.call(value) === "[object Function]";
  }
  Is2.func = func;
  function objectLiteral(value) {
    return value !== null && typeof value === "object";
  }
  Is2.objectLiteral = objectLiteral;
  function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
  }
  Is2.typedArray = typedArray;
})(Is || (Is = {}));

// ../rcasm-languageservice/node_modules/vscode-languageserver-textdocument/lib/esm/main.js
var FullTextDocument2 = class _FullTextDocument {
  constructor(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(range) {
    if (range) {
      const start = this.offsetAt(range.start);
      const end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  }
  update(changes, version) {
    for (const change of changes) {
      if (_FullTextDocument.isIncremental(change)) {
        const range = getWellformedRange(change.range);
        const startOffset = this.offsetAt(range.start);
        const endOffset = this.offsetAt(range.end);
        this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
        const startLine = Math.max(range.start.line, 0);
        const endLine = Math.max(range.end.line, 0);
        let lineOffsets = this._lineOffsets;
        const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
        if (endLine - startLine === addedLineOffsets.length) {
          for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
            lineOffsets[i + startLine + 1] = addedLineOffsets[i];
          }
        } else {
          if (addedLineOffsets.length < 1e4) {
            lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
          } else {
            this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
          }
        }
        const diff = change.text.length - (endOffset - startOffset);
        if (diff !== 0) {
          for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
            lineOffsets[i] = lineOffsets[i] + diff;
          }
        }
      } else if (_FullTextDocument.isFull(change)) {
        this._content = change.text;
        this._lineOffsets = void 0;
      } else {
        throw new Error("Unknown change event received");
      }
    }
    this._version = version;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      this._lineOffsets = computeLineOffsets(this._content, true);
    }
    return this._lineOffsets;
  }
  positionAt(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    const lineOffsets = this.getLineOffsets();
    let low = 0, high = lineOffsets.length;
    if (high === 0) {
      return { line: 0, character: offset };
    }
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    const line = low - 1;
    offset = this.ensureBeforeEOL(offset, lineOffsets[line]);
    return { line, character: offset - lineOffsets[line] };
  }
  offsetAt(position) {
    const lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    const lineOffset = lineOffsets[position.line];
    if (position.character <= 0) {
      return lineOffset;
    }
    const nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    const offset = Math.min(lineOffset + position.character, nextLineOffset);
    return this.ensureBeforeEOL(offset, lineOffset);
  }
  ensureBeforeEOL(offset, lineOffset) {
    while (offset > lineOffset && isEOL(this._content.charCodeAt(offset - 1))) {
      offset--;
    }
    return offset;
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(event) {
    const candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
  }
  static isFull(event) {
    const candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
  }
};
var TextDocument2;
(function(TextDocument3) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument2(uri, languageId, version, content);
  }
  TextDocument3.create = create;
  function update(document, changes, version) {
    if (document instanceof FullTextDocument2) {
      document.update(changes, version);
      return document;
    } else {
      throw new Error("TextDocument.update: document must be created by TextDocument.create");
    }
  }
  TextDocument3.update = update;
  function applyEdits(document, edits) {
    const text = document.getText();
    const sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
      const diff = a.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }
      return diff;
    });
    let lastModifiedOffset = 0;
    const spans = [];
    for (const e of sortedEdits) {
      const startOffset = document.offsetAt(e.range.start);
      if (startOffset < lastModifiedOffset) {
        throw new Error("Overlapping edit");
      } else if (startOffset > lastModifiedOffset) {
        spans.push(text.substring(lastModifiedOffset, startOffset));
      }
      if (e.newText.length) {
        spans.push(e.newText);
      }
      lastModifiedOffset = document.offsetAt(e.range.end);
    }
    spans.push(text.substr(lastModifiedOffset));
    return spans.join("");
  }
  TextDocument3.applyEdits = applyEdits;
})(TextDocument2 || (TextDocument2 = {}));
function mergeSort(data, compare) {
  if (data.length <= 1) {
    return data;
  }
  const p = data.length / 2 | 0;
  const left = data.slice(0, p);
  const right = data.slice(p);
  mergeSort(left, compare);
  mergeSort(right, compare);
  let leftIdx = 0;
  let rightIdx = 0;
  let i = 0;
  while (leftIdx < left.length && rightIdx < right.length) {
    const ret = compare(left[leftIdx], right[rightIdx]);
    if (ret <= 0) {
      data[i++] = left[leftIdx++];
    } else {
      data[i++] = right[rightIdx++];
    }
  }
  while (leftIdx < left.length) {
    data[i++] = left[leftIdx++];
  }
  while (rightIdx < right.length) {
    data[i++] = right[rightIdx++];
  }
  return data;
}
function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
  const result = isAtLineStart ? [textOffset] : [];
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (isEOL(ch)) {
      if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
        i++;
      }
      result.push(textOffset + i + 1);
    }
  }
  return result;
}
function isEOL(char) {
  return char === 13 || char === 10;
}
function getWellformedRange(range) {
  const start = range.start;
  const end = range.end;
  if (start.line > end.line || start.line === end.line && start.character > end.character) {
    return { start: end, end: start };
  }
  return range;
}
function getWellformedEdit(textEdit) {
  const range = getWellformedRange(textEdit.range);
  if (range !== textEdit.range) {
    return { newText: textEdit.newText, range };
  }
  return textEdit;
}

// ../rcasm-languageservice/lib/esm/rcasmLanguageTypes.js
var ClientCapabilities;
(function(ClientCapabilities2) {
  ClientCapabilities2.LATEST = {
    textDocument: {
      completion: {
        completionItem: {
          documentationFormat: [MarkupKind.Markdown, MarkupKind.PlainText]
        }
      },
      hover: {
        contentFormat: [MarkupKind.Markdown, MarkupKind.PlainText]
      }
    }
  };
})(ClientCapabilities || (ClientCapabilities = {}));

// ../rcasm-languageservice/lib/esm/utils/objects.js
function values(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}
function isDefined(obj) {
  return typeof obj !== "undefined";
}

// ../rcasm-languageservice/lib/esm/services/rcasmCompletion.js
var RCASMCompletion = class {
  constructor(clientCapabilities, rcasmDataManager) {
    this.clientCapabilities = clientCapabilities;
    this.rcasmDataManager = rcasmDataManager;
  }
  doComplete(document, position, program) {
    this.offset = document.offsetAt(position);
    this.position = position;
    this.currentWord = getCurrentWord(document, this.offset);
    this.defaultReplaceRange = Range.create(Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
    this.textDocument = document;
    this.program = program;
    try {
      const result = {
        isIncomplete: false,
        items: []
      };
      var textOnLine = document.getText(Range.create(Position.create(this.position.line, 0), this.position));
      if (textOnLine.match(/^([a-z]+:)?([ \t]+)?([a-z]{0,3})$/i)) {
        this.getCompletionsForMnemonic(result);
      }
      if (textOnLine.match(/^([a-z]+:)?([ \t]+)?([\!]?[a-z]*)$/i)) {
        this.getCompletionsForDirective(result);
      }
      return result;
    } finally {
      this.position = null;
      this.currentWord = null;
      this.textDocument = null;
      this.program = null;
      this.defaultReplaceRange = null;
    }
  }
  getCompletionsForMnemonic(result) {
    const properties = this.rcasmDataManager.getMnemonics();
    properties.forEach((entry) => {
      let range;
      let insertText;
      range = this.getCompletionRange(null);
      insertText = entry.snippet ?? entry.name;
      const item = {
        label: entry.name,
        detail: entry.summary,
        documentation: getEntryDescription(entry, this.doesSupportMarkdown()),
        textEdit: TextEdit.replace(range, insertText),
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Method
      };
      result.items.push(item);
    });
    return result;
  }
  getCompletionsForDirective(result) {
    const directives = this.rcasmDataManager.getDirectives();
    directives.forEach((entry) => {
      let range;
      let insertText;
      range = this.getCompletionRange(null);
      insertText = entry.snippet ?? entry.name;
      const item = {
        label: entry.name,
        detail: entry.summary,
        documentation: getEntryDescription(entry, this.doesSupportMarkdown()),
        textEdit: TextEdit.replace(range, insertText),
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Property,
        sortText: entry.name.substring(1)
      };
      result.items.push(item);
    });
    return result;
  }
  doesSupportMarkdown() {
    if (!isDefined(this.supportsMarkdown)) {
      if (!isDefined(this.clientCapabilities)) {
        this.supportsMarkdown = true;
        return this.supportsMarkdown;
      }
      const hover = this.clientCapabilities && this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.hover;
      this.supportsMarkdown = hover && hover.contentFormat && Array.isArray(hover.contentFormat) && hover.contentFormat.indexOf(MarkupKind.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }
  getCompletionRange(existingNode) {
    if (existingNode && existingNode.offset <= this.offset && this.offset <= existingNode.end) {
      const end = existingNode.end !== -1 ? this.textDocument.positionAt(existingNode.end) : this.position;
      const start = this.textDocument.positionAt(existingNode.offset);
      if (start.line === end.line) {
        return Range.create(start, end);
      }
    }
    return this.defaultReplaceRange;
  }
};
function getCurrentWord(document, offset) {
  let i = offset - 1;
  const text = document.getText();
  while (i >= 0 && " 	\n\r:,".indexOf(text.charAt(i)) === -1) {
    i--;
  }
  return text.substring(i + 1, offset);
}

// ../rcasm-languageservice/lib/esm/services/rcasmHover.js
var RCASMHover = class {
  constructor(clientCapabilities, rcasmDataManager) {
    this.clientCapabilities = clientCapabilities;
    this.rcasmDataManager = rcasmDataManager;
  }
  doHover(document, position, program) {
    function getRange2(node) {
      return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
    }
    const offset = document.offsetAt(position);
    const nodepath = getNodePath(program, offset);
    let hover = null;
    for (let i = 0; i < nodepath.length; i++) {
      const node = nodepath[i];
      if (node instanceof Instruction) {
        const mnemonicName = node.mnemonic;
        const entry = this.rcasmDataManager.getMnemonic(mnemonicName);
        if (entry) {
          const paramNames = this.getParamNames(entry, node);
          const contents = getEntrySpecificDescription(entry, paramNames, this.doesSupportMarkdown());
          if (contents) {
            hover = { contents, range: getRange2(node) };
          } else {
            hover = null;
          }
        }
        break;
      }
      if (node instanceof SetPC) {
        const entry = this.rcasmDataManager.getMnemonic("org");
        if (entry) {
          const paramNames = [node.pcExpr.getText()];
          const contents = getEntrySpecificDescription(entry, paramNames, this.doesSupportMarkdown());
          if (contents) {
            hover = { contents, range: getRange2(node) };
          } else {
            hover = null;
          }
        }
        break;
      }
      if (node instanceof DataDirective || node instanceof FillDirective) {
        const dtype = node.getText().slice(0, 5).toLowerCase();
        const entry = this.rcasmDataManager.getDirective(dtype);
        if (entry) {
          const contents = getEntryDescription(entry, this.doesSupportMarkdown());
          if (contents) {
            hover = { contents, range: getRange2(node) };
          } else {
            hover = null;
          }
        }
        break;
      }
      if (node instanceof AlignDirective) {
        const dtype = node.getText().slice(0, 6).toLowerCase();
        const entry = this.rcasmDataManager.getDirective(dtype);
        if (entry) {
          const contents = getEntryDescription(entry, this.doesSupportMarkdown());
          if (contents) {
            hover = { contents, range: getRange2(node) };
          } else {
            hover = null;
          }
        }
        break;
      }
    }
    if (hover) {
      hover.contents = this.convertContents(hover.contents);
    }
    return hover;
  }
  getParamNames(entry, insn) {
    let paramNames = [];
    if (insn.p1) {
      paramNames.push(this.getParamName(entry, insn.p1, insn.mnemonic));
    } else if (entry.class === "ALU") {
      paramNames.push("A");
    } else {
      paramNames.push("?");
    }
    if (insn.p2) {
      paramNames.push(this.getParamName(entry, insn.p2, insn.mnemonic));
    } else {
      paramNames.push("?");
    }
    return paramNames;
  }
  getParamName(entry, param, mnemonic) {
    if (param instanceof Register) {
      return param.value;
    }
    if (param instanceof LabelRef) {
      return `(${param.getText().trim()})`;
    }
    if (param instanceof Expression) {
      return param.getText().trim();
    }
    if (param instanceof Literal) {
      if (mnemonic.toLowerCase() === "ldi" && +param.value > 15) {
        return `0x${param.value.toString(16).toUpperCase()}`;
      } else if (entry.class === "GOTO") {
        return `0x${param.value.toString(16).toUpperCase()}`;
      }
      return param.value.toString();
    }
    return "?";
  }
  convertContents(contents) {
    if (!this.doesSupportMarkdown()) {
      if (typeof contents === "string") {
        return contents;
      } else if ("kind" in contents) {
        return {
          kind: "plaintext",
          value: contents.value
        };
      } else if (Array.isArray(contents)) {
        return contents.map((c) => {
          return typeof c === "string" ? c : c.value;
        });
      } else {
        return contents.value;
      }
    }
    return contents;
  }
  doesSupportMarkdown() {
    if (!isDefined(this.supportsMarkdown)) {
      if (!isDefined(this.clientCapabilities)) {
        this.supportsMarkdown = true;
        return this.supportsMarkdown;
      }
      const hover = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.hover;
      this.supportsMarkdown = hover && hover.contentFormat && Array.isArray(hover.contentFormat) && hover.contentFormat.indexOf(MarkupKind.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }
};

// ../rcasm-languageservice/lib/esm/parser/rcasmSymbolScope.js
var Scope2 = class {
  constructor(offset, length) {
    this.symbols = [];
  }
  addSymbol(symbol) {
    this.symbols.push(symbol);
  }
  getSymbol(name, type) {
    for (let index = 0; index < this.symbols.length; index++) {
      const symbol = this.symbols[index];
      if (symbol.name === name && symbol.type === type) {
        return symbol;
      }
    }
    return null;
  }
};
var GlobalScope = class extends Scope2 {
  constructor() {
    super(0, Number.MAX_VALUE);
  }
};
var Symbol2 = class {
  constructor(name, value, node, type) {
    this.name = name;
    this.value = value;
    this.node = node;
    this.type = type;
  }
};
var ScopeBuilder = class {
  constructor(scope) {
    this.scope = scope;
  }
  addSymbol(node, name, value, type) {
    if (node.offset !== -1) {
      this.scope.addSymbol(new Symbol2(name, value, node, type));
    }
  }
  visitNode(node) {
    switch (node.type) {
      case NodeType.Label:
        this.addSymbol(node, node.getText(), void 0, ReferenceType.Label);
        return true;
    }
    return true;
  }
};
var Symbols = class {
  constructor(node) {
    this.global = new GlobalScope();
    node.acceptVisitor(new ScopeBuilder(this.global));
  }
  internalFindSymbol(node, referenceTypes) {
    const name = node.getText();
    let scope = this.global;
    for (let index = 0; index < referenceTypes.length; index++) {
      const type = referenceTypes[index];
      const symbol = scope.getSymbol(name, type);
      if (symbol) {
        return symbol;
      }
    }
    return null;
  }
  evaluateReferenceTypes(node) {
    if (node instanceof LabelRef || node instanceof Label) {
      return [ReferenceType.Label];
    }
    return null;
  }
  findSymbolFromNode(node) {
    if (!node) {
      return null;
    }
    const referenceTypes = this.evaluateReferenceTypes(node);
    if (referenceTypes) {
      return this.internalFindSymbol(node, referenceTypes);
    }
    return null;
  }
  matchesSymbol(node, symbol) {
    if (!node) {
      return false;
    }
    if (!node.matches(symbol.name)) {
      return false;
    }
    const referenceTypes = this.evaluateReferenceTypes(node);
    if (!referenceTypes || referenceTypes.indexOf(symbol.type) === -1) {
      return false;
    }
    const nodeSymbol = this.internalFindSymbol(node, referenceTypes);
    return nodeSymbol === symbol;
  }
};

// ../rcasm-languageservice/lib/esm/services/rcasmNavigation.js
var RCASMNavigation = class {
  findDefinition(document, position, program) {
    const symbols = new Symbols(program);
    const offset = document.offsetAt(position);
    const node = getNodeAtOffset(program, offset);
    if (!node) {
      return null;
    }
    const symbol = symbols.findSymbolFromNode(node);
    if (!symbol) {
      return null;
    }
    return {
      uri: document.uri,
      range: getRange(symbol.node, document)
    };
  }
  findReferences(document, position, program) {
    const highlights = this.findDocumentHighlights(document, position, program);
    return highlights.map((h) => {
      return {
        uri: document.uri,
        range: h.range
      };
    });
  }
  getHighlightNode(document, position, program) {
    const offset = document.offsetAt(position);
    let node = getNodeAtOffset(program, offset);
    if (!node || node.type !== NodeType.Label && node.type !== NodeType.LabelRef) {
      return;
    }
    return node;
  }
  findDocumentHighlights(document, position, program) {
    const result = [];
    const offset = document.offsetAt(position);
    let node = getNodeAtOffset(program, offset);
    if (!node || node.type !== NodeType.Label && node.type !== NodeType.LabelRef) {
      return result;
    }
    const symbols = new Symbols(program);
    const symbol = symbols.findSymbolFromNode(node);
    const name = node.getText();
    program.accept((candidate) => {
      if (symbol) {
        if (symbols.matchesSymbol(candidate, symbol)) {
          result.push({
            kind: getHighlightKind(candidate),
            range: getRange(candidate, document)
          });
          return false;
        }
      } else if (node && node.type === candidate.type && candidate.matches(name)) {
        result.push({
          kind: getHighlightKind(candidate),
          range: getRange(candidate, document)
        });
      }
      return true;
    });
    return result;
  }
  findSymbolInformations(document, program) {
    const result = [];
    const addSymbolInformation = (name, kind, symbolNodeOrRange) => {
      const range = symbolNodeOrRange instanceof Node ? getRange(symbolNodeOrRange, document) : symbolNodeOrRange;
      const entry = {
        name,
        kind,
        location: Location.create(document.uri, range)
      };
      result.push(entry);
    };
    this.collectDocumentSymbols(document, program, addSymbolInformation);
    return result;
  }
  findDocumentSymbols(document, program) {
    const result = [];
    const parents = [];
    const addDocumentSymbol = (name, kind, symbolNodeOrRange, nameNodeOrRange, bodyNode) => {
      const range = symbolNodeOrRange instanceof Node ? getRange(symbolNodeOrRange, document) : symbolNodeOrRange;
      const selectionRange = (nameNodeOrRange instanceof Node ? getRange(nameNodeOrRange, document) : nameNodeOrRange) ?? Range.create(range.start, range.start);
      const entry = {
        name,
        kind,
        range,
        selectionRange
      };
      let top = parents.pop();
      while (top && !containsRange(top[1], range)) {
        top = parents.pop();
      }
      if (top) {
        const topSymbol = top[0];
        if (!topSymbol.children) {
          topSymbol.children = [];
        }
        topSymbol.children.push(entry);
        parents.push(top);
      } else {
        result.push(entry);
      }
      if (bodyNode) {
        parents.push([entry, getRange(bodyNode, document)]);
      }
    };
    this.collectDocumentSymbols(document, program, addDocumentSymbol);
    return result;
  }
  collectDocumentSymbols(document, program, collect) {
    program.accept((node) => {
      if (node instanceof Label) {
        collect(node.getName(), SymbolKind.Variable, node, node, void 0);
      }
      return true;
    });
  }
  prepareRename(document, position, program) {
    const node = this.getHighlightNode(document, position, program);
    if (node) {
      return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
    }
  }
  doRename(document, position, newName, program) {
    const highlights = this.findDocumentHighlights(document, position, program);
    const edits = highlights.map((h) => TextEdit.replace(h.range, newName));
    return {
      changes: { [document.uri]: edits }
    };
  }
};
function getRange(node, document) {
  return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
}
function containsRange(range, otherRange) {
  const otherStartLine = otherRange.start.line, otherEndLine = otherRange.end.line;
  const rangeStartLine = range.start.line, rangeEndLine = range.end.line;
  if (otherStartLine < rangeStartLine || otherEndLine < rangeStartLine) {
    return false;
  }
  if (otherStartLine > rangeEndLine || otherEndLine > rangeEndLine) {
    return false;
  }
  if (otherStartLine === rangeStartLine && otherRange.start.character < range.start.character) {
    return false;
  }
  if (otherEndLine === rangeEndLine && otherRange.end.character > range.end.character) {
    return false;
  }
  return true;
}
function getHighlightKind(node) {
  if (node.type === NodeType.Label) {
    return DocumentHighlightKind.Write;
  }
  return DocumentHighlightKind.Read;
}

// ../rcasm-languageservice/lib/esm/services/rcasmValidation.js
var RCASMValidation = class {
  constructor() {
  }
  configure(settings) {
    this.settings = settings;
  }
  doValidation(document, settings = this.settings) {
    if (settings && settings.validate === false) {
      return [];
    }
    const { errors, warnings } = assemble(document.getText());
    let toDiagnostic = (e, s) => {
      return {
        severity: s,
        range: {
          start: document.positionAt(e.loc.start.offset),
          end: document.positionAt(e.loc.end.offset)
        },
        message: e.msg,
        source: document.languageId
      };
    };
    const entries = [];
    entries.push(...errors.map((e) => toDiagnostic(e, DiagnosticSeverity.Error)));
    entries.push(...warnings.map((e) => toDiagnostic(e, DiagnosticSeverity.Warning)));
    return entries;
  }
};

// ../rcasm-languageservice/lib/esm/services/rcasmFolding.js
function getFoldingRanges(document, program, context) {
  const ranges = computeFoldingRanges(document, program);
  return limitFoldingRanges(ranges, context);
}
function computeFoldingRanges(document, program) {
  function getRange2(node) {
    return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
  }
  const ranges = [];
  program.accept((node) => {
    if (node instanceof Scope) {
      const range = getRange2(node);
      ranges.push({
        startLine: range.start.line,
        endLine: range.end.line,
        kind: "region"
      });
      return false;
    }
    return true;
  });
  return ranges;
}
function limitFoldingRanges(ranges, context) {
  const maxRanges = context && context.rangeLimit || Number.MAX_VALUE;
  const sortedRanges = ranges.sort((r1, r2) => {
    let diff = r1.startLine - r2.startLine;
    if (diff === 0) {
      diff = r1.endLine - r2.endLine;
    }
    return diff;
  });
  const validRanges = [];
  let prevEndLine = -1;
  sortedRanges.forEach((r) => {
    if (!(r.startLine < prevEndLine && prevEndLine < r.endLine)) {
      validRanges.push(r);
      prevEndLine = r.endLine;
    }
  });
  if (validRanges.length < maxRanges) {
    return validRanges;
  } else {
    return validRanges.slice(0, maxRanges);
  }
}

// ../rcasm-languageservice/lib/esm/languageFacts/data/customData.js
var rcasmData = {
  "version": 1,
  "mnemonics": [
    {
      "name": "add",
      "class": "ALU",
      "cycles": 8,
      "summary": "Arithmetic Add",
      "description": "Adds the contents of register b and c placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero), S (sign) and C (carry) flags.",
      "synopsis": "{0} = B + C",
      "syntax": "add [<dest>{a|d}]"
    },
    {
      "name": "and",
      "class": "ALU",
      "cycles": 8,
      "summary": "Logic And",
      "description": "Performs a bitwise AND on register b and c placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags.",
      "synopsis": "{0} = B & C",
      "syntax": "and [<dest>{a|d}]"
    },
    {
      "name": "bcs",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Carry Set",
      "snippet": "bcs ${1:label}",
      "description": "Jumps to label if C is set (last ALU operation resulted in a carry).",
      "synopsis": "PC = {0} [if CY]",
      "syntax": "bcs <label>"
    },
    {
      "name": "beq",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Equal (zero)",
      "snippet": "beq ${1:label}",
      "description": "Jumps to label if Z flag is set (last ALU operation result was 0).",
      "synopsis": "PC = {0} [if Z]",
      "syntax": "beq <label>"
    },
    {
      "name": "ble",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Less Than or Equal (sign or zero)",
      "snippet": "ble ${1:label}",
      "description": "Jumps to label if S or Z is set (last ALU operation resulted in a zero or negative value).",
      "synopsis": "PC = {0} [if S or Z]",
      "syntax": "ble <label>"
    },
    {
      "name": "blt",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Less Than (sign set)",
      "snippet": "blt ${1:label}",
      "description": "Jumps to label if S is set (last ALU operation has most significant bit set / is negative). Synonym of `bmi`.",
      "synopsis": "PC = {0} [if S]",
      "syntax": "blt <label>"
    },
    {
      "name": "bmi",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Minus/Sign",
      "snippet": "bmi ${1:label}",
      "description": "Jumps to label if S is set (last ALU operation has most significant bit set / is negative). Synonym of `blt`.",
      "synopsis": "PC = {0} [if S]",
      "syntax": "bmi <label>"
    },
    {
      "name": "bne",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Branch if Not Equal (not zero)",
      "snippet": "bne ${1:label}",
      "description": "Jumps to label if Z is not set (last ALU operation result was not 0).",
      "synopsis": "PC = {0} [if not Z]",
      "syntax": "bne <label>"
    },
    {
      "name": "clr",
      "class": "MOV8",
      "cycles": 8,
      "summary": "8-bit Register Clear",
      "description": "Clears (sets to 0) general purpose 8-bit register dst. This is the equivalent of `mov dst,dst`.",
      "synopsis": "{0} = 0",
      "syntax": "clr <dst>{a|b|c|d|m1|m2|x|y}",
      "variants": [
        {
          "class": "MOV16",
          "cycles": 10,
          "summary": "16-bit Register Clear",
          "description": "Clears (sets to 0) 16-bit register xy. This is the equivalent of `mov xy,xy`.",
          "syntax": "clr xy",
          "whenFirstParamIs": ["xy"]
        }
      ]
    },
    {
      "name": "cmp",
      "class": "ALU",
      "cycles": 8,
      "summary": "Compare (Logic Xor)",
      "description": "Compares the values in register b and c setting condition flag Z (zero) if the values are the same. Overwrites dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags. Synonym of `eor`.",
      "synopsis": "{0} = B ^ C",
      "syntax": "cmp [<dest>{a|d}]"
    },
    {
      "name": "eor",
      "class": "ALU",
      "cycles": 8,
      "summary": "Logic Xor",
      "description": "Performs a bitwise XOR (exlusive OR) on register b and c placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags. Synonym of `cmp`.",
      "synopsis": "{0} = B ^ C",
      "syntax": "eor [<dest>{a|d}]"
    },
    {
      "name": "inc",
      "class": "ALU",
      "cycles": 8,
      "summary": "Increment",
      "description": "Adds one to the contents of register b (register c is ignored) placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero), S (sign) and C (carry) flags.",
      "synopsis": "{0} = B + 1",
      "syntax": "inc [<dest>{a|d}]"
    },
    {
      "name": "hlt",
      "class": "MISC",
      "cycles": 10,
      "summary": "Halt",
      "description": "Halts execution of the program.",
      "synopsis": "HALT (PC = PC + 1)"
    },
    {
      "name": "hlr",
      "class": "MISC",
      "cycles": 10,
      "summary": "Halt and Reload",
      "description": "Halts execution of the program and sets the program counter to the value on the primary switches.",
      "synopsis": "HALT (PC = AS)"
    },
    {
      "name": "ixy",
      "class": "INCXY",
      "cycles": 14,
      "summary": "XY Increment",
      "description": "Increments the 16-bit value in the xy register by 1.",
      "synopsis": "XY = XY + 1"
    },
    {
      "name": "lds",
      "class": "MISC",
      "cycles": 10,
      "summary": "Load Register from Switches",
      "description": "Loads register dst (a or d) from the front panel switches",
      "synopsis": "{0} = DS",
      "snippet": "lds ${1:a}",
      "syntax": "lds <dst>{a|d}"
    },
    {
      "name": "ldr",
      "class": "LOAD",
      "cycles": 12,
      "summary": "Load Register from Memory",
      "snippet": "ldr ${1:b}",
      "description": "Loads register dst (a, b, c or d) with the byte in memory currently referenced by register m.",
      "synopsis": "{0} = (M)",
      "syntax": "ldr <dst>{a|b|c|d}"
    },
    {
      "name": "jmp",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Unconditional Jump",
      "snippet": "jmp ${1:label}",
      "description": "Unconditionally jumps to label (via register j).",
      "synopsis": "PC = {0}",
      "syntax": "jmp <label>"
    },
    {
      "name": "jsr",
      "class": "GOTO",
      "cycles": 24,
      "summary": "Jump Subroutine",
      "snippet": "jsr ${1:label}",
      "description": "Saves the address of the next instruction into register xy and then unconditionally jumps to label (via register j). Notionally behaves as a 'call subroutine' operation.",
      "synopsis": "XY = PC, PC = {0}",
      "syntax": "jsr <label>"
    },
    {
      "name": "rts",
      "class": "MOV16",
      "cycles": 10,
      "summary": "Return from Subroutine",
      "description": "Copies the value in register xy to the program counter pc. Notionally behaves as a 'return' operation to a previous jsr call.",
      "synopsis": "PC = XY"
    },
    {
      "name": "ldi",
      "class": "SETAB",
      "cycles": 8,
      "summary": "8-bit Load Immediate",
      "snippet": "ldi ${1:a},${2:0}",
      "description": "Loads an 8-bit constant value into dst (register a or b), value must be between -16 and 15.",
      "synopsis": "{0} = {1}",
      "syntax": "ldi <dst>{a|b} , <value>{-16,15}",
      "variants": [
        {
          "class": "GOTO",
          "cycles": 24,
          "summary": "16-bit Load Immediate",
          "description": "Loads a 16-bit constant value into dst (register m or j), value can be between 0x0000 and 0xFFFF.",
          "syntax": "ldi <dst>{m|j} , [ <value>{0x0000,0xFFFF} | <label> ]",
          "whenFirstParamIs": ["m", "j"]
        }
      ]
    },
    {
      "name": "mov",
      "class": "MOV8",
      "cycles": 8,
      "summary": "8-bit Register to Register Copy",
      "snippet": "mov ${1:b},${2:a}",
      "description": "Copies a value from src to dst between any of the eight general purpose 8-bit registers. If dst and src are the same then dst will be set to 0.",
      "synopsis": "{0} = {1}",
      "syntax": "mov <dst>{a-d|m1|m2|x|y} , <src>{a-d|m1|m2|x|y}",
      "variants": [
        {
          "class": "MOV16",
          "cycles": 10,
          "summary": "16-bit Register to Register Copy",
          "description": "Copies a value between the 16-bit src registers (m, xy or j) and dst (xy or the program counter pc). If dst and src are the same then dst will be set to 0.",
          "syntax": "mov <dst>{xy|pc} , <src>{m|xy|j|as}",
          "whenFirstParamIs": ["xy", "pc"]
        }
      ]
    },
    {
      "name": "not",
      "class": "ALU",
      "cycles": 8,
      "summary": "Logic Not",
      "description": "Performs a bitwise NOT on register b (register c is ignored) placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags.",
      "synopsis": "{0} = ~B",
      "syntax": "not [<dest>{a|d}]"
    },
    {
      "name": "orr",
      "class": "ALU",
      "cycles": 8,
      "summary": "Logic Or",
      "description": "Performs a bitwise OR on register b and c placing the result in dst (a or d). If dst is not specified then register a is assumed. Affects Z (zero) and S (sign) flags.",
      "synopsis": "{0} = B | C",
      "syntax": "orr [<dest>{a|d}]"
    },
    {
      "name": "rol",
      "class": "ALU",
      "cycles": 8,
      "summary": "Bitwise Circular Shift Left",
      "description": "Performs a bitwise left-rotation on register b (register c is ignored) placing the result in dst (a or d). If dst is not specified then register a is assumed. Every bit shifts one place to the left with the left most bit rotated around to right. Affects Z (zero) and S (sign) flags.",
      "synopsis": "{0} = <<<B",
      "syntax": "rol [<dest>{a|d}]"
    },
    {
      "name": "str",
      "class": "STORE",
      "cycles": 12,
      "summary": "Store Register into Memory",
      "snippet": "str ${1:a}",
      "description": "Stores register src (a, b, c or d) into the byte of memory currently referenced by register m.",
      "synopsis": "(M) = {0}",
      "syntax": "str <src>{a|b|c|d}"
    }
  ],
  "directives": [
    {
      "name": "!align",
      "summary": "Define Align",
      "description": "Writes 8-bit zeros into the output until the current location is a multiple of the given value.",
      "snippet": "!align ${1:8}",
      "syntax": "<value>{2,4,8,16...}"
    },
    {
      "name": "!byte",
      "summary": "Define Byte Data",
      "description": "Writes the given 8-bit values directly into the output starting from current location.",
      "snippet": "!byte ${1:0x00}",
      "syntax": "<value>{0x00,0xFF} [ ,...n ]"
    },
    {
      "name": "!word",
      "summary": "Define Word Data",
      "description": "Writes the given 16-bit values directly into the output starting from current location.",
      "snippet": "!word ${1:0x0000}",
      "syntax": "<value>{0x0000,0xFFFF} [ ,...n ]"
    },
    {
      "name": "!fill",
      "summary": "Define Fill Space",
      "description": "Writes the given 8-bit value n times directly into the output starting from current location.",
      "snippet": "!fill ${1:8},${2:0x00}",
      "syntax": "<count>{0,255}, <value>{0x00,0xFF}"
    }
  ]
};

// ../rcasm-languageservice/lib/esm/languageFacts/dataProvider.js
var RCASMDataProvider = class {
  constructor(data) {
    this._mnemonics = [];
    this._directives = [];
    this.addData(data);
  }
  provideMnemonics() {
    return this._mnemonics;
  }
  provideDirectives() {
    return this._directives;
  }
  addData(data) {
    if (data.mnemonics) {
      this._mnemonics = this._mnemonics.concat(data.mnemonics);
    }
    if (Array.isArray(data.mnemonics)) {
      for (const prop of data.mnemonics) {
        if (isMnemonicData(prop)) {
          this._mnemonics.push(prop);
        }
      }
    }
    if (Array.isArray(data.directives)) {
      for (const prop of data.directives) {
        if (isDirectiveData(prop)) {
          this._directives.push(prop);
        }
      }
    }
  }
};
function isMnemonicData(d) {
  return typeof d.name === "string";
}
function isDirectiveData(d) {
  return typeof d.name === "string";
}

// ../rcasm-languageservice/lib/esm/languageFacts/dataManager.js
var RCASMDataManager = class {
  constructor(options) {
    this.dataProviders = [];
    this._mnemonicSet = {};
    this._directiveSet = {};
    this._mnemonics = [];
    this._directives = [];
    this.setDataProviders(options?.useDefaultDataProvider !== false, options?.customDataProviders || []);
  }
  setDataProviders(builtIn, providers) {
    this.dataProviders = [];
    if (builtIn) {
      this.dataProviders.push(new RCASMDataProvider(rcasmData));
    }
    this.dataProviders.push(...providers);
    this.collectData();
  }
  collectData() {
    this._mnemonicSet = {};
    this._directiveSet = {};
    this.dataProviders.forEach((provider) => {
      provider.provideMnemonics().forEach((p) => {
        if (!this._mnemonicSet[p.name]) {
          this._mnemonicSet[p.name] = p;
        }
      });
      provider.provideDirectives().forEach((p) => {
        if (!this._directiveSet[p.name]) {
          this._directiveSet[p.name] = p;
        }
      });
    });
    this._mnemonics = values(this._mnemonicSet);
    this._directives = values(this._directiveSet);
  }
  getMnemonic(name) {
    return this._mnemonicSet[name];
  }
  getDirective(name) {
    return this._directiveSet[name];
  }
  getMnemonics() {
    return this._mnemonics;
  }
  getDirectives() {
    return this._directives;
  }
};

// ../rcasm-languageservice/lib/esm/rcasmLanguageService.js
function createFacade(parser2, completion, hover, navigation, validation, rcasmDataManager) {
  return {
    configure: (settings) => {
      validation.configure(settings);
    },
    setDataProviders: rcasmDataManager.setDataProviders.bind(rcasmDataManager),
    doValidation: validation.doValidation.bind(validation),
    parseProgram: parser2.parseProgram.bind(parser2),
    doComplete: completion.doComplete.bind(completion),
    doHover: hover.doHover.bind(hover),
    findDefinition: navigation.findDefinition.bind(navigation),
    findReferences: navigation.findReferences.bind(navigation),
    findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
    findDocumentSymbols: navigation.findSymbolInformations.bind(navigation),
    findDocumentSymbols2: navigation.findDocumentSymbols.bind(navigation),
    prepareRename: navigation.prepareRename.bind(navigation),
    doRename: navigation.doRename.bind(navigation),
    getFoldingRanges
  };
}
var defaultLanguageServiceOptions = {};
function getLanguageService(options = defaultLanguageServiceOptions) {
  const rcasmDataManager = new RCASMDataManager(options);
  return createFacade(new RCASMParser(), new RCASMCompletion(options && options.clientCapabilities, rcasmDataManager), new RCASMHover(options && options.clientCapabilities, rcasmDataManager), new RCASMNavigation(), new RCASMValidation(), rcasmDataManager);
}

// src/language/rcasm/rcasmWorker.ts
var RCASMWorker = class {
  constructor(ctx, createData) {
    this._ctx = ctx;
    this._languageId = createData.languageId;
    this._languageService = getLanguageService({});
  }
  // --- language service host ---------------
  async doValidation(uri) {
    const document = this._getTextDocument(uri);
    if (document) {
      const diagnostics = this._languageService.doValidation(document);
      return Promise.resolve(diagnostics);
    }
    return Promise.resolve([]);
  }
  async doComplete(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    const program = this._languageService.parseProgram(document);
    const completions = this._languageService.doComplete(document, position, program);
    return Promise.resolve(completions);
  }
  async doHover(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    const program = this._languageService.parseProgram(document);
    const hover = this._languageService.doHover(document, position, program);
    return Promise.resolve(hover);
  }
  async findDefinition(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    const program = this._languageService.parseProgram(document);
    const definition = this._languageService.findDefinition(document, position, program);
    return Promise.resolve(definition);
  }
  async findReferences(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    const program = this._languageService.parseProgram(document);
    const references = this._languageService.findReferences(document, position, program);
    return Promise.resolve(references);
  }
  async findDocumentHighlights(uri, position) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    const program = this._languageService.parseProgram(document);
    const highlights = this._languageService.findDocumentHighlights(document, position, program);
    return Promise.resolve(highlights);
  }
  async findDocumentSymbols(uri) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    const program = this._languageService.parseProgram(document);
    const symbols = this._languageService.findDocumentSymbols(document, program);
    return Promise.resolve(symbols);
  }
  async getFoldingRanges(uri, context) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    const program = this._languageService.parseProgram(document);
    const ranges = this._languageService.getFoldingRanges(document, program, context);
    return Promise.resolve(ranges);
  }
  async doRename(uri, position, newName) {
    const document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    const program = this._languageService.parseProgram(document);
    const renames = this._languageService.doRename(document, position, newName, program);
    return Promise.resolve(renames);
  }
  _getTextDocument(uri) {
    const models = this._ctx.getMirrorModels();
    for (const model of models) {
      if (model.uri.toString() === uri) {
        return TextDocument2.create(
          uri,
          this._languageId,
          model.version,
          model.getValue()
        );
      }
    }
    return null;
  }
};

// src/language/rcasm/rcasm.worker.ts
self.onmessage = () => {
  worker.initialize((ctx, createData) => {
    return new RCASMWorker(ctx, createData);
  });
};
