import { type ReactNode } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Body1,
  Card,
  CardHeader,
  Link,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { mnemonicDocs } from './docs';
import { Mnemonic } from './mnemonic';
import { Links } from '../../links';

type Section = {
  title: string;
  section?: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

const useStyles = makeStyles({
  root: {
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textTransform: 'uppercase',
    color: tokens.colorNeutralForeground3,
    padding: '.8rem .75rem 0',
  },
  content: {
    minHeight: 0,
    flexGrow: 1,
    overflowY: 'auto',
  },
  contentHeader: {
    padding: '.5rem .75rem 0',
    color: tokens.colorNeutralForeground2,
  },
  contentHeader2: {
    padding: '0 .75rem',
    color: tokens.colorNeutralForeground2,
  },
  accordionHeader: {
    color: tokens.colorNeutralForeground2,
  },
  accordionHeaderBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  accordionHeaderBlockSummary: {
    fontSize: tokens.fontSizeBase300,
  },
  accordionHeaderBlockSection: {
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
    marginBottom: '-.1rem',
  },
  accordionContent: {
    color: tokens.colorNeutralForeground2,
  },
  para: {
    marginTop: 0,
    paddingLeft: '.7rem',
    marginBottom: tokens.spacingVerticalS,
  },
  card: {
    height: 'fit-content',
    marginBottom: tokens.spacingVerticalXS,
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorPaletteGreenForeground2,
  },
});

function Documentation() {
  const styles = useStyles();
  const mnemonics = mnemonicDocs;

  const Commentary = ({ children }: { children: ReactNode }) => (
    <Card className={styles.card} appearance='subtle' role='listitem'>
      <CardHeader
        description={
          <Text size={200} className={styles.caption}>
            {children}
          </Text>
        }
      />
    </Card>
  );

  function Code({ children }: { children: ReactNode }) {
    return <Text className={styles.code}>{children}</Text>;
  }

  const sections: Section[] = [
    {
      title: 'Getting Started',
      content: (
        <>
          <p className={styles.para}>
            Type your assembly program into the editor window to the right. Your program is automatically assembled (as
            you type) with the results placed in the output window at the far right. Any syntax errors or warnings will
            be displayed and highlighted in the code editor.
          </p>
          <p className={styles.para}>
            Your program is automatically saved in your browser&apos;s local storage meaning your last program will be
            available at your next visit to this IDE.
          </p>
          <p className={styles.para}>
            You can load an example program into the editor from the examples folder icon at the top left. You can also
            export the current program via the export icon below the examples icon. This includes the ability to export
            the assembled program to your clipboard which can then be imported/pasted into the{' '}
            <Link href={Links.Simulator} target='_blank' rel='noreferrer'>
              Relay Computer Simulator
            </Link>
            .
          </p>
          <p className={styles.para}>
            Providing your program assembles without error it will be automatically loaded into the emulator ('chip'
            icon on the left) within this IDE. The emulator is a simplified version of the full simulator above and
            allows you to quickly confirm your program before trying the full simulator.
          </p>
        </>
      ),
    },
    {
      title: 'Assembly Syntax',
      content: (
        <>
          <p className={styles.para}>
            My assembly language (RCASM) draws inspiration from 6502 and Z80 assemblers so has many similarities
            (although is relatively cut-down and simplified).
          </p>
          <p className={styles.para}>
            Every instruction must be on its own line with everything after a semi-colon ignored. Labels are optional
            and must start with a letter or underscore and end with a colon e.g. <Code>label:</Code>.
          </p>
          <p className={styles.para}>Valid number formats for constants are:</p>
          <ul>
            <li>
              decimal: <Code>200</Code> or <Code>200d</Code>
            </li>
            <li>
              hex: <Code>0xA4</Code>
            </li>
            <li>
              binary: <Code>0101b</Code>
            </li>
          </ul>
          <p className={styles.para}>Operands can be:</p>
          <ul>
            <li>
              a general purpose register: <Code>a, b, c, d, m1, m2, x, y</Code>
            </li>
            <li>
              a 16-bit register: <Code>m, j, xy</Code>
            </li>
            <li>a constant</li>
            <li>a label (treated as a 16-bit value or the lower byte for 8-bit operands)</li>
            <li>
              the current address: <Code>*</Code>
            </li>
          </ul>
          <p className={styles.para}>Operators can be used with all operands where they make sense:</p>
          <ul>
            <li>
              Additive <Code>+</Code> and <Code>-</Code>
            </li>
            <li>
              Multiplicative <Code>*</Code>, <Code>/</Code> and <Code>%</Code>
            </li>
            <li>
              Expression Order <Code>(</Code> and <Code>)</Code>
            </li>
            <li>
              Comparative <Code>==</Code>, <Code>!=</Code>, <Code>&lt;</Code>, <Code>&lt;=</Code>, <Code>&gt;</Code>,{' '}
              <Code>&gt;=</Code>
            </li>
          </ul>
          <p className={styles.para}>
            A special <Code>§</Code> operator also exists that will take the lower byte of the left and right operand
            and combine into a 16-bit value of left:right. This can be useful for &apos;quick loading&apos; the{' '}
            <Code>m</Code> register. For example: <Code>ldi m,label§23</Code>.
          </p>
        </>
      ),
    },
    {
      title: 'Flow Control',
      section: 'Assembly Instructions',
      content: (
        <>
          <Mnemonic {...mnemonics['hlt']} />
          <Mnemonic {...mnemonics['hlr']} />
        </>
      ),
    },
    {
      title: 'Arithmetic & Logic (ALU)',
      section: 'Assembly Instructions',
      content: (
        <>
          <Commentary>
            <Text>8-bit ALU Operations</Text>
            <br />
            <br />
            For ALU instructions the result in placed in <em>dst</em> (register <Code>a</Code> or <Code>d</Code>). If{' '}
            <em>dst</em> is not specified then register <Code>a</Code> is assumed.
            <br />
            <br />
            Each instruction affects the condition flags <Code>Z</Code> (zero) and <Code>S</Code> (sign - if most
            significant bit set) based on the result of the instruction.
          </Commentary>
          <Mnemonic {...mnemonics['add']} />
          <Mnemonic {...mnemonics['inc']} />
          <Mnemonic {...mnemonics['and']} />
          <Mnemonic {...mnemonics['orr']} />
          <Mnemonic {...mnemonics['eor']} />
          <Mnemonic {...mnemonics['cmp']} />
          <Mnemonic {...mnemonics['not']} />
          <Mnemonic {...mnemonics['rol']} />
          <Commentary>
            <Text>16-bit Incrementer Operations</Text>
          </Commentary>
          <Mnemonic {...mnemonics['ixy']} />
        </>
      ),
    },
    {
      title: 'Branching',
      section: 'Assembly Instructions',
      content: (
        <>
          <Commentary>
            <Text>Conditional Branching</Text>
            <br /> <br />
            For the following instructions the <Code>j</Code> register is loaded with the address referenced by{' '}
            <em>label</em> and then based on the condition flags <Code>Z</Code>, <Code>C</Code> and <Code>S</Code> the
            program counter will be loaded from the <Code>j</Code> register if the jump is required.
          </Commentary>
          <Mnemonic {...mnemonics['beq']} />
          <Mnemonic {...mnemonics['bne']} />
          <Mnemonic {...mnemonics['bcs']} />
          <Mnemonic {...mnemonics['blt']} />
          <Mnemonic {...mnemonics['bmi']} />
          <Mnemonic {...mnemonics['ble']} />
          <Commentary>
            <Text>Unconditional Branching</Text>
          </Commentary>
          <Mnemonic {...mnemonics['jmp']} />
          <Mnemonic {...mnemonics['jsr']} />
          <Mnemonic {...mnemonics['rts']} />
        </>
      ),
    },
    {
      title: 'Experimental',
      section: 'Assembly Instructions',
      content: (
        <>
          <Commentary>
            The following instructions are experimental and not yet fully implemented in the relay computer simulator.
          </Commentary>
          <Mnemonic {...mnemonics['div']} />
          <Mnemonic {...mnemonics['dvr']} />
          <Mnemonic {...mnemonics['mod']} />
          <Mnemonic {...mnemonics['mdr']} />
        </>
      ),
    },
    {
      title: 'Register Manipulation',
      section: 'Assembly Instructions',
      content: (
        <>
          <Commentary>
            <Text>Register to Register Copy</Text>
          </Commentary>
          <Mnemonic {...mnemonics['mov']} />
          <Commentary>
            <Text>Set Immediate Value</Text>
          </Commentary>
          <Mnemonic {...mnemonics['clr']} />
          <Mnemonic {...mnemonics['ldi']} />
          <Commentary>
            <Text>Store & Load</Text>
          </Commentary>
          <Mnemonic {...mnemonics['ldr']} />
          <Mnemonic {...mnemonics['str']} />
          <Mnemonic {...mnemonics['lds']} />
        </>
      ),
    },
    {
      title: 'Organisation',
      section: 'Assembly Directives',
      content: (
        <>
          <Mnemonic {...mnemonics['org']} />
          <Mnemonic {...mnemonics['!align']} />
        </>
      ),
    },
    {
      title: 'Control Flow',
      section: 'Assembly Directives',
      content: (
        <>
          <Mnemonic {...mnemonics['!if']} />
          <Mnemonic {...mnemonics['elif']} />
          <Mnemonic {...mnemonics['else']} />
          <Mnemonic {...mnemonics['!for']} />
          <Mnemonic {...mnemonics['range']} />
          <Mnemonic {...mnemonics['!error']} />
        </>
      ),
    },
    {
      title: 'Data / Literals',
      section: 'Assembly Directives',
      content: (
        <>
          <Mnemonic {...mnemonics['!let']} />
          <Mnemonic {...mnemonics['!byte']} />
          <Mnemonic {...mnemonics['!word']} />
          <Mnemonic {...mnemonics['!fill']} />
          <Mnemonic {...mnemonics['opc']} />
        </>
      ),
    },
  ];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Body1>Documentation</Body1>
      </header>
      <div className={styles.content}>
        <Accordion collapsible multiple aria-label='IDE documentation'>
          {sections.map((s, i) => (
            <AccordionItem value={i} key={i}>
              <AccordionHeader className={styles.accordionHeader}>
                <div className={styles.accordionHeaderBlock}>
                  {s.section ? <Text className={styles.accordionHeaderBlockSection}>{s.section}</Text> : null}
                  <Text className={styles.accordionHeaderBlockSummary}>{s.title}</Text>
                </div>
              </AccordionHeader>
              <AccordionPanel className={styles.accordionContent}>{s.content}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Documentation;
