// Input split as prgid@name@desc@dasm
const input = document.body.innerText.split('@');
const prgid = input[0];
const prgname = input[1];
const prgdesc = input[2];
const dasm = input[3];

let result = '';

// Parse dasm and flatten to single array of opcodes
const data = dasm.split('|').map(l => {
  const vs = l.slice(5).match(/[0-9A-F]{2}/g);
  const c1 = l.slice(5).replace(/[0-9A-F]{2}/g, '').trim();
  const l1 = parseInt(l.slice(0, 5), 16);
  return vs.map((v, i) => ({
    v: parseInt(v, 16),
    a: (l1 + i),
    c: i === 0 && c1.length > 0 ? c1 : '-'
  }));
}).flat();

// Chunk opcodes into strips, 50 in first, 55 in rest
const dataStrips = data.reduce((ra, d, i) => {
  const cidx = i < 50 ? 0 : Math.floor((i - 50) / 55) + 1;
  if (!ra[cidx]) { ra[cidx] = []; }
  ra[cidx].push(d);
  return ra;
}, [])
const totalStrips = dataStrips.length;

// Chunk strips into pages
const dataPages = dataStrips.reduce((ra, s, i) => {
  const cidx = Math.floor(i / 3);
  if (!ra[cidx]) { ra[cidx] = []; }
  ra[cidx].push(s);
  return ra;
}, [])

// Iterate pages, strips and opcodes to build pages
let strip = 1;
dataPages.forEach(p => {
  result += '<div class="wrapper">';

  p.forEach(s => {
    result += '<ul>';
    result += `<li class="page">${prgid} ${strip.toString().padStart(2, '0')}/${totalStrips.toString().padStart(2, '0')} <i class="chevron"></i></li>`
    if (strip === 1) {
      result += `<li class="title">${prgname.length > 0 ? prgname : prgid}</li>`;
      if (prgdesc.length > 0) {
        result += `<li class="desc">${prgdesc}</li>`;
      }
      result += `<li class="origin">ORIGIN: <b>0x${dasm.slice(0, 4).toUpperCase()}</b></li>`;
    }

    s.forEach(d => {
      const hi = ((d.v & 0xf0) >> 4).toString(2).padStart(4, '0');
      const lo = (d.v & 0x0f).toString(2).padStart(4, '0');
      const ad = d.a.toString(16).toUpperCase().padStart(4, 0);
      const op = d.v.toString(16).toUpperCase().padStart(2, 0);

      result += '<li class="instr">';
      result += '<span class="mark"></span>';
      result += `<span class="word b${hi}"></span>`;
      result += `<span class="word b${lo}"></span>`;
      result += `<span class="code">${ad}:<b>${op}</b><br /><sup>${d.c}</sup></span>`;
      result += `</li>`;
    });

    if (strip < totalStrips) {
      result += `<li class="footer">continues on ${(strip + 1).toString().padStart(2, '0')}/${totalStrips.toString().padStart(2, '0')}</li>`
    } else {
      result += '<li class="footer ends">PROGRAM ENDS</li>'
    }
    result += '</ul>';
    strip++;
  });

  result += '</div>'
})

document.body.innerHTML = result;

