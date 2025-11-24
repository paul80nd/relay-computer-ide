import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Tooltip, makeStyles, tokens } from '@fluentui/react-components';
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
};

type HoverAnchor = {
  open: boolean;
  addr: number;
  value: number;
  anchorEl: Element | null;
};

function EmulatorMemory({ memory, pc, m, offset, onPrevPage, onNextPage }: MemoryTableProps) {
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
