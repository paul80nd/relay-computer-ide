import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Field, Input, Radio, RadioGroup, Tooltip, makeStyles, tokens } from '@fluentui/react-components';
import { CaretLeft16Filled, CaretRight16Filled } from '@fluentui/react-icons';
import { toBin, toDec, toHex } from './fmt';

const useStyles = makeStyles({
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
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
    cursor: 'default',
  },
  pcMarker: { outline: `2px solid ${tokens.colorPaletteBlueBorderActive}` },
  mMarker: { outline: `2px solid ${tokens.colorPaletteGreenBorder2}` },
});

export type MemoryTableProps = {
  memory: readonly number[];
  pc: number;
  m: number;
  offset: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSetOffset?: (next: number) => void;
};

type HoverAnchor = {
  open: boolean;
  addr: number;
  value: number;
  anchorEl: Element | null;
};

type FollowMode = 'none' | 'pc' | 'm';

const MEM_SIZE = 32768;
const PAGE_SIZE = 128; // 0x0080
const MAX_OFFSET = MEM_SIZE - PAGE_SIZE;

function clampOffsetToPage(n: number) {
  // Snap to page boundary (multiples of 128) and clamp to range
  const snapped = Math.max(0, Math.min(MAX_OFFSET, n - (n % PAGE_SIZE)));
  return snapped;
}

function pageForAddress(addr: number) {
  // Center approximately, then snap to page boundary
  const centeredStart = Math.max(0, addr - PAGE_SIZE / 2);
  return clampOffsetToPage(centeredStart);
}

function isAddrVisible(addr: number, offset: number) {
  return addr >= offset && addr < offset + PAGE_SIZE;
}

function EmulatorMemory({ memory, pc, m, offset, onPrevPage, onNextPage, onSetOffset }: MemoryTableProps) {
  const classes = useStyles();
  const rows = useMemo(() => [...Array(8).keys()], []);
  const cols = useMemo(() => [...Array(16).keys()], []);

  // Re-use single hover instance (rather than 128 per table)
  const [hover, setHover] = useState<HoverAnchor>({ open: false, addr: 0, value: 0, anchorEl: null });
  const closeTimer = useRef<number | null>(null);
  const handleEnter = useCallback((addr: number, value: number, e: React.MouseEvent<HTMLTableCellElement>) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHover({ open: true, addr, value, anchorEl: e.currentTarget });
  }, []);
  const handleLeave = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setHover(h => ({ ...h, open: false, anchorEl: null }));
    }, 60); // small delay
  }, []);

  // Go to address controls
  const [gotoText, setGotoText] = useState('');
  const parseAddr = (s: string): number | null => {
    const t = s.trim();
    if (!t) return null;
    // Accept 0xHHHH, HHHH (hex), or decimal
    const hexMatch = /^0x([0-9a-fA-F]+)$/.exec(t) || /^([0-9a-fA-F]+)h$/i.exec(t);
    if (hexMatch) {
      const n = parseInt(hexMatch[1], 16);
      return Number.isFinite(n) ? Math.max(0, Math.min(MEM_SIZE - 1, n)) : null;
    }
    if (/^[0-9]+$/.test(t)) {
      const n = parseInt(t, 10);
      return Number.isFinite(n) ? Math.max(0, Math.min(MEM_SIZE - 1, n)) : null;
    }
    return null;
  };

  const setOffset = useCallback(
    (next: number) => {
      const clamped = clampOffsetToPage(next);
      onSetOffset ? onSetOffset(clamped) : console.warn('onSetOffset not provided');
    },
    [onSetOffset]
  );

  const handleGoto = useCallback(() => {
    const addr = parseAddr(gotoText);
    if (addr == null) return;
    setOffset(pageForAddress(addr));
  }, [gotoText, setOffset]);

  const handleGotoKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleGoto();
      }
    },
    [handleGoto]
  );

  // Follow PC / M
  const [followMode, setFollowMode] = useState<FollowMode>('none');

  // When pc/m changes, adjust offset only if toggle is on AND address not visible
  const lastPCRef = useRef<number>(pc);
  const lastMRef = useRef<number>(m);

  // PC follow
  useMemo(() => {
    if (!onSetOffset) return;
    if (followMode === 'pc' && pc !== lastPCRef.current && !isAddrVisible(pc & 0xffff, offset)) {
      setOffset(pageForAddress(pc & 0xffff));
    }
    lastPCRef.current = pc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pc, followMode, offset, onSetOffset, setOffset]);

  // M follow
  useMemo(() => {
    if (!onSetOffset) return;
    if (followMode === 'm' && m !== lastMRef.current && !isAddrVisible(m & 0xffff, offset)) {
      setOffset(pageForAddress(m & 0xffff));
    }
    lastMRef.current = m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m, followMode, offset, onSetOffset, setOffset]);

  return (
    <>
      <table className={classes.memoryTable}>
        <thead>
          <tr>
            <th className={classes.memTh} style={{ width: 24 }} colSpan={2}>
              <Button
                onClick={onPrevPage}
                disabled={offset === 0}
                icon={<CaretLeft16Filled />}
                size='small'
                appearance='transparent'
                style={{ minWidth: 0, flexGrow: 1 }}
                aria-label='Previous page'
              />
            </th>
            <th className={classes.memTh} colSpan={12}>
              Memory (offset <code className={classes.code}>{toHex(offset, 4)}</code>)
            </th>
            <th className={classes.memTh} style={{ width: 24, textAlign: 'right' }} colSpan={2}>
              <Button
                disabled={offset >= 32640}
                onClick={onNextPage}
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
                const addr = offset + r * 16 + c;
                const v = memory[addr] ?? 0;
                const isPC = (pc & 0xffff) === addr;
                const isM = (m & 0xffff) === addr;
                return (
                  <td
                    key={c}
                    className={`${classes.memTd} ${isPC ? classes.pcMarker : ''} ${isM ? classes.mMarker : ''}`}
                    onMouseEnter={e => handleEnter(addr, v, e)}
                    onMouseLeave={handleLeave}
                  >
                    <code className={classes.code}>{toHex(v, 2)}</code>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <th className={classes.memTh} colSpan={16} style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Input
                appearance='filled-darker'
                size='small'
                placeholder='Go to (e.g. 0x0200, 200h, 512)'
                value={gotoText}
                onChange={(_, data) => setGotoText(data.value)}
                onKeyDown={handleGotoKey}
                style={{ width: 220 }}
              />
              <Button size='small' onClick={handleGoto}>
                Go
              </Button>
              <Field label='Follow' orientation='horizontal' size='small'>
                <RadioGroup
                  layout='horizontal'
                  value={followMode}
                  onChange={(_, data) => setFollowMode(data.value as FollowMode)}
                >
                  <Radio value='none' label='None' />
                  <Radio value='pc' label='PC' />
                  <Radio value='m' label='M' />
                </RadioGroup>
              </Field>
            </div>
          </th>
        </tfoot>
      </table>
      <Tooltip
        visible={hover.open}
        positioning={{ target: hover.anchorEl as Element | null, align: 'center', position: 'above' }}
        withArrow
        appearance='inverted'
        relationship='label'
        onVisibleChange={(_, data) => {
          // allow Escape to close
          if (!data.visible) setHover(h => ({ ...h, open: false, anchorEl: null }));
        }}
        content={
          <div>
            <small>Memory Slot</small>
            <br />
            <code>
              Address: {toHex(hover.addr, 4)}
              <br />
              Hex: {toHex(hover.value, 2)}
              <br />
              Bin: {toBin(hover.value, 2)}
              <br />
              Dec: {toDec(hover.value)}
            </code>
          </div>
        }
      />
    </>
  );
}

export default memo(EmulatorMemory, (prev, next) => {
  // Re-render only when visible slice or highlights change.
  return (
    prev.offset === next.offset && prev.pc === next.pc && prev.m === next.m && prev.memory === next.memory // same array ref
  );
});
