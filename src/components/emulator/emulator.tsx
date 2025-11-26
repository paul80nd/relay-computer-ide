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
import { EmulatorCore, type Snapshot } from './emu-core';

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
  const [memVersion, setMemVersion] = useState(0);

  const rafRef = useRef<number | null>(null);
  const commitSnapshot = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const snap = coreRef.current.getSnapshot();
      setSnapshot(snap);
      setMemVersion(coreRef.current.getMemoryVersion());

      // Only auto-update status while running
      if (runningRef.current) {
        setStatusFromCycles(snap.cycles);
      }
    });
  }, []);

  /** Un-mounting clean up */
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      runningRef.current = false;
    },
    [],
  );

  /** Instructions-per-refresh handling */
  const setIpr = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(32, Math.floor(n)));
    iprRef.current = clamped;
    setIprState(clamped);
    localStorage.setItem('emu_ipr', String(clamped));
  }, []);

  /** Set current status from number of cycles emulated */
  const setStatusFromCycles = (cycles: number) => {
    const d = Math.floor(cycles / 12);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d - h * 3600) / 60);
    const s = d - h * 3600 - m * 60;
    setStatusText(
      `${cycles} cycles, ${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s runtime`,
    );
  };

  /** Reset emulator state (and reload asembled code if available) */
  const reset = useCallback(() => {
    runningRef.current = false; // ensure stopped
    setRunning(false);

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

  /** Single step the emulator */
  const step = useCallback((): boolean => {
    const cont = coreRef.current.step();
    // snapshot + status are committed via commitSnapshot batching in runLoop or when Step button is clicked
    return cont;
  }, []);

  /** Emulator run loop */
  const timeoutRef = useRef<number | null>(null);
  const runLoop = useCallback(() => {
    if (!runningRef.current) return;

    let stillRun = true;
    for (let i = 0; i < iprRef.current; i++) {
      stillRun = coreRef.current.step();
      if (!stillRun || !runningRef.current) break;
    }

    if (stillRun && runningRef.current) {
      // schedule next slice
      timeoutRef.current = setTimeout(runLoop, 1);
    } else {
      runningRef.current = false;
      setRunning(false);
      timeoutRef.current = null;
    }
    // Commit a snapshot for UI
    commitSnapshot();
  }, [commitSnapshot]);

  /** Check if core emulator is loaded */
  const isCoreLoaded = useCallback(() => {
    const snap = coreRef.current.getSnapshot();
    const mem = coreRef.current.getMemory();
    // Treat "loaded" as a non-undefined byte at PC (or any simple sentinel you prefer)
    return mem[snap.PC] !== undefined;
  }, []);

  /** Start the emulator running */
  const run = useCallback(() => {
    if (runningRef.current) return;
    // Prevent a no-op run if core isn't loaded yet
    if (!isCoreLoaded()) {
      // If assembly is available, force a reset+reload once more, then bail; user can click Run again
      if (assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2) {
        reset();
      }
      return;
    }
    runningRef.current = true;
    setRunning(true);
    runLoop();
  }, [assembly, isCoreLoaded, reset, runLoop]);

  /** Stop the emulator at the current instruction */
  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
  }, []);

  /** Flip a bit of the primary switches control */
  const flipBit = useCallback(
    (pos: number) => {
      coreRef.current.flipPrimarySwitchBit(pos);
      commitSnapshot();
    },
    [commitSnapshot],
  );

  /** Move current memory page back */
  const prevOffset = useCallback(() => setMemoryOffset(o => Math.max(0, o - 128)), []);
  /** Move current memory page forward */
  const nextOffset = useCallback(() => setMemoryOffset(o => Math.min(32640, o + 128)), []);

  /** Auto-load when assembly succeeds */
  useEffect(() => {
    // Stop and re-initialize on assembly change or mount
    runningRef.current = false;
    if (assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2) {
      reset(); // this will also reload and set status
    } else if (assembly && !assembly.didAssemble) {
      setStatusText('Assembly failed');
    } else {
      setStatusText('Ready');
    }
  }, [assembly, reset]);

  /** Clamp memory offset to 128-byte pages */
  const setMemoryOffsetClamped = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(32640, Math.floor(next / 16) * 16));
    setMemoryOffset(clamped);
  }, []);

  /** If the emulator is in a state where it can be run */
  const canRun = !!(assembly?.didAssemble && assembly.bytes && assembly.bytes.length > 2);

  return (
    <Section title='Emulator'>
      <SectionContent>
        <div className={classes.content}>
          <EmulatorDiagram snapshot={snapshot} />

          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacingVerticalXS,
            }}
          >
            <div className={classes.controlsRow}>
              {running ? (
                <Button
                  size='small'
                  appearance='primary'
                  onClick={stop}
                  style={{ minWidth: 0, flexGrow: 1 }}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  size='small'
                  onClick={run}
                  disabled={!canRun}
                  style={{ minWidth: 0, flexGrow: 1 }}
                >
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
              <Button
                size='small'
                onClick={reset}
                disabled={running || !canRun}
                style={{ minWidth: 0, flexGrow: 1 }}
              >
                Reset
              </Button>

              <Popover trapFocus>
                <PopoverTrigger disableButtonEnhancement>
                  <Button
                    size='small'
                    style={{ minWidth: 0, flexGrow: 1 }}
                    icon={<Settings16Regular />}
                  />
                </PopoverTrigger>

                <PopoverSurface>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Caption1>IPR</Caption1>
                    <Button
                      size='small'
                      appearance='subtle'
                      disabled={ipr === 1}
                      onClick={() => setIpr(ipr / 2)}
                    >
                      -
                    </Button>
                    <span>{ipr}</span>
                    <Button
                      size='small'
                      appearance='subtle'
                      disabled={ipr === 32}
                      onClick={() => setIpr(ipr * 2)}
                    >
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
              version={memVersion}
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
