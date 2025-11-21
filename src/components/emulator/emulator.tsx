import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Tooltip, makeStyles, tokens, Caption1 } from '@fluentui/react-components';
import type { EmulatorProps } from './types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    padding: '8px',
    overflow: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  tablesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'stretch',
  },
  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  th: {
    textAlign: 'left',
    padding: '4px 6px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground2,
  },
  td: {
    padding: '4px 6px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    padding: '1px 4px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'inline-block',
    minWidth: '2ch',
  },
  dot: { fontSize: '16px' },
  controlsRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  switchesRow: {
    display: 'flex',
    gap: '4px',
  },
  switchBtn: {
    padding: '2px 6px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    background: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    userSelect: 'none',
  },
  switchActive: {
    background: tokens.colorNeutralBackground1Hover,
    border: `2px solid ${tokens.colorBrandForeground2}`,
  },
  memoryTable: {
    borderCollapse: 'collapse',
    fontVariantNumeric: 'tabular-nums',
  },
  memTh: {
    textAlign: 'left',
    padding: '4px 6px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  memTd: {
    padding: '2px 6px',
    textAlign: 'center',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  pcMarker: { outline: `2px solid ${tokens.colorPaletteBlueBorderActive}` },
  mMarker: { outline: `2px solid ${tokens.colorPaletteGreenBorder2}` },
  footer: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
  },
});

function toHex(v: number, width: number) {
  const mask = width <= 2 ? 0xff : 0xffff;
  const n = (v ?? 0) & mask;
  return n.toString(16).toUpperCase().padStart(width, '0');
}
function toBin(v: number, width: number) {
  const mask = width <= 2 ? 0xff : 0xffff;
  const n = (v ?? 0) & mask;
  return n.toString(2).padStart(width * 4, '0');
}
function toDec(v: number) {
  return String(v ?? 0);
}

export type EmulatorHandle = {
  load: (values: Uint8Array) => void;
  reset: () => void;
  run: () => void;
  stop: () => void;
  step: () => boolean;
  setIpr: (n: number) => void;
};

export default function Emulator({ assembly }: EmulatorProps) {
  const classes = useStyles();

  // Emulation state kept in refs (hot path)
  const memoryRef = useRef<number[]>(new Array(32768));
  const regsRef = useRef({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    I: 0,
    PC: 0,
    M: 0,
    XY: 0,
    J: 0,
    FZ: false,
    FS: false,
    FC: false,
    PS: 0,
    cycles: 0,
  });
  const runningRef = useRef(false);
  const iprRef = useRef<number>(parseInt(localStorage.getItem('emu_ipr') || '1') || 1);

  // UI state that we render
  const [memoryOffset, setMemoryOffset] = useState(0);
  const [snapshot, setSnapshot] = useState(() => snap(regsRef.current));
  const [ipr, setIprUi] = useState(iprRef.current);
  const [status, setStatus] = useState<{ type: 'info' | 'success'; text: string }>({
    type: 'info',
    text: 'Ready',
  });

  function snap(r: typeof regsRef.current) {
    return {
      A: r.A,
      B: r.B,
      C: r.C,
      D: r.D,
      I: r.I,
      PC: r.PC,
      M: r.M,
      XY: r.XY,
      J: r.J,
      FZ: r.FZ,
      FS: r.FS,
      FC: r.FC,
      PS: r.PS,
      cycles: r.cycles,
    };
  }

  const setIpr = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(32, Math.floor(n)));
    iprRef.current = clamped;
    setIprUi(clamped);
    localStorage.setItem('emu_ipr', String(clamped));
  }, []);

  const countCycles = (n: number) => {
    regsRef.current.cycles += n;
    setStatusFromCycles(regsRef.current.cycles);
  };

  const setStatusFromCycles = (cycles: number) => {
    const d = Math.floor(cycles / 12);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d - h * 3600) / 60);
    const s = d - h * 3600 - m * 60;
    setStatus({
      type: 'success',
      text: `${cycles} cycles, ${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s runtime`,
    });
  };

  const getMov8 = [
    () => regsRef.current.A,
    () => regsRef.current.B,
    () => regsRef.current.C,
    () => regsRef.current.D,
    () => (regsRef.current.M & 0xff00) >> 8,
    () => regsRef.current.M & 0x00ff,
    () => (regsRef.current.XY & 0xff00) >> 8,
    () => regsRef.current.XY & 0x00ff,
  ] as Array<() => number>;

  const setMov8 = [
    (v: number) => (regsRef.current.A = v & 0xff),
    (v: number) => (regsRef.current.B = v & 0xff),
    (v: number) => (regsRef.current.C = v & 0xff),
    (v: number) => (regsRef.current.D = v & 0xff),
    (v: number) => (regsRef.current.M = (regsRef.current.M & 0x00ff) | ((v & 0xff) << 8)),
    (v: number) => (regsRef.current.M = (regsRef.current.M & 0xff00) | (v & 0xff)),
    (v: number) => (regsRef.current.XY = (regsRef.current.XY & 0x00ff) | ((v & 0xff) << 8)),
    (v: number) => (regsRef.current.XY = (regsRef.current.XY & 0xff00) | (v & 0xff)),
  ] as Array<(v: number) => void>;

  const loadReg = [
    (v: number) => (regsRef.current.A = v & 0xff),
    (v: number) => (regsRef.current.B = v & 0xff),
    (v: number) => (regsRef.current.C = v & 0xff),
    (v: number) => (regsRef.current.D = v & 0xff),
  ] as Array<(v: number) => void>;

  const saveReg = [
    () => regsRef.current.A & 0xff,
    () => regsRef.current.B & 0xff,
    () => regsRef.current.C & 0xff,
    () => regsRef.current.D & 0xff,
    () => 0,
  ] as Array<() => number>;

  const getMov16 = [
    () => regsRef.current.M & 0xffff,
    () => regsRef.current.XY & 0xffff,
    () => regsRef.current.J & 0xffff,
    () => 0,
  ] as Array<() => number>;

  const setMov16 = [
    (v: number) => (regsRef.current.XY = v & 0xffff),
    (v: number) => (regsRef.current.PC = v & 0xffff),
  ] as Array<(v: number) => void>;

  const aluFunc = [
    () => 0,
    () => regsRef.current.B + regsRef.current.C,
    () => regsRef.current.B + 1,
    () => regsRef.current.B & regsRef.current.C,
    () => regsRef.current.B | regsRef.current.C,
    () => regsRef.current.B ^ regsRef.current.C,
    () => ~regsRef.current.B & 0xff,
    () => ((regsRef.current.B & 0x80) === 0x80 ? (regsRef.current.B << 1) + 1 : regsRef.current.B << 1),
  ] as Array<() => number>;

  const reset = useCallback(() => {
    memoryRef.current = new Array(32768);
    const r = regsRef.current;
    r.A = r.B = r.C = r.D = 0;
    r.I = r.PC = 0;
    r.M = r.XY = r.J = 0;
    r.FC = r.FS = r.FZ = false;
    r.PS = 0;
    r.cycles = 0;
    setStatus({ type: 'info', text: 'Ready' });
    setSnapshot(snap(r));
  }, []);

  const load = useCallback(
    (values: Uint8Array) => {
      if (values.length > 2) {
        reset();
        const offset = values[0] + (values[1] << 8);
        const prog = values.slice(2);
        for (let i = 0; i < prog.length; i++) {
          memoryRef.current[(offset + i) & 0x7fff] = prog[i] & 0xff;
        }
        regsRef.current.PC = offset & 0xffff;
        setSnapshot(snap(regsRef.current));
      }
    },
    [reset]
  );

  const step = useCallback((): boolean => {
    const mem = memoryRef.current;
    const r = regsRef.current;

    const instr = (r.I = mem[r.PC] ?? 0);

    // SETAB 01rvvvvv
    if ((instr & 0xc0) === 0x40) {
      const isB = (instr & 0x20) === 0x20;
      const v = (instr & 0x10) === 0x10 ? (instr & 0x0f) + 0xf0 : instr & 0x0f;
      if (isB) r.B = v & 0xff;
      else r.A = v & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(8);
      return true;
    }

    // MOV8 00dddsss
    if ((instr & 0xc0) === 0x00) {
      const d = (instr & 0x38) >> 3;
      const s = instr & 0x07;
      const v = d === s ? 0 : getMov8[s]();
      setMov8[d](v);
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(8);
      return true;
    }

    // ALU 1000rfff
    if ((instr & 0xf0) === 0x80) {
      const toD = (instr & 0x08) === 0x08;
      const f = instr & 0x07;
      const v = aluFunc[f]();
      r.FZ = (v & 0xff) === 0;
      r.FC = (v & 0x100) === 0x100;
      r.FS = (v & 0x80) === 0x80;
      const res = v & 0xff;
      if (toD) r.D = res;
      else r.A = res;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(8);
      return true;
    }

    // LOAD 100100dd
    if ((instr & 0xfc) === 0x90) {
      const d = instr & 0x03;
      const v = mem[r.M & 0x7fff] ?? 0;
      r.PC = (r.PC + 1) & 0xffff;
      loadReg[d](v);
      countCycles(12);
      return true;
    }

    // STORE 100110ss
    if ((instr & 0xfc) === 0x98) {
      const s = instr & 0x03;
      const v = saveReg[s]();
      r.PC = (r.PC + 1) & 0xffff;
      mem[r.M & 0x7fff] = v & 0xff;
      countCycles(12);
      return true;
    }

    // MOV16 10100dss
    if ((instr & 0xf8) === 0xa0) {
      const d = (instr & 0x04) >> 2;
      const s = instr & 0x03;
      const v = d === 0 && s === 1 ? 0 : getMov16[s]();
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(10);
      setMov16[d](v);
      return true;
    }

    // LDSW 1010110d
    if ((instr & 0xfe) === 0xac) {
      const toD = (instr & 0x01) === 0x01;
      if (toD) r.D = r.PS & 0xff;
      else r.A = r.PS & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(10);
      return true;
    }

    // HALT 1010111r
    if ((instr & 0xfe) === 0xae) {
      const doJump = (instr & 0x01) === 0x01;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(10);
      if (doJump) r.PC = r.PS & 0xffff;
      return false;
    }

    // INCXY 10110000
    if ((instr & 0xff) === 0xb0) {
      r.XY = (r.XY + 1) & 0xffff;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(14);
      return true;
    }

    // GOTO 11dscznx
    if ((instr & 0xc0) === 0xc0) {
      const d = (instr & 0x20) === 0x20;
      const s = (instr & 0x10) === 0x10;
      const c = (instr & 0x08) === 0x08;
      const z = (instr & 0x04) === 0x04;
      const n = (instr & 0x02) === 0x02;
      const x = (instr & 0x01) === 0x01;

      r.PC = (r.PC + 1) & 0xffff;
      let tgt = ((mem[r.PC] ?? 0) << 8) & 0xff00;

      r.PC = (r.PC + 1) & 0xffff;
      tgt += (mem[r.PC] ?? 0) & 0x00ff;

      if (d) r.J = tgt & 0xffff;
      else r.M = tgt & 0xffff;

      r.PC = (r.PC + 1) & 0xffff;
      if (x) r.XY = r.PC & 0xffff;

      const jmp = (s && r.FS) || (c && r.FC) || (z && r.FZ) || (n && !r.FZ);
      if (jmp) r.PC = tgt & 0xffff;

      countCycles(24);
      return true;
    }

    return false;
  }, []);

  const runLoop = useCallback(() => {
    if (!runningRef.current) return;
    let stillRun = true;
    for (let i = 0; i < iprRef.current; i++) {
      stillRun = step();
      if (!stillRun || !runningRef.current) break;
    }
    if (stillRun) {
      // schedule next slice
      setTimeout(runLoop, 1);
    } else {
      runningRef.current = false;
    }
    // Commit a snapshot for UI
    setSnapshot(snap(regsRef.current));
  }, [step]);

  const run = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    runLoop();
  }, [runLoop]);

  const stop = useCallback(() => {
    runningRef.current = false;
  }, []);

  const flipBit = useCallback((pos: number) => {
    regsRef.current.PS = regsRef.current.PS ^ (1 << pos);
    setSnapshot(snap(regsRef.current));
  }, []);

  // Render helpers
  const rows = useMemo(() => [...Array(8).keys()], []);
  const cols = useMemo(() => [...Array(16).keys()], []);

  const prevOffset = () => setMemoryOffset(o => Math.max(0, o - 128));
  const nextOffset = () => setMemoryOffset(o => Math.min(32640, o + 128));

  // Auto-load when assembly succeeds
  useEffect(() => {
    if (assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2) {
      console.log('Emulator loading assembled program');
      // Optional: stop any running loop before loading
      runningRef.current = false;
      // Reset then load program
      reset();
      load(assembly.bytes);
      setStatus({ type: 'success', text: `Program loaded (${assembly.bytes.length - 2} bytes)` });
    } else if (assembly && !assembly.didAssemble) {
      runningRef.current = false;
      setStatus({ type: 'info', text: 'Assembly failed' });
      // You may choose to keep previous program resident, or clear memory:
      // reset();
    }
  }, [assembly, reset, load]);

  const canRun = !!(assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.tablesRow}>
          {/* 8-bit registers */}
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>A</th>
                <th className={classes.th}>B</th>
                <th className={classes.th}>C</th>
                <th className={classes.th}>D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {[snapshot.A, snapshot.B, snapshot.C, snapshot.D].map((v, i) => (
                  <td key={i} className={classes.td}>
                    <Tooltip
                      relationship='label'
                      content={
                        <div>
                          <small>Register {String.fromCharCode(65 + i)}</small>
                          <br />
                          <code>
                            Hex: {toHex(v, 2)}
                            <br />
                            Bin: {toBin(v, 2)}
                            <br />
                            Dec: {toDec(v)}
                          </code>
                        </div>
                      }
                    >
                      <code className={classes.code}>{toHex(v, 2)}</code>
                    </Tooltip>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Control registers */}
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>I</th>
                <th className={classes.th}>PC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={classes.td}>
                  <Tooltip
                    relationship='label'
                    content={
                      <div>
                        <small>Instruction</small>
                        <br />
                        <code>
                          Hex: {toHex(snapshot.I, 2)}
                          <br />
                          Bin: {toBin(snapshot.I, 2)}
                        </code>
                      </div>
                    }
                  >
                    <code className={classes.code}>{toHex(snapshot.I, 2)}</code>
                  </Tooltip>
                </td>
                <td className={classes.td}>
                  <Tooltip
                    relationship='label'
                    content={
                      <div>
                        <small>Program Counter</small>
                        <br />
                        <code>Hex: {toHex(snapshot.PC, 4)}</code>
                      </div>
                    }
                  >
                    <code className={classes.code}>{toHex(snapshot.PC, 4)}</code>
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 16-bit registers M, XY, J */}
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>M</th>
                <th className={classes.th}>XY</th>
                <th className={classes.th}>J</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  { label: 'M', val: snapshot.M, hi: (snapshot.M >> 8) & 0xff, lo: snapshot.M & 0xff },
                  { label: 'XY', val: snapshot.XY, hi: (snapshot.XY >> 8) & 0xff, lo: snapshot.XY & 0xff },
                  { label: 'J', val: snapshot.J, hi: (snapshot.J >> 8) & 0xff, lo: snapshot.J & 0xff },
                ].map((reg, idx) => (
                  <td key={idx} className={classes.td}>
                    <Tooltip
                      relationship='label'
                      content={
                        <div>
                          <small>Register {reg.label}</small>
                          <br />
                          <code>
                            Hex: {toHex(reg.val, 4)}
                            <br />
                            Dec: {toDec(reg.val)}
                          </code>
                          <hr />
                          <small>{reg.label === 'XY' ? 'X' : reg.label + '1'}</small>
                          <code>
                            <br />
                            Hex: {toHex(reg.hi, 2)}
                            <br />
                            Bin: {toBin(reg.hi, 2)}
                            <br />
                            Dec: {toDec(reg.hi)}
                          </code>
                          <hr />
                          <small>{reg.label === 'XY' ? 'Y' : reg.label + '2'}</small>
                          <code>
                            <br />
                            Hex: {toHex(reg.lo, 2)}
                            <br />
                            Bin: {toBin(reg.lo, 2)}
                            <br />
                            Dec: {toDec(reg.lo)}
                          </code>
                        </div>
                      }
                    >
                      <code className={classes.code}>{toHex(reg.val, 4)}</code>
                    </Tooltip>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Primary switches */}
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>PS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={classes.td}>
                  <Tooltip
                    relationship='label'
                    content={
                      <div>
                        <small>Primary Switches</small>
                        <br />
                        <code>
                          Hex: {toHex(snapshot.PS, 2)}
                          <br />
                          Bin: {toBin(snapshot.PS, 2)}
                          <br />
                          Dec: {toDec(snapshot.PS)}
                        </code>
                      </div>
                    }
                  >
                    <code className={classes.code}>{toHex(snapshot.PS, 2)}</code>
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={classes.controlsRow}>
          {runningRef.current ? (
            <Button appearance='primary' onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button onClick={run} disabled={!canRun}>
              Run
            </Button>
          )}
          <Button
            onClick={() => {
              const r = step();
              setSnapshot(snap(regsRef.current));
              if (!r) runningRef.current = false;
            }}
            disabled={!canRun}
          >
            Step
          </Button>
          <Button onClick={reset}>Reset</Button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Caption1>IPR</Caption1>
            <Button size='small' appearance='subtle' disabled={ipr === 1} onClick={() => setIpr(ipr / 2)}>
              -
            </Button>
            <span>{ipr}</span>
            <Button size='small' appearance='subtle' disabled={ipr === 32} onClick={() => setIpr(ipr * 2)}>
              +
            </Button>
          </div>
        </div>

        {!canRun && (
          <div style={{ color: tokens.colorNeutralForeground3 }}>
            {assembly?.didAssemble === false
              ? 'Assembly failed. Fix issues and re-assemble.'
              : 'No program loaded. Assemble code to run it here.'}
          </div>
        )}

        <div className={classes.switchesRow}>
          {[7, 6, 5, 4, 3, 2, 1, 0].map(bit => {
            const on = !!(snapshot.PS & (1 << bit));
            return (
              <button
                key={bit}
                className={`${classes.switchBtn} ${on ? classes.switchActive : ''}`}
                onClick={() => flipBit(bit)}
                aria-pressed={on}
                title={`Primary switch ${bit}`}
              >
                {bit}
              </button>
            );
          })}
        </div>

        {/* Memory table */}
        <table className={classes.memoryTable}>
          <thead>
            <tr>
              <th className={classes.memTh} style={{ width: 24 }}>
                {memoryOffset >= 128 && (
                  <button onClick={prevOffset} aria-label='Previous page'>
                    {'<'}
                  </button>
                )}
              </th>
              <th className={classes.memTh} colSpan={14}>
                Memory (offset <code className={classes.code}>{toHex(memoryOffset, 4)}</code>)
              </th>
              <th className={classes.memTh} style={{ width: 24, textAlign: 'right' }}>
                {memoryOffset < 32640 && (
                  <button onClick={nextOffset} aria-label='Next page'>
                    {'>'}
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r}>
                {cols.map(c => {
                  const addr = memoryOffset + r * 16 + c;
                  const v = memoryRef.current[addr] ?? 0;
                  const isPC = (snapshot.PC & 0xffff) === addr;
                  const isM = (snapshot.M & 0xffff) === addr;
                  return (
                    <td
                      key={c}
                      className={`${classes.memTd} ${isPC ? classes.pcMarker : ''} ${isM ? classes.mMarker : ''}`}
                    >
                      <Tooltip
                        relationship='label'
                        content={
                          <div>
                            <small>Memory Slot</small>
                            <br />
                            <code>
                              Address: {toHex(addr, 4)}
                              <br />
                              Hex: {toHex(v, 2)}
                              <br />
                              Bin: {toBin(v, 2)}
                              <br />
                              Dec: {toDec(v)}
                            </code>
                          </div>
                        }
                      >
                        <code className={classes.code}>{toHex(v, 2)}</code>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={classes.footer}>
        <span>{status.text}</span>
      </div>
    </div>
  );
}
