// TypeScript
import { createRafScheduler } from '../../../src/components/emulator/raf-scheduler';

/**
 * A controllable requestAnimationFrame stand-in: frames are queued and only run
 * when `flush()` is called, and cancelled ids are removed from the queue.
 */
function makeFakeRaf() {
  const frames = new Map<number, () => void>();
  let nextId = 1;
  const raf = jest.fn((cb: () => void) => {
    const id = nextId++;
    frames.set(id, cb);
    return id;
  });
  const caf = jest.fn((id: number) => {
    frames.delete(id);
  });
  // Take the queued frames before running them so any frame requested from
  // inside a callback stays queued for the next flush, as with real rAF.
  const flush = () => {
    const due = [...frames.values()];
    frames.clear();
    for (const cb of due) cb();
  };
  return { raf, caf, flush };
}

describe('createRafScheduler', () => {
  it('coalesces multiple request() calls into a single frame', () => {
    const { raf, caf } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const cb = jest.fn();

    s.request(cb);
    s.request(cb);
    s.request(cb);

    expect(raf).toHaveBeenCalledTimes(1);
  });

  it('runs the callback once when the frame fires', () => {
    const { raf, caf, flush } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const cb = jest.fn();

    s.request(cb);
    expect(cb).not.toHaveBeenCalled();
    flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('clears pending after a frame fires so the next request() schedules again', () => {
    const { raf, caf, flush } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const cb = jest.fn();

    s.request(cb);
    flush();
    s.request(cb);

    expect(raf).toHaveBeenCalledTimes(2);
  });

  // Regression: cancel() must clear the pending handle, not merely cancel the
  // frame. request() early-returns while a frame is pending, so a
  // cancelled-but-not-cleared handle wedges the scheduler forever (the frame
  // never fires to clear it). Under StrictMode's mount→cleanup→remount this
  // froze the emulator's UI — the core kept running but no snapshot was ever
  // committed, so "Run" appeared to do nothing after loading an example.
  it('cancel() clears the pending handle so a later request() can schedule again', () => {
    const { raf, caf } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const cb = jest.fn();

    s.request(cb); // frame pending
    expect(raf).toHaveBeenCalledTimes(1);

    s.cancel(); // must cancel AND clear
    expect(caf).toHaveBeenCalledTimes(1);

    s.request(cb); // must be able to schedule a fresh frame
    expect(raf).toHaveBeenCalledTimes(2);
  });

  it('allows a frame callback to schedule the next frame', () => {
    const { raf, caf, flush } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const second = jest.fn();

    s.request(() => s.request(second));
    flush();
    expect(raf).toHaveBeenCalledTimes(2);
    expect(second).not.toHaveBeenCalled();

    flush();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('cancel() is a no-op when nothing is pending', () => {
    const { raf, caf } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);

    s.cancel();

    expect(caf).not.toHaveBeenCalled();
  });

  it('does not run the callback of a cancelled frame', () => {
    const { raf, caf, flush } = makeFakeRaf();
    const s = createRafScheduler(raf, caf);
    const cb = jest.fn();

    s.request(cb);
    s.cancel();
    flush();

    expect(cb).not.toHaveBeenCalled();
  });
});
