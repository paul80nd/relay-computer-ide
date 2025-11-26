import type { MnemonicDoc } from '.';

export const directiveDocs: Record<string, MnemonicDoc> = {
  org: {
    title: 'org',
    summary: 'Define Output Location',
    syntax: ['org <address>'],
    snippet: 'org ${1:0x0000}',
    description: [
      'Sets the current location of the assembler so that the next instruction will be placed at the given address.',
      'An 8-bit constant may be used and will be assumed to be in the zero page (`0x00--`).',
    ],
  },
  opc: {
    title: 'opc',
    summary: 'Define Opcode',
    syntax: ['opc <opcode>'],
    snippet: 'opc ${1:0x00}',
    description: [
      'Writes the given 8-bit value directly into the assembled output.',
      'Values may be any valid 8-bit constant.',
      'Typically this directive is used to issue a direct opcode that has no current assembler equivalent.',
      'Directly equivalent to `!byte <opcode>`.',
    ],
  },
  '!align': {
    title: '!align',
    summary: 'Define Align',
    syntax: ['!align <value:2|4|8|16|...>'],
    snippet: '!align ${1:8}',
    description: ['Writes 8-bit zeros into the output until the current location is a multiple of the given value.'],
  },
  '!byte': {
    title: '!byte',
    summary: 'Define Byte Data',
    syntax: ['!byte <value:0x00..0xFF>[,...]'],
    snippet: '!byte ${1:0x00}',
    description: [
      'Writes the given 8-bit comma seperated values directly into the assembled output.',
      'Values may be any valid 8-bit constant.',
      'Where a label is provided the least significant byte of that address will be used.',
      'Alternatively a string may be provided within double quotes which will be output as an UTF-8 byte per character.',
    ],
  },
  '!word': {
    title: '!word',
    summary: 'Define Word Data',
    syntax: ['!word <value:0x0000..0xFFFF>[,...]'],
    snippet: '!word ${1:0x0000}',
    description: [
      'Writes the given 16-bit comma seperated values directly into the assembled output.',
      'Values may be any valid 16-bit constant.',
      'Where a label is provided the addess it references will be used.',
      'Alternatively a string may be provided within double quotes which will be output as an UTF-16BE word per character.',
    ],
  },
  '!fill': {
    title: '!fill',
    summary: 'Define Fill Space',
    syntax: ['!fill <count:0..255>,<value:0x00..0xFF>'],
    snippet: '!fill ${1:8},${2:0x00}',
    description: [
      'Writes the given 8-bit value <em>v</em> directly into the assembled output `n` times.',
      'Values may be any valid 8-bit constant.',
    ],
  },
  '!for': {
    title: '!for',
    summary: 'Define For Loop',
    syntax: ['!for <variable> in <range>'],
    snippet: '!for ${1:i} in range(${2:5}) {\n        ${3:add}\n}',
    description: [
      'Repeats the given code block, according to the given range, in the assembled output.',
      'The variable `i` can be referenced from within the code block and increases per iteration of the `for` loop.',
      'If a label preceeds the directive then any label within the code block can be referenced, by iteration number `i`, with a fully scoped label in the form `outer_label__i::inner_label`',
    ],
  },
  range: {
    title: 'range',
    summary: 'Range Macro',
    syntax: ['range ([<start>,]<end>)'],
    snippet: 'range(${1:5})',
    description: [
      'Defines a range for use with a `!for` directive.',
      'The range can either be a single numeric value `n` giving a range of `0..n-1` or two values `s`,`e` giving a range on `s..e-1`.',
    ],
  },
  '!if': {
    title: '!if',
    summary: 'Define Conditional Block',
    syntax: ['!if (<condition>)'],
    snippet: '!if (${1:i == 0}) {\n        ${2:add}\n}',
    description: [
      'Conditionally assembles the next code block.',
      "The condition can be any expression that results in a 'truthy' or 'falsy' value.",
      'Following the code block multiple optional `elif` (else if) directives may be added followed by one final optional `else` directive.',
    ],
  },
  elif: {
    title: 'elif',
    summary: 'Define Conditional Else-If Block',
    syntax: ['elif (<condition>)'],
    snippet: 'elif (${1:i == 0}) {\n        ${2:add}\n}',
    description: [
      'Conditionally assembles the next code block.',
      "The condition can be any expression that results in a 'truthy' or 'falsy' value.",
      'Must follow an `if` or `elif` block and can be followed by multiple optional `elif` directives or by one final optional `else` directive.',
    ],
  },
  else: {
    title: 'else',
    summary: 'Define Conditional Else Block',
    syntax: ['else'],
    snippet: 'else {\n        ${2:add}\n}',
    description: [
      'Conditionally assembles the next code block if no preceeding `if` or `elif` block evaluated to true.',
      'Must follow an `if` or `elif` block.',
    ],
  },
  '!let': {
    title: '!let',
    summary: 'Define Variable',
    syntax: ['!let <variable> = <value>'],
    snippet: '!let ${1:i} = ${2:0}',
    description: [
      'Defines a variable that can be later referenced.',
      'Values may be any valid 8-bit constant (either directly or resulting from an expression).',
      'Where a label is provided the least significant byte of that address will be used.',
      'Alternatively a string may be provided within double quotes which will be output as an UTF-8 byte per character.',
    ],
  },
  '!error': {
    title: '!error',
    summary: 'Throw Assembly Error',
    syntax: ['!error <message>'],
    snippet: '!if (${1:i == 0}) { !error "${2:Error message}" }',
    description: [
      'Intentionally raises an error at assembly time.',
      'Typically used within an `!if` directive to assert that a condition is met.',
    ],
  },
};
