import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Tooltip,
  makeStyles,
  tokens,
  Caption1,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { Settings16Regular } from '@fluentui/react-icons';
import type { EmulatorProps } from './types';
import { Section, SectionContent, SectionFooter } from '../shared';
import EmulatorDiagram from './emu-diagram';
import EmulatorMemory from './emu-memory';

export type Snapshot = {
  A: number;
  B: number;
  C: number;
  D: number;
  I: number;
  PC: number;
  M: number;
  XY: number;
  J: number;
  FZ: boolean;
  FS: boolean;
  FC: boolean;
  PS: number;
  CLS: string;
  cycles: number;
};

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
  status: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

class EmulatorCore {
  private memory: number[];
  private regs: Snapshot;

  constructor(size = 32768) {
    this.memory = new Array(size);
    this.regs = {
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
      CLS: 'MOV8',
      cycles: 0,
    };
  }

  getMemory(): number[] {
    return this.memory;
  }

  getSnapshot(): Snapshot {
    const r = this.regs;
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

  private countCycles(n: number) {
    this.regs.cycles += n;
  }

  reset(): void {
    this.memory = new Array(32768);
    const r = this.regs;
    r.A = r.B = r.C = r.D = 0;
    r.I = r.PC = 0;
    r.M = r.XY = r.J = 0;
    r.FC = r.FS = r.FZ = false;
    r.PS = 0;
    r.cycles = 0;
  }

  load(values: Uint8Array): void {
    if (values.length <= 2) return;
    this.reset();
    const offset = values[0] + (values[1] << 8);
    const prog = values.slice(2);
    for (let i = 0; i < prog.length; i++) {
      this.memory[(offset + i) & 0x7fff] = prog[i] & 0xff;
    }
    this.regs.PC = offset & 0xffff;
  }

  // Decoders and helpers (moved from component)
  private get getMov8() {
    const r = this.regs;
    return [
      () => r.A,
      () => r.B,
      () => r.C,
      () => r.D,
      () => (r.M & 0xff00) >> 8,
      () => r.M & 0x00ff,
      () => (r.XY & 0xff00) >> 8,
      () => r.XY & 0x00ff,
    ] as Array<() => number>;
  }
  private get setMov8() {
    const r = this.regs;
    return [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff),
      (v: number) => (r.M = (r.M & 0x00ff) | ((v & 0xff) << 8)),
      (v: number) => (r.M = (r.M & 0xff00) | (v & 0xff)),
      (v: number) => (r.XY = (r.XY & 0x00ff) | ((v & 0xff) << 8)),
      (v: number) => (r.XY = (r.XY & 0xff00) | (v & 0xff)),
    ] as Array<(v: number) => void>;
  }
  private get loadReg() {
    const r = this.regs;
    return [
      (v: number) => (r.A = v & 0xff),
      (v: number) => (r.B = v & 0xff),
      (v: number) => (r.C = v & 0xff),
      (v: number) => (r.D = v & 0xff),
    ] as Array<(v: number) => void>;
  }
  private get saveReg() {
    const r = this.regs;
    return [() => r.A & 0xff, () => r.B & 0xff, () => r.C & 0xff, () => r.D & 0xff, () => 0] as Array<() => number>;
  }
  private get getMov16() {
    const r = this.regs;
    return [() => r.M & 0xffff, () => r.XY & 0xffff, () => r.J & 0xffff, () => 0] as Array<() => number>;
  }
  private get setMov16() {
    const r = this.regs;
    return [(v: number) => (r.XY = v & 0xffff), (v: number) => (r.PC = v & 0xffff)] as Array<(v: number) => void>;
  }
  private get aluFunc() {
    const r = this.regs;
    return [
      () => 0,
      () => r.B + r.C,
      () => r.B + 1,
      () => r.B & r.C,
      () => r.B | r.C,
      () => r.B ^ r.C,
      () => ~r.B & 0xff,
      () => ((r.B & 0x80) === 0x80 ? (r.B << 1) + 1 : r.B << 1),
    ] as Array<() => number>;
  }

  step(): boolean {
    const mem = this.memory;
    const r = this.regs;

    const instr = (r.I = mem[r.PC] ?? 0);

    // SETAB 01rvvvvv
    if ((instr & 0xc0) === 0x40) {
      r.CLS = 'SETAB';
      const isB = (instr & 0x20) === 0x20;
      const v = (instr & 0x10) === 0x10 ? (instr & 0x0f) + 0xf0 : instr & 0x0f;
      if (isB) r.B = v & 0xff;
      else r.A = v & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // MOV8 00dddsss
    if ((instr & 0xc0) === 0x00) {
      r.CLS = 'MOV8';
      const d = (instr & 0x38) >> 3;
      const s = instr & 0x07;
      const v = d === s ? 0 : this.getMov8[s]();
      this.setMov8[d](v);
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // ALU 1000rfff
    if ((instr & 0xf0) === 0x80) {
      r.CLS = 'ALU';
      const toD = (instr & 0x08) === 0x08;
      const f = instr & 0x07;
      const v = this.aluFunc[f]();
      r.FZ = (v & 0xff) === 0;
      r.FC = (v & 0x100) === 0x100;
      r.FS = (v & 0x80) === 0x80;
      const res = v & 0xff;
      if (toD) r.D = res;
      else r.A = res;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(8);
      return true;
    }

    // LOAD 100100dd
    if ((instr & 0xfc) === 0x90) {
      r.CLS = 'LOAD';
      const d = instr & 0x03;
      const v = mem[r.M & 0x7fff] ?? 0;
      r.PC = (r.PC + 1) & 0xffff;
      this.loadReg[d](v);
      this.countCycles(12);
      return true;
    }

    // STORE 100110ss
    if ((instr & 0xfc) === 0x98) {
      r.CLS = 'STORE';
      const s = instr & 0x03;
      const v = this.saveReg[s]();
      r.PC = (r.PC + 1) & 0xffff;
      mem[r.M & 0x7fff] = v & 0xff;
      this.countCycles(12);
      return true;
    }

    // MOV16 10100dss
    if ((instr & 0xf8) === 0xa0) {
      r.CLS = 'MOV16';
      const d = (instr & 0x04) >> 2;
      const s = instr & 0x03;
      const v = d === 0 && s === 1 ? 0 : this.getMov16[s]();
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      this.setMov16[d](v);
      return true;
    }

    // LDSW 1010110d
    if ((instr & 0xfe) === 0xac) {
      r.CLS = 'MISC';
      const toD = (instr & 0x01) === 0x01;
      if (toD) r.D = r.PS & 0xff;
      else r.A = r.PS & 0xff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      return true;
    }

    // HALT 1010111r
    if ((instr & 0xfe) === 0xae) {
      r.CLS = 'MISC';
      const doJump = (instr & 0x01) === 0x01;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(10);
      if (doJump) r.PC = r.PS & 0xffff;
      return false;
    }

    // INCXY 10110000
    if ((instr & 0xff) === 0xb0) {
      r.CLS = 'INCXY';
      r.XY = (r.XY + 1) & 0xffff;
      r.PC = (r.PC + 1) & 0xffff;
      this.countCycles(14);
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

      this.countCycles(24);
      return true;
    }

    r.CLS = '???';
    return false;
  }

  // Direct accessors used by UI switches
  flipPrimarySwitchBit(pos: number) {
    this.regs.PS = this.regs.PS ^ (1 << pos);
  }
}

export default function Emulator({ assembly }: EmulatorProps) {
  const classes = useStyles();

  // Emulation state kept in refs (hot path)
  const coreRef = useRef<EmulatorCore>(new EmulatorCore());
  const runningRef = useRef(false);
  const iprRef = useRef<number>(parseInt(localStorage.getItem('emu_ipr') || '1') || 1);

  // UI state that we render
  const [running, setRunning] = useState(false);
  const [memoryOffset, setMemoryOffset] = useState(0);
  const [snapshot, setSnapshot] = useState<Snapshot>(() => coreRef.current.getSnapshot());
  const [ipr, setIprState] = useState(iprRef.current);
  const [statusText, setStatusText] = useState('Ready');

  const rafRef = useRef<number | null>(null);
  const commitSnapshot = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const snap = coreRef.current.getSnapshot();
      setSnapshot(snap);

      // Only auto-update status while running
      if (runningRef.current) {
        setStatusFromCycles(snap.cycles);
      }
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const setIpr = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(32, Math.floor(n)));
    iprRef.current = clamped;
    setIprState(clamped);
    localStorage.setItem('emu_ipr', String(clamped));
  }, []);

  const setStatusFromCycles = (cycles: number) => {
    const d = Math.floor(cycles / 12);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d - h * 3600) / 60);
    const s = d - h * 3600 - m * 60;
    setStatusText(`${cycles} cycles, ${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s runtime`);
  };

  const reset = useCallback(() => {
    // Reset core state
    coreRef.current.reset();

    // If we have a successfully assembled program, reload it
    const bytes = assembly?.bytes;
    if (assembly?.didAssemble && bytes && bytes.length > 2) {
      coreRef.current.load(bytes);
      setStatusText(`Reset & Program reloaded (${bytes.length - 2} bytes)`);
    } else {
      setStatusText('Reset');
    }
    // Commit a snapshot for UI
    commitSnapshot();
  }, [assembly, commitSnapshot]);

  const load = useCallback(
    (values: Uint8Array) => {
      if (values.length > 2) {
        coreRef.current.load(values);
        commitSnapshot();
      }
    },
    [commitSnapshot]
  );

  const step = useCallback((): boolean => {
    const cont = coreRef.current.step();
    // snapshot + status are committed via commitSnapshot batching in runLoop or when Step button is clicked
    return cont;
  }, []);

  const runLoop = useCallback(() => {
    if (!runningRef.current) return;
    let stillRun = true;
    for (let i = 0; i < iprRef.current; i++) {
      stillRun = coreRef.current.step();
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
    commitSnapshot();
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

  const flipBit = useCallback(
    (pos: number) => {
      coreRef.current.flipPrimarySwitchBit(pos);
      commitSnapshot();
    },
    [commitSnapshot]
  );

  const prevOffset = useCallback(() => setMemoryOffset(o => Math.max(0, o - 128)), []);
  const nextOffset = useCallback(() => setMemoryOffset(o => Math.min(32640, o + 128)), []);

  // Auto-load when assembly succeeds
  useEffect(() => {
    if (assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2) {
      // Optional: stop any running loop before loading
      runningRef.current = false;
      // Reset then load program
      reset();
      load(assembly.bytes);
      setStatusText(`Program loaded (${assembly.bytes.length - 2} bytes)`);
    } else if (assembly && !assembly.didAssemble) {
      runningRef.current = false;
      setStatusText('Assembly failed');
      // You may choose to keep previous program resident, or clear memory:
      // reset();
    }
  }, [assembly, reset, load]);

  const setMemoryOffsetClamped = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(32640, Math.floor(next / 16) * 16));
    setMemoryOffset(clamped);
  }, []);

  const canRun = !!(assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2);

  return (
    <Section title='Emulator'>
      <SectionContent>
        <div className={classes.content}>
          <EmulatorDiagram snapshot={snapshot} />

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
                  commitSnapshot();
                  if (!r) runningRef.current = false;
                }}
                disabled={running || !canRun}
              >
                Step
              </Button>
              <Button size='small' onClick={reset} disabled={running || !canRun} style={{ minWidth: 0, flexGrow: 1 }}>
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
                  <Tooltip
                    key={bit}
                    relationship='label'
                    content={`Primary switch ${bit}`}
                    withArrow
                    appearance='inverted'
                  >
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
            <EmulatorMemory
              memory={coreRef.current.getMemory()}
              pc={snapshot.PC}
              m={snapshot.M}
              offset={memoryOffset}
              onPrevPage={prevOffset}
              onNextPage={nextOffset}
              onSetOffset={setMemoryOffsetClamped}
            />
          </div>
        </div>
      </SectionContent>
      <SectionFooter>
        <span className={classes.status}>{statusText}</span>
      </SectionFooter>
    </Section>
  );
}
