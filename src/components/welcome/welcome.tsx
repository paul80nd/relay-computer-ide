import { Link, makeStyles, tokens } from '@fluentui/react-components';
import { Links } from '../../links';
import { Section, SectionContent } from '../shared';

const useStyles = makeStyles({
  contentHeader: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL} 0`,
    color: tokens.colorNeutralForeground2,
  },
  para: {
    marginTop: 0,
    marginBottom: tokens.spacingVerticalS,
  },
});

function Welcome() {
  const styles = useStyles();

  return (
    <Section title='Welcome'>
      <SectionContent>
        <div className={styles.contentHeader}>
          <p className={styles.para}>
            This is an &apos;Integrated Development Environment&apos; (IDE) for writing programs in
            an assembly language specific to my relay computer.
          </p>
          <p className={styles.para}>
            More details on my relay computer can be found at&nbsp;
            <Link href={Links.Blog} target='_blank' rel='noreferrer noopener'>
              {Links.Blog}
            </Link>
            &nbsp;and a full simulation is available at&nbsp;
            <Link href={Links.Simulator} target='_blank' rel='noreferrer noopener'>
              {Links.Simulator}
            </Link>
          </p>
        </div>
      </SectionContent>
    </Section>
  );
}

export default Welcome;
