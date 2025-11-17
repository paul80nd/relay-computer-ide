import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ExamplesProps } from './types.ts';
import { Text } from '@fluentui/react-components';

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
    padding: '.5rem .75rem',
    lineHeight: '.8rem',
    color: tokens.colorNeutralForeground2,
  },
  footer: {
    color: tokens.colorStatusWarningForeground1,
    padding: '.3rem .75rem .6rem',
    lineHeight: '.8rem',
  },
  accordionHeader: {
    minHeight: '1rem',
    color: tokens.colorNeutralForeground2,
  },
  card: {
    height: 'fit-content',
    marginBottom: tokens.spacingVerticalXS,
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
});

const isDevMode = import.meta.env.DEV;

function Examples({ onExampleRequested }: ExamplesProps) {
  const styles = useStyles();

  const loadExample = (example: string) => onExampleRequested?.(example);

  const renderSectionHeader = (description: string) => (
    <Card className={styles.card} size='small' appearance='subtle' role='listitem'>
      <CardHeader description={<Caption1 className={styles.caption}>{description}</Caption1>} />
    </Card>
  );

  const renderExample = (id: string, name: string, description: string) => (
    <Card className={styles.card} size='small' appearance='filled' role='listitem'>
      <CardHeader
        header={<Text weight='semibold'>{name}</Text>}
        description={<Caption1 className={styles.caption}>{description}</Caption1>}
        action={
          <Button size='small' appearance='secondary' style={{ minWidth: 0 }} onClick={() => loadExample(id)}>
            Open
          </Button>
        }
      />
    </Card>
  );

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Body1>Example Programs</Body1>
      </header>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <Caption1>This is a curated set of example programs that can be loaded into the IDE.</Caption1>
        </div>

        <Accordion collapsible multiple>
          {/* Simple Examples */}
          <AccordionItem value='simple'>
            <AccordionHeader className={styles.accordionHeader}>Simple Examples</AccordionHeader>
            <AccordionPanel>
              {renderSectionHeader(
                'These example programs are deliberately simple to demonstrate some common concepts and provide an introduction to the assembly language:'
              )}
              {isDevMode && renderExample('counter', 'Countdown Timer', 'DEV ONLY: A simple counter program')}
              {renderExample('fibonacci', 'Fibonacci Series', 'Calculates the first 13 terms of the Fibonacci series')}
              {isDevMode && renderExample('hello-world', 'Hello World', 'DEV ONLY: The classic "Hello World" program')}
              {isDevMode && renderExample('memory-test', 'Memory Test', 'DEV ONLY: Tests a block of memory')}
            </AccordionPanel>
          </AccordionItem>

          {/* Complex Examples */}
          <AccordionItem value='complex'>
            <AccordionHeader className={styles.accordionHeader}>Complex Examples</AccordionHeader>
            <AccordionPanel>
              {renderSectionHeader('These example programs are much fuller (and therefore more complex):')}
              {renderExample(
                'pi-bbp-v1',
                'Pi Calculation (BBP)',
                'Uses the Bailey-Borwein-Plouffe (BBP) formula to compute Pi digit by digit in base 16.'
              )}
            </AccordionPanel>
          </AccordionItem>

          {/* Mathematical Operations */}
          <AccordionItem value='math'>
            <AccordionHeader className={styles.accordionHeader}>Mathematical Operations</AccordionHeader>
            <AccordionPanel>
              {renderSectionHeader(
                "These example programs demonstrate how to perform common mathematical operations that aren't native to the relay computer:"
              )}
              {renderExample('addition-long-se', 'Long Addition', 'Byte-by-byte long addition')}
              {renderExample('subtract-8', '8-bit Subtract', '')}
              {renderExample('subtract-16', '16-bit Subtract', '')}
              {renderExample(
                'subtraction-long-se',
                'Long Subtraction',
                'Byte-by-byte long subtraction (performed by 2s complement then long addition)'
              )}
              {renderExample(
                'multiply-8',
                '8-bit Multiply',
                'Multiplies two unsigned 8-bit numbers to produce an 8-bit result'
              )}
              {isDevMode &&
                renderExample(
                  'multiply-16',
                  '16-bit Multiply',
                  'DEV ONLY: Multiplies two unsigned 8-bit numbers to produce a 16-bit result'
                )}
              {renderExample(
                'reciprocal-long-se',
                'Long Reciprocal',
                'Byte-by-byte long reciprocal using the non-restoring unsigned integer division method'
              )}
              {renderExample(
                'reciprocal-long-se-v2',
                'Long Reciprocal v2',
                'Revised example of byte-by-byte long reciprocal now using the restoring unsigned integer division method'
              )}
              {renderSectionHeader(
                'Many of the examples above are also available in "Handy Routines" as reusable functions.'
              )}
            </AccordionPanel>
          </AccordionItem>

          {/* Handy Routines */}
          <AccordionItem value='handy'>
            <AccordionHeader className={styles.accordionHeader}>Handy Routines</AccordionHeader>
            <AccordionPanel>
              {renderSectionHeader(
                'These programs provide (and demonstrate) reusable functions that could be used by other programs:'
              )}
              <div>
                {renderExample('convert-endian', 'Convert Endianness', 'Endian conversion (reverse bytes)')}
                {renderExample('addition-long', 'Long Addition', 'Byte-by-byte long addition')}
                {renderExample(
                  'subtraction-long',
                  'Long Subtraction',
                  'Byte-by-byte long subtraction (performed by 2s complement then long addition)'
                )}
                {renderExample(
                  'reciprocal-long',
                  'Long Reciprocal',
                  'Byte-by-byte long reciprocal using the restoring unsigned integer division method'
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      <div className={styles.footer}>
        <Caption1>Loading an example will replace any existing program active in the IDE.</Caption1>
      </div>
    </div>
  );
}

export default Examples;
