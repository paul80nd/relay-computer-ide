import { Tooltip, makeStyles, tokens, Badge } from '@fluentui/react-components';
import { toBin, toDec, toHex } from './fmt';
import type { Snapshot } from './emulator';

const useStyles = makeStyles({
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
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
    cursor: 'default',
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
    cursor: 'default',
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
    cursor: 'default',
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
    cursor: 'default',
  },
  dgAIBM: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'default',
  },
  dgAIBR: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    alignContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'default',
  },
});

function RegTooltipContent({
  title,
  value,
  width,
  showDec = false,
}: {
  title: string;
  value: number;
  width: number;
  showDec?: boolean;
}) {
  return (
    <div>
      <small>{title}</small>
      <br />
      <code>
        Hex: {toHex(value, width)}
        <br />
        Bin: {toBin(value, width)}
        {showDec && (
          <>
            <br />
            Dec: {toDec(value)}
          </>
        )}
      </code>
    </div>
  );
}

const gc = (from: number, to?: number) => `${from} / ${to ?? from}`;
const gr = (from: number, to?: number) => `${from} / ${to ?? from}`;

export default function EmulatorDiagram({ snapshot }: { snapshot: Snapshot }) {
  const styles = useStyles();

  const reg8 = (label: string, v: number, from: number, to: number) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={2} showDec />}
      >
        <div className={styles.dgR8V} style={{ gridColumn: gc(3), gridRow: gr(from, to) }}>
          <code className={styles.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={styles.dgRLab} style={{ gridColumn: gc(4, 5), gridRow: gr(from, to) }}></div>
      <div className={styles.dgRLab} style={{ gridColumn: gc(5, 6), gridRow: gr(from, to) }}>
        {label}
      </div>
      <div className={styles.dgR8E} style={{ gridColumn: gc(6, 7), gridRow: gr(from, to) }}></div>
    </>
  );

  const reg16L = (label: string, v: number, from: number, to: number) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={2} showDec />}
      >
        <div className={styles.dgR8V} style={{ gridColumn: gc(3), gridRow: gr(from, to) }}>
          <code className={styles.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={styles.dgRLab} style={{ gridColumn: gc(4, 5), gridRow: gr(from, to) }}>
        {label}
      </div>
    </>
  );

  const reg16R = (label: string, v: number, from: number, to: number) => (
    <>
      <div className={styles.dgRLab} style={{ gridColumn: gc(5, 6), gridRow: gr(from, to) }}>
        {label}
      </div>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={4} showDec />}
      >
        <div className={styles.dgR16V} style={{ gridColumn: gc(6, 7), gridRow: gr(from, to) }}>
          <code className={styles.code}>{toHex(v, 4)}</code>
        </div>
      </Tooltip>
    </>
  );

  return (
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
      <div className={styles.dgBus} style={{ gridColumn: '1 / 1', gridRow: '2 / 20' }}></div>
      {/* Data Links */}
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '2 / 2' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '4 / 4' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '6 / 6' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '8 / 8' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '10 / 10' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '12 / 12' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '14 / 14' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '16 / 16' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '2 / 2', gridRow: '18 / 18' }}></div>
      <div className={styles.dgLinkU} style={{ gridColumn: '2 / 2', gridRow: '19 / 19' }}></div>
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
      <div className={styles.dgLink} style={{ gridColumn: '7 / 8', gridRow: '4 / 4' }}></div>
      <div className={styles.dgLinkU} style={{ gridColumn: '7 / 8', gridRow: '5 / 5' }}></div>
      <div className={styles.dgBus} style={{ gridColumn: '8 / 9', gridRow: '4 / 6' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '9 / 10', gridRow: '5 / 5' }}></div>
      {/* Links */}
      <div className={styles.dgLink} style={{ gridColumn: '7 / 8', gridRow: '11 / 12' }}></div>
      <div className={styles.dgLink} style={{ gridColumn: '7 / 8', gridRow: '15 / 16' }}></div>
      <div className={styles.dgLinkU} style={{ gridColumn: '7 / 8', gridRow: '18 / 19' }}></div>
      {/* Addr Bus */}
      <div className={styles.dgBus} style={{ gridColumn: '8 / 9', gridRow: '11 / 19' }}></div>
      {/* Links */}
      <div className={styles.dgLinkU} style={{ gridColumn: '9 / 10', gridRow: '18 / 19' }}></div>

      {/* Primary Switches */}
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Primary Switches' value={snapshot.PS} width={2} showDec />}
      >
        <div className={styles.dgPCV} style={{ gridColumn: '10 / 12', gridRow: '15 / 17' }}>
          <code className={styles.code}>{toHex(snapshot.PS, 2)}</code>
        </div>
      </Tooltip>
      <div className={styles.dgPCLab} style={{ gridColumn: '12 / 13', gridRow: '15 / 17' }}>
        PS
      </div>

      {/* Program Counter */}
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Program Counter' value={snapshot.PC} width={4} showDec />}
      >
        <div className={styles.dgPCV} style={{ gridColumn: '10 / 12', gridRow: '18 / 20' }}>
          <code className={styles.code}>{toHex(snapshot.PC, 4)}</code>
        </div>
      </Tooltip>
      <div className={styles.dgPCLab} style={{ gridColumn: '12 / 13', gridRow: '18 / 20' }}>
        PC
      </div>

      {/* ALU */}
      <div className={styles.dgAILab} style={{ gridColumn: '10 / 13', gridRow: '2 / 4' }}>
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
        <div className={styles.dgAIBL} style={{ textAlign: 'right', gridColumn: '10 / 11', gridRow: '4 / 7' }}>
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
        <div className={styles.dgAIBM} style={{ gridColumn: '11 / 12', gridRow: '4 / 7' }}>
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
        <div className={styles.dgAIBR} style={{ textAlign: 'left', gridColumn: '12 / 13', gridRow: '4 / 7' }}>
          <Badge shape='circular' color='brand' appearance={snapshot.FZ ? 'filled' : 'outline'}>
            Z
          </Badge>
        </div>
      </Tooltip>

      {/* Instruction */}
      <div className={styles.dgAILab} style={{ gridColumn: '10 / 13', gridRow: '9 / 11' }}>
        Instruction
      </div>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Instruction' value={snapshot.I} width={2} />}
      >
        <div className={styles.dgAIBL} style={{ textAlign: 'right', gridColumn: '10 / 11', gridRow: '11 / 13' }}>
          <code className={styles.code}>{toHex(snapshot.I, 2)}</code>
        </div>
      </Tooltip>
      <div className={styles.dgAIBR} style={{ paddingLeft: '3px', gridColumn: '11 / 13', gridRow: '11 / 13' }}>
        <Badge size='small' shape='rounded' color='brand' appearance='outline'>
          {snapshot.CLS}
        </Badge>
      </div>
    </div>
  );
}
