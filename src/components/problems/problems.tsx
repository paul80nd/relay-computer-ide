// TypeScript / TSX
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { Dismiss12Filled, ErrorCircle16Regular, Warning16Regular, Info16Regular } from '@fluentui/react-icons';
import { useMemo } from 'react';

type Props = {
  markers: monaco.editor.IMarker[];
  onSelect: (marker: monaco.editor.IMarker) => void;
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 10px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    flexShrink: 0,
  },
  counts: {
    display: 'flex',
    gap: '12px',
  },
  list: {
    overflow: 'auto',
    flex: 1,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '20px 1fr auto auto auto',
    gap: '8px',
    alignItems: 'start',
    padding: '4px 10px 1px',
    cursor: 'pointer',
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  empty: {
    padding: '8px',
    color: tokens.colorNeutralForeground3,
  },
  iconError: { color: tokens.colorStatusDangerForeground1, paddingTop: '2px' },
  iconWarning: { color: tokens.colorStatusWarningForeground1, paddingTop: '2px' },
  iconInfo: { color: tokens.colorPaletteBlueForeground2, paddingTop: '2px' },
});

function severityIcon(sev: number, classes: ReturnType<typeof useStyles>) {
  if (sev === monaco.MarkerSeverity.Error) return <ErrorCircle16Regular className={classes.iconError} />;
  if (sev === monaco.MarkerSeverity.Warning) return <Warning16Regular className={classes.iconWarning} />;
  if (sev === monaco.MarkerSeverity.Info) return <Info16Regular className={classes.iconInfo} />;
  return <Dismiss12Filled className={classes.iconInfo} />;
}

function severityText(sev: number) {
  if (sev === monaco.MarkerSeverity.Error) return 'Error';
  if (sev === monaco.MarkerSeverity.Warning) return 'Warning';
  if (sev === monaco.MarkerSeverity.Info) return 'Info';
  return 'Hint';
}

export default function Problems({ markers, onSelect }: Props) {
  const classes = useStyles();

  const { sorted, counts } = useMemo(() => {
    const counts = { errors: 0, warnings: 0, infos: 0, hints: 0 };
    for (const m of markers) {
      if (m.severity === monaco.MarkerSeverity.Error) counts.errors++;
      else if (m.severity === monaco.MarkerSeverity.Warning) counts.warnings++;
      else if (m.severity === monaco.MarkerSeverity.Info) counts.infos++;
      else counts.hints++;
    }
    const sorted = [...markers].sort((a, b) => {
      // Error before Warning before Info before Hint
      const sevOrder = (s: number) =>
        s === monaco.MarkerSeverity.Error
          ? 0
          : s === monaco.MarkerSeverity.Warning
            ? 1
            : s === monaco.MarkerSeverity.Info
              ? 2
              : 3;
      const s = sevOrder(a.severity) - sevOrder(b.severity);
      if (s !== 0) return s;
      const line = (a.startLineNumber ?? 0) - (b.startLineNumber ?? 0);
      if (line !== 0) return line;
      return (a.startColumn ?? 0) - (b.startColumn ?? 0);
    });
    return { sorted, counts };
  }, [markers]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.counts}>
          <span>{counts.errors} Errors</span>
          <span>{counts.warnings} Warnings</span>
          {counts.infos > 0 && <span>{counts.infos} Infos</span>}
          {counts.hints > 0 && <span>{counts.hints} Hints</span>}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={classes.empty}>No problems have been detected in the assembly code.</div>
      ) : (
        <div className={classes.list}>
          {sorted.map((m, idx) => (
            <div key={idx} className={classes.row} onClick={() => onSelect(m)} role='button'>
              <div>{severityIcon(m.severity, classes)}</div>
              <div>
                <Text size={300} weight='regular'>
                  {m.message}
                </Text>
              </div>
              <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                {severityText(m.severity)}
                {m.code ? ` • ${typeof m.code === 'object' ? m.code.value : m.code}` : ''}
                {m.source ? ` • ${m.source}` : ''}
              </div>
              <div style={{ color: tokens.colorNeutralForeground3 }}>
                <Text size={200}>
                  {m.startLineNumber}:{m.startColumn}
                </Text>
              </div>
              <div style={{ color: tokens.colorNeutralForeground3 }}>{/* Only one file open; omit filename */}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
