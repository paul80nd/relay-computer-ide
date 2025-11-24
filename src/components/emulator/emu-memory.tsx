import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Caption1,
  Input,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  Tooltip,
  makeStyles,
  tokens,
  type ToolbarProps,
} from '@fluentui/react-components';
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
  pcMarker: { backgroundColor: tokens.colorBrandBackground, outline: `1px solid ${tokens.colorBrandStroke1}` },
  mMarker: { backgroundColor: tokens.colorStatusSuccessBackground3, outline: `1px solid ${tokens.colorStatusSuccessBorderActive}` },
  pcAndMMarker: {
    backgroundImage: `linear-gradient(135deg,
      ${tokens.colorBrandBackground} 0%,
      ${tokens.colorBrandBackground} 50%,
      ${tokens.colorStatusSuccessBackground3} 50%,
      ${tokens.colorStatusSuccessBackground3} 100%)`,
      outline: '1px solid lightGray'
  },
  toolbarItem: { color: tokens.colorNeutralForeground3, padding: '0 .4rem', minWidth: '2rem', marginRight: '.2rem' },
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

type FollowMode = 'none' | 'pc' | 'm';

const MEM_SIZE = 32768;
const PAGE_SIZE = 128; // 0x0080
const MAX_OFFSET = MEM_SIZE - PAGE_SIZE;

function clampOffsetToPage(n: number) {
  // Snap to page boundary (multiples of 128) and clamp to range
  return Math.max(0, Math.min(MAX_OFFSET, n - (n % PAGE_SIZE)));
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
  const styles = useStyles();
  const rows = useMemo(() => [...Array(8).keys()], []);
  const cols = useMemo(() => [...Array(16).keys()], []);

  // Current selected address (tracked memory location)
  const [currentAddr, setCurrentAddr] = useState<number | undefined>(undefined);
  const currentValue = currentAddr ? memory[currentAddr] ?? 0 : undefined;

  // Go to address controls
  const [gotoText, setGotoText] = useState('');
  const [gotoOpen, setGotoOpen] = useState<boolean>(false);
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

  const setOffset = useCallback((next: number) => onSetOffset?.(clampOffsetToPage(next)), [onSetOffset]);

  const handleGoto = useCallback(() => {
    const addr = parseAddr(gotoText);
    if (addr == null) return;
    setGotoOpen(false);
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
  const [toolbarChecked, setToolbarChecked] = useState<Record<string, string[]>>({
    follow: ['pc'], // default selection
  });
  const followMode = (toolbarChecked.follow?.[0] as FollowMode) ?? 'none';

  const onFollowCheckedChange: ToolbarProps['onCheckedValueChange'] = (_e, { name, checkedItems }) => {
    // Expect name === 'follow'
    setToolbarChecked(prev => ({ ...prev, [name]: checkedItems }));
  };

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

  // snap immediately when user switches follow mode
  useEffect(() => {
    if (!onSetOffset) return;
    if (followMode === 'pc') setOffset(pageForAddress(pc & 0xffff));
    else if (followMode === 'm') setOffset(pageForAddress(m & 0xffff));
  }, [followMode, pc, m, onSetOffset, setOffset]);

  return (
    <>
      <table className={styles.memoryTable}>
        <thead>
          <tr>
            <th className={styles.memTh} style={{ width: 24 }} colSpan={2}>
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
            <th className={styles.memTh} colSpan={12}>
              Memory (offset <code className={styles.code}>{toHex(offset, 4)}</code>)
            </th>
            <th className={styles.memTh} style={{ width: 24, textAlign: 'right' }} colSpan={2}>
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
                    className={`${styles.memTd} ${isM && isPC ? styles.pcAndMMarker : isM ? styles.mMarker : isPC ? styles.pcMarker : ''}`}
                    onClick={() => setCurrentAddr(addr)}
                    role='gridcell'
                  >
                    <code className={styles.code}>{toHex(v, 2)}</code>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <th className={styles.memTh} colSpan={16} style={{ padding: '4px 2px' }}>
            <Toolbar
              size='small'
              aria-label='Follow options'
              checkedValues={toolbarChecked}
              onCheckedValueChange={onFollowCheckedChange}
              style={{ justifyContent: 'space-between', padding: 0 }}
            >
              {/* Left group: jump to memory location */}
              <ToolbarGroup role='presentation'>
                <Popover withArrow trapFocus open={gotoOpen} onOpenChange={(_, data) => setGotoOpen(data.open)}>
                  <PopoverTrigger disableButtonEnhancement>
                    <ToolbarButton className={styles.toolbarItem} appearance='subtle'>
                      <Caption1> Goto...</Caption1>
                    </ToolbarButton>
                  </PopoverTrigger>
                  <PopoverSurface>
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
                  </PopoverSurface>
                </Popover>
              </ToolbarGroup>

              {/* Middle group: current tracked memory location */}
              <ToolbarGroup role='presentation'>
                <Tooltip
                  withArrow
                  relationship='description'
                  positioning='above'
                  content={
                    currentAddr ? (
                      <div>
                        <small>Tracked Memory</small>
                        <br />
                        <code>
                          Address: {toHex(currentAddr, 4)}
                          <br />
                          Hex: {toHex(currentValue ?? 0, 2)}
                          <br />
                          Bin: {toBin(currentValue ?? 0, 2)}
                          <br />
                          Dec: {toDec(currentValue ?? 0)}
                        </code>
                      </div>
                    ) : (
                      <div>Select a memory location in the table to track that value.</div>
                    )
                  }
                >
                  <ToolbarButton className={styles.toolbarItem} appearance='transparent'>
                    <Caption1>
                      {currentAddr == null ? (
                        '---- : --'
                      ) : (
                        <>
                          <code className={styles.code}>{toHex(currentAddr, 4)}</code>
                          {' : '}
                          <code className={styles.code}>{toHex(currentValue ?? 0, 2)}</code>
                        </>
                      )}
                    </Caption1>
                  </ToolbarButton>
                </Tooltip>
              </ToolbarGroup>

              {/* Right group: follow mode */}
              <ToolbarGroup>
                Follow:
                <ToolbarRadioGroup aria-label='Follow mode'>
                  <ToolbarRadioButton
                    name='follow'
                    value='none'
                    appearance='subtle'
                    size='small'
                    className={styles.toolbarItem}
                  >
                    Off
                  </ToolbarRadioButton>
                  <Tooltip
                    content='Follow position of Program Counter'
                    relationship='description'
                    positioning='above-end'
                    withArrow
                  >
                    <ToolbarRadioButton
                      name='follow'
                      value='pc'
                      appearance='subtle'
                      size='small'
                      className={styles.toolbarItem}
                    >
                      PC
                    </ToolbarRadioButton>
                  </Tooltip>
                  <Tooltip
                    content='Follow M register target'
                    relationship='description'
                    positioning='above-end'
                    withArrow
                  >
                    <ToolbarRadioButton
                      name='follow'
                      value='m'
                      appearance='subtle'
                      size='small'
                      className={styles.toolbarItem}
                    >
                      M
                    </ToolbarRadioButton>
                  </Tooltip>
                </ToolbarRadioGroup>
              </ToolbarGroup>
            </Toolbar>
          </th>
        </tfoot>
      </table>
    </>
  );
}

export default memo(EmulatorMemory, (prev, next) => {
  // Re-render only when visible slice or highlights change.
  return (
    prev.offset === next.offset && prev.pc === next.pc && prev.m === next.m && prev.memory === next.memory // same array ref
  );
});
