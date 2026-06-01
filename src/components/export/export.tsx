import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardHeader,
  Link,
  makeStyles,
  Text,
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  tokens,
  useId,
  useToastController,
} from '@fluentui/react-components';
import { Section, SectionContent } from '../shared';
import { Links } from '../../links';
import type { ExportProps } from './types';

const useStyles = makeStyles({
  accordionHeader: {
    color: tokens.colorNeutralForeground2,
  },
  card: {
    height: 'fit-content',
    marginBottom: tokens.spacingVerticalXS,
  },
  text: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    margin: '0',
  },
});

function exportToClipboard(bytes?: Uint8Array, notify?: (title: string, body: string) => void) {
  if (!bytes) return;
  const hex = [...bytes].map(x => x.toString(16).padStart(2, '0')).join('');
  navigator.clipboard.writeText(hex);
  if (notify) {
    notify('Exported to Clipboard', `Copied ${hex.length > 14 ? hex.substring(0, 14) + '...' : hex} to the clipboard`);
  }
}

// Track open export popups so a reused popup can be updated via a hash change instead
// of being closed and reopened (avoids a flash).
const openExportPopups = new Map<string, Window>();

// Open or update an export popup. The payload is written to localStorage under a random
// key; the popup page (tape.html / ldsht.html) reads the key from its own `location.hash`
// and renders. This removes all parent-side load-event timing and DOM injection, and
// works uniformly across browsers — both fresh and reused popups go through the same
// path. The popup script removes its localStorage entry after reading it.
function openExportPopup(windowName: string, href: string, dasm: string): Window | null {
  const key = Math.random().toString(36).slice(2, 10);
  const payload = `${key}@@@${dasm.replace(/\n/gi, '|')}`;
  localStorage.setItem('rcide_export_' + key, payload);

  const existing = openExportPopups.get(windowName);
  if (existing && !existing.closed) {
    existing.location.hash = '#k=' + key;
    existing.focus();
    return existing;
  }

  const wi = window.open(`${href}#k=${key}`, windowName);
  if (!wi) {
    localStorage.removeItem('rcide_export_' + key);
    return null;
  }
  openExportPopups.set(windowName, wi);
  return wi;
}

function exportToPaperTape(dasm?: string, notify?: (title: string, body: string) => void) {
  if (!dasm) return;
  if (!openExportPopup('tape', 'tape/tape.html', dasm) && notify) {
    notify('Popup Blocked', 'Allow popups for this site to export to paper tape.');
  }
}

function exportToLoadSheet(dasm?: string, notify?: (title: string, body: string) => void) {
  if (!dasm) return;
  if (!openExportPopup('loadsheet', 'loadsheet/ldsht.html', dasm) && notify) {
    notify('Popup Blocked', 'Allow popups for this site to export to load sheet.');
  }
}

function Export({ assembly }: ExportProps) {
  const styles = useStyles();

  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const notify = (title: string, body: string) =>
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody>{body}</ToastBody>
      </Toast>,
      { intent: 'success' }
    );

  const hasAssembled = assembly?.didAssemble ?? false;
  return (
    <Section title='Export Code'>
      <SectionContent>
        <Accordion collapsible multiple defaultOpenItems='assembled'>
          <AccordionItem value='assembled'>
            <AccordionHeader className={styles.accordionHeader}>for Assembled Output</AccordionHeader>
            <AccordionPanel>
              <Card className={styles.card} size='small' appearance='filled' role='listitem'>
                <CardHeader
                  header={<Text weight='semibold'>to Clipboard</Text>}
                  action={
                    <Button
                      size='small'
                      disabled={!hasAssembled}
                      appearance='secondary'
                      style={{ minWidth: 0 }}
                      onClick={() => exportToClipboard(assembly?.bytes, notify)}
                    >
                      Export
                    </Button>
                  }
                />
                <p className={styles.text}>
                  Exports the current assembled byte code to your clipboard. This can then be pasted into the{' '}
                  <Link href={Links.Simulator} rel='noopener nofollow'>
                    Relay Simulator
                  </Link>
                </p>
              </Card>
              <Card className={styles.card} size='small' appearance='filled' role='listitem'>
                <CardHeader
                  header={<Text weight='semibold'>to Paper Tape</Text>}
                  action={
                    <Button
                      size='small'
                      disabled={!hasAssembled}
                      appearance='secondary'
                      style={{ minWidth: 0 }}
                      onClick={() => exportToPaperTape(assembly?.dasm, notify)}
                    >
                      Export
                    </Button>
                  }
                />
                <p className={styles.text}>
                  Exports the current assembled byte code as a paper tape which could be printed and read into the Relay
                  Computer via an optical reader (none of which exists yet).
                </p>
              </Card>
              <Card className={styles.card} size='small' appearance='filled' role='listitem'>
                <CardHeader
                  header={<Text weight='semibold'>to Load Sheet</Text>}
                  action={
                    <Button
                      size='small'
                      disabled={!hasAssembled}
                      appearance='secondary'
                      style={{ minWidth: 0 }}
                      onClick={() => exportToLoadSheet(assembly?.dasm, notify)}
                    >
                      Export
                    </Button>
                  }
                />
                <p className={styles.text}>
                  Exports the current assembled byte code as a 'load sheet' which can be printed and makes it easier to
                  manual load programs into the Relay Computer.
                </p>
              </Card>
              <Toaster toasterId={toasterId} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </SectionContent>
    </Section>
  );
}

export default Export;
