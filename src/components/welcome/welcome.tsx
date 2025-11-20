import {
  Body1,
  Link,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Links } from '../../links';

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
  para: {
    marginTop: 0,
    paddingLeft: '.7rem',
    marginBottom: tokens.spacingVerticalS,
  },
});

function Welcome() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Body1>Welcome</Body1>
      </header>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <p className={styles.para}>
            This is an &apos;Integrated Development Environment&apos; (IDE) for writing programs in an assembly language
            specific to my relay computer.
          </p>
        </div>
        <div className={styles.contentHeader2}>
          <p className={styles.para}>
            More details on my relay computer can be found at&nbsp;
            <Link href={Links.Blog} target='_blank' rel='noreferrer'>
              {Links.Blog}
            </Link>
            &nbsp;and a full simulation is available at&nbsp;
            <Link href={Links.Simulator} target='_blank' rel='noreferrer'>
              {Links.Simulator}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
