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

  posC3: { gridColumn: '3 / 3' },
  posC4_5: { gridColumn: '4 / 5' },
  posC5_6: { gridColumn: '5 / 6' },
  posC6_7: { gridColumn: '6 / 7' },

  posR1_3: { gridRow: '1 / 3' },
  posR3_5: { gridRow: '3 / 5' },
  posR5_7: { gridRow: '5 / 7' },
  posR7_9: { gridRow: '7 / 9' },
  posR9_11: { gridRow: '9 / 11' },
  posR9_13: { gridRow: '9 / 13' },
  posR11_13: { gridRow: '11 / 13' },
  posR13_15: { gridRow: '13 / 15' },
  posR13_17: { gridRow: '13 / 17' },
  posR15_17: { gridRow: '15 / 17' },
  posR17_19: { gridRow: '17 / 19' },
  posR17_21: { gridRow: '17 / 21' },
  posR19_21: { gridRow: '19 / 21' },

  posC1R2_20: { gridColumn: '1 / 1', gridRow: '2 / 20' },
  posC2R2: { gridColumn: '2 / 2', gridRow: '2 / 2' },
  posC2R4: { gridColumn: '2 / 2', gridRow: '4 / 4' },
  posC2R6: { gridColumn: '2 / 2', gridRow: '6 / 6' },
  posC2R8: { gridColumn: '2 / 2', gridRow: '8 / 8' },
  posC2R10: { gridColumn: '2 / 2', gridRow: '10 / 10' },
  posC2R12: { gridColumn: '2 / 2', gridRow: '12 / 12' },
  posC2R14: { gridColumn: '2 / 2', gridRow: '14 / 14' },
  posC2R16: { gridColumn: '2 / 2', gridRow: '16 / 16' },
  posC2R18: { gridColumn: '2 / 2', gridRow: '18 / 18' },
  posC2R19: { gridColumn: '2 / 2', gridRow: '19 / 19' },
  posC7_8R4: { gridColumn: '7 / 8', gridRow: '4 / 4' },
  posC7_8R5: { gridColumn: '7 / 8', gridRow: '5 / 5' },
  posC8_9R4_6: { gridColumn: '8 / 9', gridRow: '4 / 6' },
  posC9_10R5: { gridColumn: '9 / 10', gridRow: '5 / 5' },
  posC7_8R11_12: { gridColumn: '7 / 8', gridRow: '11 / 12' },
  posC7_8R15_16: { gridColumn: '7 / 8', gridRow: '15 / 16' },
  posC7_8R18_19: { gridColumn: '7 / 8', gridRow: '18 / 19' },
  posC8_9R11_19: { gridColumn: '8 / 9', gridRow: '11 / 19' },
  posC9_10R18_19: { gridColumn: '9 / 10', gridRow: '18 / 19' },

  psL: { gridColumn: '12 / 13', gridRow: '15 / 17' },
  psV: { gridColumn: '10 / 12', gridRow: '15 / 17' },

  pcL: { gridColumn: '12 / 13', gridRow: '18 / 20' },
  pcV: { gridColumn: '10 / 12', gridRow: '18 / 20' },

  aluL: { gridColumn: '10 / 13', gridRow: '2 / 4' },
  aluS: { textAlign: 'right', gridColumn: '10 / 11', gridRow: '4 / 7' },
  aluC: { gridColumn: '11 / 12', gridRow: '4 / 7' },
  aluZ: { textAlign: 'left', gridColumn: '12 / 13', gridRow: '4 / 7' },

  instrL: { gridColumn: '10 / 13', gridRow: '9 / 11' },
  instrV: { textAlign: 'right', gridColumn: '10 / 11', gridRow: '11 / 13' },
  instrCls: { paddingLeft: '3px', gridColumn: '11 / 13', gridRow: '11 / 13' },
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

export default function EmulatorDiagram({ snapshot }: { snapshot: Snapshot }) {
  const styles = useStyles();

  const reg8 = (label: string, v: number, rowCls: string) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={2} showDec />}
      >
        <div className={`${styles.dgR8V} ${styles.posC3} ${rowCls}`}>
          <code className={styles.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={`${styles.dgRLab} ${styles.posC4_5} ${rowCls}`}></div>
      <div className={`${styles.dgRLab} ${styles.posC5_6} ${rowCls}`}>{label}</div>
      <div className={`${styles.dgR8E} ${styles.posC6_7} ${rowCls}`} />
    </>
  );

  const reg16L = (label: string, v: number, rowCls: string) => (
    <>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={2} showDec />}
      >
        <div className={`${styles.dgR8V} ${styles.posC3} ${rowCls}`}>
          <code className={styles.code}>{toHex(v, 2)}</code>
        </div>
      </Tooltip>
      <div className={`${styles.dgRLab} ${styles.posC4_5} ${rowCls}`}>{label}</div>
    </>
  );

  const reg16R = (label: string, v: number, rowCls: string) => (
    <>
      <div className={`${styles.dgRLab} ${styles.posC5_6} ${rowCls}`}>{label}</div>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        positioning='after'
        content={<RegTooltipContent title={`Register ${label}`} value={v} width={4} showDec />}
      >
        <div className={`${styles.dgR16V} ${styles.posC6_7} ${rowCls}`}>
          <code className={styles.code}>{toHex(v, 4)}</code>
        </div>
      </Tooltip>
    </>
  );

  const mHi = (snapshot.M >>> 8) & 0xff;
  const mLo = snapshot.M & 0xff;
  const xyHi = (snapshot.XY >>> 8) & 0xff;
  const xyLo = snapshot.XY & 0xff;
  const jHi = (snapshot.J >>> 8) & 0xff;
  const jLo = snapshot.J & 0xff;

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
      <div className={`${styles.dgBus} ${styles.posC1R2_20}`}></div>
      {/* Data Links */}
      <div className={`${styles.dgLink} ${styles.posC2R2}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R4}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R6}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R8}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R10}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R12}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R14}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R16}`}></div>
      <div className={`${styles.dgLink} ${styles.posC2R18}`}></div>
      <div className={`${styles.dgLinkU} ${styles.posC2R19}`}></div>
      {/* Register A/B/C/D */}
      {reg8('A', snapshot.A, styles.posR1_3)}
      {reg8('B', snapshot.B, styles.posR3_5)}
      {reg8('C', snapshot.C, styles.posR5_7)}
      {reg8('D', snapshot.D, styles.posR7_9)}
      {/* Register M1/M2/M */}
      {reg16L('M1', mHi, styles.posR9_11)}
      {reg16L('M2', mLo, styles.posR11_13)}
      {reg16R('M', snapshot.M, styles.posR9_13)}
      {/* Register X/Y/XY */}
      {reg16L('X', xyHi, styles.posR13_15)}
      {reg16L('Y', xyLo, styles.posR15_17)}
      {reg16R('XY', snapshot.XY, styles.posR13_17)}
      {/* Register J1/J2/J */}
      {reg16L('J1', jHi, styles.posR17_19)}
      {reg16L('J2', jLo, styles.posR19_21)}
      {reg16R('J', snapshot.J, styles.posR17_21)}
      {/* ALU Links */}
      <div className={`${styles.dgLink} ${styles.posC7_8R4}`}></div>
      <div className={`${styles.dgLinkU} ${styles.posC7_8R5}`}></div>
      <div className={`${styles.dgBus} ${styles.posC8_9R4_6}`}></div>
      <div className={`${styles.dgLink} ${styles.posC9_10R5}`}></div>
      {/* Links */}
      <div className={`${styles.dgLink} ${styles.posC7_8R11_12}`}></div>
      <div className={`${styles.dgLink} ${styles.posC7_8R15_16}`}></div>
      <div className={`${styles.dgLinkU} ${styles.posC7_8R18_19}`}></div>
      {/* Addr Bus */}
      <div className={`${styles.dgBus} ${styles.posC8_9R11_19}`}></div>
      {/* Links */}
      <div className={`${styles.dgLinkU} ${styles.posC9_10R18_19}`}></div>

      {/* Primary Switches */}
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Primary Switches' value={snapshot.PS} width={2} showDec />}
      >
        <div className={`${styles.dgPCV} ${styles.psV}`}>
          <code className={styles.code}>{toHex(snapshot.PS, 2)}</code>
        </div>
      </Tooltip>
      <div className={`${styles.dgPCLab} ${styles.psL}`}>PS</div>

      {/* Program Counter */}
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Program Counter' value={snapshot.PC} width={4} showDec />}
      >
        <div className={`${styles.dgPCV} ${styles.pcV}`}>
          <code className={styles.code}>{toHex(snapshot.PC, 4)}</code>
        </div>
      </Tooltip>
      <div className={`${styles.dgPCLab} ${styles.pcL}`}>PC</div>

      {/* ALU */}
      <div className={`${styles.dgAILab} ${styles.aluL}`}>ALU</div>
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
        <div className={`${styles.dgAIBL} ${styles.aluS}`}>
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
        <div className={`${styles.dgAIBM} ${styles.aluC}`}>
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
        <div className={`${styles.dgAIBR} ${styles.aluZ}`}>
          <Badge shape='circular' color='brand' appearance={snapshot.FZ ? 'filled' : 'outline'}>
            Z
          </Badge>
        </div>
      </Tooltip>

      {/* Instruction */}
      <div className={`${styles.dgAILab} ${styles.instrL}`}>Instruction</div>
      <Tooltip
        withArrow
        appearance='inverted'
        relationship='label'
        content={<RegTooltipContent title='Instruction' value={snapshot.I} width={2} />}
      >
        <div className={`${styles.dgAIBL} ${styles.instrV}`}>
          <code className={styles.code}>{toHex(snapshot.I, 2)}</code>
        </div>
      </Tooltip>
      <div className={`${styles.dgAIBR} ${styles.instrCls}`}>
        <Badge size='small' shape='rounded' color='brand' appearance='outline'>
          {snapshot.CLS}
        </Badge>
      </div>
    </div>
  );
}
