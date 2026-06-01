import { memo, useMemo } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { toHex } from './fmt';

export type WatchEntry = {
  name: string;
  addr: number | undefined;
  length: number;
  requested: number;
  endian: 'be' | 'le';
};

export type WatchesProps = {
  version: number;
  memory: Uint8Array;
  watches: WatchEntry[];
};

const MAX_LEN = 12;

const useStyles = makeStyles({
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200
  },
  watchTable: {
    flexGrow: 1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderSpacing: 0,
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    padding: '2px 4px'
  },
  nameCell: {
    textAlign: 'left',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '0 6px',
    fontSize: tokens.fontSizeBase200
  },
  addrCell: {
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '0 4px'
  },
  byteCell: {
    textAlign: 'center',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: 'default'
  },
  unknownName: {
    color: tokens.colorPaletteRedForeground1,
    cursor: 'help'
  },
  unknownByte: {
    color: tokens.colorNeutralForegroundDisabled
  },
  truncatedName: {
    color: tokens.colorStatusWarningForeground1,
    cursor: 'help'
  },
  endianBadge: {
    marginLeft: '6px',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '10px',
    color: tokens.colorNeutralForeground3,
    cursor: 'help'
  }
});

function EmulatorWatches({ memory, watches }: WatchesProps) {
  const styles = useStyles();
  const slots = useMemo(() => [...Array(MAX_LEN).keys()], []);

  if (watches.length === 0) return null;

  return (
    <table className={styles.watchTable}>
      <thead>
        <tr>
          <th className={styles.th} colSpan={2 + MAX_LEN}>
            Watches
          </th>
        </tr>
      </thead>
      <tbody>
        {watches.map(w => {
          const unknown = w.addr === undefined;
          const truncated = w.requested > w.length;
          return (
            <tr key={w.name}>
              <td className={styles.nameCell}>
                <span
                  className={
                    unknown
                      ? styles.unknownName
                      : truncated
                        ? styles.truncatedName
                        : undefined
                  }
                  title={
                    unknown
                      ? `unknown label '${w.name}' — not found in assembled program`
                      : truncated
                        ? `requested ${w.requested} bytes — truncated to ${w.length}`
                        : undefined
                  }
                >
                  {w.name}
                </span>
                {w.endian === 'le' && (
                  <span
                    className={styles.endianBadge}
                    title='little-endian — bytes shown MSB first (highest address on the left)'
                  >
                    LE
                  </span>
                )}
              </td>
              <td className={styles.addrCell}>
                <code className={styles.code}>{unknown ? '????' : toHex(w.addr!, 4)}</code>
              </td>
              {slots.map(i => {
                if (i >= w.length) return <td key={i} className={styles.byteCell} />;
                if (unknown) {
                  return (
                    <td key={i} className={styles.byteCell}>
                      <code className={`${styles.code} ${styles.unknownByte}`}>??</code>
                    </td>
                  );
                }
                // For LE display we reverse the in-memory order so the value
                // reads MSB→LSB left-to-right, matching how the source comments
                // typically write the expected value.
                const byteIdx = w.endian === 'le' ? w.length - 1 - i : i;
                const v = memory[(w.addr! + byteIdx) & 0xffff] ?? 0;
                return (
                  <td key={i} className={styles.byteCell}>
                    <code className={styles.code}>{toHex(v, 2)}</code>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default memo(EmulatorWatches, (prev, next) => {
  return (
    prev.memory === next.memory &&
    prev.version === next.version &&
    prev.watches === next.watches
  );
});
