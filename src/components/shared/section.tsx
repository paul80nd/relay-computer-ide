import { makeStyles, tokens } from '@fluentui/react-components';
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
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalNone}`,
  },
  content: {
    minHeight: 0,
    flexGrow: 1,
    overflowY: 'auto',
  },
  footer: {
    color: tokens.colorStatusWarningForeground1,
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalMNudge}`,
    lineHeight: tokens.lineHeightBase100,
  },
});

export function SectionFooter({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  return <div className={styles.footer}>{children}</div>;
}

export function SectionContent({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  return <div className={styles.content}>{children}</div>;
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Text as='h2' size={200}>
          {title}
        </Text>
      </header>
      {children}
    </div>
  );
}
