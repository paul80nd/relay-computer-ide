export interface RafScheduler {
  /**
   * Schedule `cb` to run on the next animation frame. Coalesces: while a frame
   * is already pending, further calls are ignored (the first callback wins).
   */
  request(cb: () => void): void;
  /**
   * Cancel any pending frame AND clear the pending handle, so a subsequent
   * `request()` can schedule again. Clearing (not just cancelling) is the whole
   * point: `request()` early-returns while a frame is pending, so a
   * cancelled-but-not-cleared handle would wedge the scheduler permanently —
   * exactly the bug that froze the emulator's UI after loading an example.
   */
  cancel(): void;
}

/**
 * A single-flight `requestAnimationFrame` gate: many `request()` calls collapse
 * into at most one scheduled frame. The raf/caf functions are injectable so the
 * bookkeeping can be unit-tested without a DOM.
 */
export function createRafScheduler(
  raf: (cb: () => void) => number = cb => requestAnimationFrame(cb),
  caf: (handle: number) => void = handle => cancelAnimationFrame(handle)
): RafScheduler {
  let handle: number | null = null;
  return {
    request(cb) {
      if (handle !== null) return;
      handle = raf(() => {
        handle = null;
        cb();
      });
    },
    cancel() {
      if (handle !== null) {
        caf(handle);
        handle = null;
      }
    }
  };
}
