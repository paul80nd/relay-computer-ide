export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
};

export async function saveAsTextFile(text: string): Promise<void> {
  const suggestedName = 'program.rcasm';
  const mimeType = 'text/plain';
  const extensions = ['rcasm'];

  // Attempt File System Access API (Chromium, some Edge).
  const w = window as any;
  const canFS = typeof w.showSaveFilePicker === 'function';

  if (canFS) {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'RCASM source',
            accept: { [mimeType]: extensions.map(ext => `.${ext}`) },
          },
        ],
        excludeAcceptAllOption: false,
      });
      const writable = await handle.createWritable();
      await writable.write(new Blob([text], { type: mimeType }));
      await writable.close();
      return;
    } catch (err: any) {
      // If user cancels, just return silently
      if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) return;
      // Fall through to blob-download if API exists but fails
      console.warn('showSaveFilePicker failed, falling back to download link:', err);
    }
  }

  // Fallback: force a download with a suggested name
  const blob = new Blob([text], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName; // Suggests the filename; some browsers save directly w/o rename dialog
    // Put the click on next tick to ensure menu has closed and focus is sane
    setTimeout(() => a.click(), 0);
  } finally {
    // Revoke a bit later to ensure the download was initiated
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}
