import {
  Badge,
  Card,
  CardHeader,
  Text,
  Tooltip,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { isInstructionDoc, type AluFlags, type AluFlagState, type MnemonicDoc } from './docs';
import { Fragment } from 'react';

const useStyles = makeStyles({
  card: {
    height: 'fit-content',
    marginBottom: tokens.spacingVerticalXS
  },
  badges: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS
  },
  syntax: {
    fontSize: tokens.fontSizeBase400,
    marginRight: '.3rem',
    display: 'inline',
    whiteSpace: 'pre-wrap'
  },
  instrSummaries: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalXS
  },
  instrSummary: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    margin: 0
  },
  instDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200
  },
  code: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: tokens.fontWeightRegular,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorPaletteGreenForeground2
  }
});

export function Mnemonic(doc: MnemonicDoc) {
  const styles = useStyles();

  function Code({ children }: { children: React.ReactNode }) {
    return <code className={styles.code}>{children}</code>;
  }

  const renderWithInlineCode = (input?: string) => {
    if (!input) return null;
    // Split on backticks, keeping code parts
    // "foo `bar` baz" -> ["foo ", "bar", " baz"]
    const parts = input.split(/`/g);

    // If there are no backticks, just return the original string
    if (parts.length === 1) return input;

    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
      const chunk = parts[i];
      if (chunk === '') continue;

      // Odd indices are code spans (between backticks)
      const isCode = i % 2 === 1;
      nodes.push(isCode ? <Code key={i}>{chunk}</Code> : <Fragment key={i}>{chunk}</Fragment>);
    }
    return nodes;
  };

  if (isInstructionDoc(doc)) {
    const vs = doc.variants ?? [];

    const flag = (flag: AluFlagState, tgt: string, name: string) => (
      <Tooltip
        content={
          flag === '*'
            ? `${name} flag is set or cleared according to the outcome of the instruction`
            : flag === '0'
              ? `${name} flag is cleared`
              : `Impacts ${name} flag`
        }
        withArrow
        relationship='description'
      >
        <Badge
          size='small'
          shape='circular'
          appearance='outline'
          color={flag === '*' ? 'brand' : flag === '0' ? 'danger' : 'success'}
        >
          {tgt}
        </Badge>
      </Tooltip>
    );
    const flags = (flags: AluFlags) => (
      <>
        {flags.s !== '-' ? flag(flags.s, 'S', 'Sign') : null}
        {flags.c !== '-' ? flag(flags.c, 'C', 'Carry') : null}
        {flags.z !== '-' ? flag(flags.z, 'Z', 'Zero') : null}
      </>
    );
    const cls = (cls: string) => (
      <Tooltip content={'Instruction Class: ' + cls} withArrow relationship='description'>
        <Badge size='small' shape='rounded' color='important' appearance='outline'>
          {cls}
        </Badge>
      </Tooltip>
    );
    const cycles = (cycles: number) => (
      <Tooltip
        content={'Instruction Duration: ' + cycles + ' Cycles'}
        withArrow
        relationship='description'
      >
        <Badge size='small' appearance='outline' color='important' shape='rounded'>
          {cycles}
        </Badge>
      </Tooltip>
    );

    const main = (
      <Card className={styles.card}>
        <CardHeader
          header={doc.syntax.map((s, ii) =>
            s.split(' ').map((p, i) => (
              <Text
                className={styles.syntax}
                key={`${ii}_${i}`}
                weight={i == 0 ? 'semibold' : 'regular'}
              >
                {p}
              </Text>
            ))
          )}
          action={
            <div className={styles.badges}>
              {doc.flags ? flags(doc.flags) : null}
              {cls(doc.class)}
              {cycles(doc.cycles)}
            </div>
          }
        />

        <div className={styles.instrSummaries}>
          <Text as='p' className={styles.instrSummary}>
            {vs.length > 0 ? (doc.variant ?? doc.summary) : doc.summary}
          </Text>
          {doc.description?.map((d, i) => (
            <Text as='p' key={i} className={styles.instDesc}>
              {renderWithInlineCode(d)}
            </Text>
          ))}
        </div>
      </Card>
    );

    const variants = vs.map((v, iii) => (
      <Card className={styles.card} key={`${iii}`}>
        <CardHeader
          header={
            <div>
              {v.syntax.map((s, ii) => (
                <div key={`${ii}`}>
                  {s.split(' ').map((p, i) => (
                    <Text
                      className={styles.syntax}
                      key={`${i}`}
                      weight={i == 0 ? 'semibold' : 'regular'}
                    >
                      {p}
                    </Text>
                  ))}
                </div>
              ))}
            </div>
          }
          action={
            <div className={styles.badges}>
              {doc.flags ? flags(doc.flags) : null}
              {cls(v.class)}
              {cycles(v.cycles)}
            </div>
          }
        />
        <div className={styles.instrSummaries}>
          <Text as='p' className={styles.instrSummary}>
            {v.variant}
          </Text>
          {v.description?.map((d, i) => (
            <Text as='p' key={i} className={styles.instDesc}>
              {renderWithInlineCode(d)}
            </Text>
          ))}
        </div>
      </Card>
    ));

    return [main, ...variants];
  } else {
    return (
      <Card className={styles.card}>
        <CardHeader
          header={doc.syntax.map(s =>
            s.split(' ').map((p, i) => (
              <Text className={styles.syntax} key={i} weight={i == 0 ? 'semibold' : 'regular'}>
                {p}
              </Text>
            ))
          )}
        />
        <div className={styles.instrSummaries}>
          <Text as='p' className={styles.instrSummary}>
            {doc.summary}
          </Text>
          {doc.description?.map((d, i) => (
            <Text as='p' key={i} className={styles.instDesc}>
              {renderWithInlineCode(d)}
            </Text>
          ))}
        </div>
      </Card>
    );
  }
}
