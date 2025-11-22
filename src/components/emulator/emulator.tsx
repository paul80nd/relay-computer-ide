import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Tooltip,
  makeStyles,
  tokens,
  Caption1,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Badge,
} from '@fluentui/react-components';
import { CaretLeft16Filled, CaretRight16Filled, Settings16Regular } from '@fluentui/react-icons';
import type { EmulatorProps } from './types';
import { Section, SectionContent, SectionFooter } from '../shared';

const useStyles = makeStyles({
  content: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL} 0`,
    overflow: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  tablesRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalSNudge,
  },
  table: {
    flexGrow: 1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
  },
  td: {
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  dot: { fontSize: '16px' },
  controlsRow: {
    display: 'flex',
    flexGrow: 1,
    gap: tokens.spacingHorizontalXS,
  },
  switchesRow: {
    display: 'flex',
    flexGrow: 1,
    gap: tokens.spacingHorizontalXS,
  },
  switchBtn: {
    flexGrow: 1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    userSelect: 'none',
  },
  switchActive: {
    background: tokens.colorNeutralBackground1Hover,
    border: `1px solid ${tokens.colorBrandForeground2}`,
  },
  memoryTable: {
    flexGrow: 1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  memTh: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
  },
  memTd: {
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  pcMarker: { outline: `2px solid ${tokens.colorPaletteBlueBorderActive}` },
  mMarker: { outline: `2px solid ${tokens.colorPaletteGreenBorder2}` },
  status: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  dgBus: {
    borderRight: `3px solid ${tokens.colorBrandStroke2}`,
  },
  dgLink: {
    borderTop: `2px solid ${tokens.colorBrandStroke2}`,
  },
  dgLinkU: {
    borderBottom: `2px solid ${tokens.colorBrandStroke2}`,
  },
  dgR8V: {
    margin: '1px 0',
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingHorizontalXXS} ${tokens.spacingHorizontalM}`,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
  },
  dgR16V: {
    margin: '1px 0',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalM}`,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
  },
  dgRLab: {
    margin: '1px 0',
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    alignContent: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
  },
  dgR8E: {
    margin: '1px 0',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
  },
  dgPCV: {
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalM}`,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
  },
  dgPCLab: {
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
  },
  dgAILab: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    color: tokens.colorNeutralForeground2,
  },
  dgAIBL: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
  },
  dgAIBM: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
  },
  dgAIBR: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
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
    CLS: 'MOV8',
    PS: 0,
    cycles: 0,
  });
  const runningRef = useRef(false);
  const iprRef = useRef<number>(parseInt(localStorage.getItem('emu_ipr') || '1') || 1);

  // UI state that we render
  const [running, setRunning] = useState(false);
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
      CLS: r.CLS,
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
      r.CLS = 'SETAB';
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
      r.CLS = 'MOV8';
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
      r.CLS = 'ALU';
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
      r.CLS = 'LOAD';
      const d = instr & 0x03;
      const v = mem[r.M & 0x7fff] ?? 0;
      r.PC = (r.PC + 1) & 0xffff;
      loadReg[d](v);
      countCycles(12);
      return true;
    }

    // STORE 100110ss
    if ((instr & 0xfc) === 0x98) {
      r.CLS = 'STORE';
      const s = instr & 0x03;
      const v = saveReg[s]();
      r.PC = (r.PC + 1) & 0xffff;
      mem[r.M & 0x7fff] = v & 0xff;
      countCycles(12);
      return true;
    }

    // MOV16 10100dss
    if ((instr & 0xf8) === 0xa0) {
      r.CLS = 'MOV16';
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
      r.CLS = 'MISC';
      const toD = (instr & 0x01) === 0x01;
      if (toD) r.D = r.PS & 0xff;
      else r.A = r.PS & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(10);
      return true;
    }

    // HALT 1010111r
    if ((instr & 0xfe) === 0xae) {
      r.CLS = 'MISC';
      const doJump = (instr & 0x01) === 0x01;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(10);
      if (doJump) r.PC = r.PS & 0xffff;
      return false;
    }

    // INCXY 10110000
    if ((instr & 0xff) === 0xb0) {
      r.CLS = 'INCXY';
      r.XY = (r.XY + 1) & 0xffff;
      r.PC = (r.PC + 1) & 0xffff;
      countCycles(14);
      return true;
    }

    // GOTO 11dscznx
    if ((instr & 0xc0) === 0xc0) {
      r.CLS = 'GOTO';
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

    r.CLS = '???';
    return false;
  }, []);

  const runLoop = useCallback(() => {
    if (!runningRef.current) return;
    let stillRun = true;
    for (let i = 0; i < iprRef.current; i++) {
      stillRun = step();
      if (!stillRun || !runningRef.current) break;
    }
    if (stillRun && runningRef.current) {
      // schedule next slice
      setTimeout(runLoop, 1);
    } else {
      runningRef.current = false;
      setRunning(false);
    }
    // Commit a snapshot for UI
    setSnapshot(snap(regsRef.current));
  }, [step]);

  const run = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    runLoop();
  }, [runLoop]);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
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

  const reg8 = (label: string, v: number, from: number, to: number) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={
          <div>
            <small>Register {label}</small>
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
        <div className={classes.dgR8V} style={{ gridColumn: '3 / 3', gridRow: `${from} / ${to}` }}>
          <code className={classes.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={classes.dgRLab} style={{ gridColumn: '4 / 5', gridRow: `${from} / ${to}` }}></div>
      <div className={classes.dgRLab} style={{ gridColumn: '5 / 6', gridRow: `${from} / ${to}` }}>
        {label}
      </div>
      <div className={classes.dgR8E} style={{ gridColumn: '6 / 7', gridRow: `${from} / ${to}` }}></div>
    </>
  );

  const reg16L = (label: string, v: number, from: number, to: number) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={
          <div>
            <small>Register {label}</small>
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
        <div className={classes.dgR8V} style={{ gridColumn: '3 / 3', gridRow: `${from} / ${to}` }}>
          <code className={classes.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={classes.dgRLab} style={{ gridColumn: '4 / 5', gridRow: `${from} / ${to}` }}>
        {label}
      </div>
    </>
  );

  const reg16R = (label: string, v: number, from: number, to: number) => (
    <>
      <div className={classes.dgRLab} style={{ gridColumn: '5 / 6', gridRow: `${from} / ${to}` }}>
        {label}
      </div>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={
          <div>
            <small>Register {label}</small>
            <br />
            <code>
              Hex: {toHex(v, 4)}
              <br />
              Bin: {toBin(v, 4)}
              <br />
              Dec: {toDec(v)}
            </code>
          </div>
        }
      >
        <div className={classes.dgR16V} style={{ gridColumn: '6 / 7', gridRow: `${from} / ${to}` }}>
          <code className={classes.code}>{toHex(v, 4)}</code>
        </div>
      </Tooltip>
    </>
  );

  return (
    <Section title='Emulator'>
      <SectionContent>
        <div className={classes.content}>
          {/* Diagram */}
          <div
            className='diagram'
            style={{
              flexGrow: 1,
              display: 'grid',
              gridTemplateColumns: '3px 12px auto 1fr 1fr auto 12px 3px 12px 1fr 1fr 1fr',
              gridTemplateRows: 'repeat(20, 1fr)',
              textAlign: 'center',
            }}
          >
            {/* Data Bus */}
            <div className={classes.dgBus} style={{ gridColumn: '1 / 1', gridRow: '2 / 20' }}></div>
            {/* Data Links */}
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '2 / 2' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '4 / 4' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '6 / 6' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '8 / 8' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '10 / 10' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '12 / 12' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '14 / 14' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '16 / 16' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '2 / 2', gridRow: '18 / 18' }}></div>
            <div className={classes.dgLinkU} style={{ gridColumn: '2 / 2', gridRow: '19 / 19' }}></div>
            {/* Register A/B/C/D */}
            {reg8('A', snapshot.A, 1, 3)}
            {reg8('B', snapshot.B, 3, 5)}
            {reg8('C', snapshot.C, 5, 7)}
            {reg8('D', snapshot.D, 7, 9)}
            {/* Register M1/M2/M */}
            {reg16L('M1', (snapshot.M >> 8) & 0xff, 9, 11)}
            {reg16L('M2', snapshot.M & 0xff, 11, 13)}
            {reg16R('M', snapshot.M, 9, 13)}
            {/* Register X/Y/XY */}
            {reg16L('X', (snapshot.XY >> 8) & 0xff, 13, 15)}
            {reg16L('Y', snapshot.XY & 0xff, 15, 17)}
            {reg16R('XY', snapshot.XY, 13, 17)}
            {/* Register J1/J2/J */}
            {reg16L('J1', (snapshot.J >> 8) & 0xff, 17, 19)}
            {reg16L('J2', snapshot.J & 0xff, 19, 21)}
            {reg16R('J', snapshot.J, 17, 21)}
            {/* ALU Links */}
            <div className={classes.dgLink} style={{ gridColumn: '7 / 8', gridRow: '4 / 4' }}></div>
            <div className={classes.dgLinkU} style={{ gridColumn: '7 / 8', gridRow: '5 / 5' }}></div>
            <div className={classes.dgBus} style={{ gridColumn: '8 / 9', gridRow: '4 / 6' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '9 / 10', gridRow: '5 / 5' }}></div>
            {/* Links */}
            <div className={classes.dgLink} style={{ gridColumn: '7 / 8', gridRow: '11 / 12' }}></div>
            <div className={classes.dgLink} style={{ gridColumn: '7 / 8', gridRow: '15 / 16' }}></div>
            <div className={classes.dgLinkU} style={{ gridColumn: '7 / 8', gridRow: '18 / 19' }}></div>
            {/* Addr Bus */}
            <div className={classes.dgBus} style={{ gridColumn: '8 / 9', gridRow: '11 / 19' }}></div>
            {/* Links */}
            <div className={classes.dgLinkU} style={{ gridColumn: '9 / 10', gridRow: '18 / 19' }}></div>

            {/* Primary Switches */}
            <Tooltip
              withArrow
              appearance='inverted'
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
              <div className={classes.dgPCV} style={{ gridColumn: '10 / 12', gridRow: '15 / 17' }}>
                <code className={classes.code}>{toHex(snapshot.PS, 2)}</code>
              </div>
            </Tooltip>
            <div className={classes.dgPCLab} style={{ gridColumn: '12 / 13', gridRow: '15 / 17' }}>
              PS
            </div>

            {/* Program Counter */}
            <Tooltip
              withArrow
              appearance='inverted'
              relationship='label'
              content={
                <div>
                  <small>Program Counter</small>
                  <br />
                  <code>
                    Hex: {toHex(snapshot.PC, 4)}
                    <br />
                    Bin: {toBin(snapshot.PC, 4)}
                    <br />
                    Dec: {toDec(snapshot.PC)}
                  </code>
                </div>
              }
            >
              <div className={classes.dgPCV} style={{ gridColumn: '10 / 12', gridRow: '18 / 20' }}>
                <code className={classes.code}>{toHex(snapshot.PC, 4)}</code>
              </div>
            </Tooltip>
            <div className={classes.dgPCLab} style={{ gridColumn: '12 / 13', gridRow: '18 / 20' }}>
              PC
            </div>

            {/* ALU */}
            <div className={classes.dgAILab} style={{ gridColumn: '10 / 13', gridRow: '2 / 4' }}>
              ALU
            </div>
            <Tooltip
              withArrow
              appearance='inverted'
              relationship='label'
              content={
                <div>
                  <small>Sign Flag</small>
                  <br />
                  <code>{snapshot.FS ? 'SET' : 'CLEAR'} </code>
                </div>
              }
            >
              <div className={classes.dgAIBL} style={{ textAlign: 'right', gridColumn: '10 / 11', gridRow: '4 / 7' }}>
                <Badge shape='circular' color='brand' appearance={snapshot.FS ? 'filled' : 'outline'}>
                  S
                </Badge>
              </div>
            </Tooltip>
            <Tooltip
              withArrow
              appearance='inverted'
              relationship='label'
              content={
                <div>
                  <small>Carry Flag</small>
                  <br />
                  <code>{snapshot.FC ? 'SET' : 'CLEAR'} </code>
                </div>
              }
            >
              <div className={classes.dgAIBM} style={{ gridColumn: '11 / 12', gridRow: '4 / 7' }}>
                <Badge shape='circular' color='brand' appearance={snapshot.FC ? 'filled' : 'outline'}>
                  C
                </Badge>
              </div>
            </Tooltip>
            <Tooltip
              withArrow
              appearance='inverted'
              relationship='label'
              content={
                <div>
                  <small>Zero Flag</small>
                  <br />
                  <code>{snapshot.FZ ? 'SET' : 'CLEAR'} </code>
                </div>
              }
            >
              <div className={classes.dgAIBR} style={{ textAlign: 'left', gridColumn: '12 / 13', gridRow: '4 / 7' }}>
                <Badge shape='circular' color='brand' appearance={snapshot.FZ ? 'filled' : 'outline'}>
                  Z
                </Badge>
              </div>
            </Tooltip>

            {/* Instruction */}
            <div className={classes.dgAILab} style={{ gridColumn: '10 / 13', gridRow: '9 / 11' }}>
              Instruction
            </div>
            <Tooltip
              withArrow
              appearance='inverted'
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
              <div className={classes.dgAIBL} style={{ textAlign: 'right', gridColumn: '10 / 11', gridRow: '11 / 13' }}>
                <code className={classes.code}>{toHex(snapshot.I, 2)}</code>
              </div>
            </Tooltip>
            <div className={classes.dgAIBR} style={{ paddingLeft: '3px', gridColumn: '11 / 13', gridRow: '11 / 13' }}>
              <Badge size='small' shape='rounded' color='brand' appearance='outline'>
                {snapshot.CLS}
              </Badge>
            </div>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS }}>
            <div className={classes.controlsRow}>
              {running ? (
                <Button size='small' appearance='primary' onClick={stop} style={{ minWidth: 0, flexGrow: 1 }}>
                  Stop
                </Button>
              ) : (
                <Button size='small' onClick={run} disabled={!canRun} style={{ minWidth: 0, flexGrow: 1 }}>
                  Run
                </Button>
              )}
              <Button
                size='small'
                style={{ minWidth: 0, flexGrow: 1 }}
                onClick={() => {
                  const r = step();
                  setSnapshot(snap(regsRef.current));
                  if (!r) runningRef.current = false;
                }}
                disabled={!canRun}
              >
                Step
              </Button>
              <Button size='small' onClick={reset} style={{ minWidth: 0, flexGrow: 1 }}>
                Reset
              </Button>

              <Popover trapFocus>
                <PopoverTrigger disableButtonEnhancement>
                  <Button size='small' style={{ minWidth: 0, flexGrow: 1 }} icon={<Settings16Regular />} />
                </PopoverTrigger>

                <PopoverSurface>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Caption1>IPR</Caption1>
                    <Button size='small' appearance='subtle' disabled={ipr === 1} onClick={() => setIpr(ipr / 2)}>
                      -
                    </Button>
                    <span>{ipr}</span>
                    <Button size='small' appearance='subtle' disabled={ipr === 32} onClick={() => setIpr(ipr * 2)}>
                      +
                    </Button>
                  </div>
                </PopoverSurface>
              </Popover>
            </div>

            <div className={classes.switchesRow}>
              {[7, 6, 5, 4, 3, 2, 1, 0].map(bit => {
                const on = !!(snapshot.PS & (1 << bit));
                return (
                  <Tooltip relationship='label' content={`Primary switch ${bit}`} withArrow appearance='inverted'>
                    <button
                      key={bit}
                      className={`${classes.switchBtn} ${on ? classes.switchActive : ''}`}
                      onClick={() => flipBit(bit)}
                      aria-pressed={on}
                    >
                      {bit}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Memory table */}
          <div className={classes.tablesRow}>
            <table className={classes.memoryTable}>
              <thead>
                <tr>
                  <th className={classes.memTh} style={{ width: 24 }} colSpan={2}>
                    <Button
                      onClick={prevOffset}
                      disabled={memoryOffset === 0}
                      icon={<CaretLeft16Filled />}
                      size='small'
                      appearance='transparent'
                      style={{ minWidth: 0, flexGrow: 1 }}
                      aria-label='Previous page'
                    />
                  </th>
                  <th className={classes.memTh} colSpan={12}>
                    Memory (offset <code className={classes.code}>{toHex(memoryOffset, 4)}</code>)
                  </th>
                  <th className={classes.memTh} style={{ width: 24, textAlign: 'right' }} colSpan={2}>
                    <Button
                      disabled={memoryOffset >= 32640}
                      onClick={nextOffset}
                      icon={<CaretRight16Filled />}
                      size='small'
                      appearance='transparent'
                      aria-label='Next page'
                      style={{ minWidth: 0, flexGrow: 1 }}
                    />
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
                            withArrow
                            appearance='inverted'
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
        </div>
      </SectionContent>
      <SectionFooter>
        <span className={classes.status}>{status.text}</span>
      </SectionFooter>
    </Section>
  );
}
