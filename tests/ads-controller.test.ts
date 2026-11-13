import {describe, expect, it, vi} from 'vitest';
import {createAdController, type AdsAdapter} from '../apps/client/src/native/ads-controller';

const flush = async () => { for (let i = 0; i < 40; i++) await Promise.resolve(); };
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return {promise, resolve, reject};
}
function fixture() {
  let now = 200_000, seq = 0;
  let stored: string | null = JSON.stringify({spins: 0, activeMs: 120_000, shownAt: []});
  const ads: {events: Parameters<AdsAdapter['preload']>[0]; show: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn>}[] = [];
  const sdk = {
    consent: vi.fn(async () => true),
    privacy: vi.fn(async () => true),
    initialize: vi.fn(async () => {}),
    preload: vi.fn((events: Parameters<AdsAdapter['preload']>[0]) => {
      const ad = {events, show: vi.fn(async () => {}), dispose: vi.fn()};
      ads.push(ad);
      return ad;
    }),
  } satisfies AdsAdapter;
  const write = vi.fn(async (raw: string) => { stored = raw; });
  const controller = createAdController({sdk, read: async () => stored, write, now: () => now});
  const event = (event: Parameters<typeof controller.receive>[0]['event']) => controller.receive({event, seq: ++seq});
  return {controller, sdk, ads, write, event, advance: (ms: number) => { now += ms; },
    stored: () => stored,
    async start() { controller.active(true); event('ready'); await flush(); },
    async spins() { for (let i = 0; i < 6; i++) event('spin'); await flush(); },
  };
}

describe('native interstitial lifecycle', () => {
  it('never shows from a late load callback, only at a later explicit natural break', async () => {
    const f = fixture(); await f.start(); await f.spins();
    f.event('home'); await flush();
    f.ads[0].events.loaded(); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled();
    f.event('home'); await flush();
    expect(f.ads[0].show).toHaveBeenCalledTimes(1);
    expect(JSON.parse(f.stored()!).spins).toBe(0);
    f.ads[0].events.closed(); f.event('home'); await flush();
    expect(f.ads[0].show).toHaveBeenCalledTimes(1);
  });
  it('does not initialize or preload while consent denies requests', async () => {
    const f = fixture(); f.sdk.consent.mockResolvedValue(false); await f.start(); await f.spins();
    f.event('home'); await flush();
    expect(f.sdk.initialize).not.toHaveBeenCalled();
    expect(f.ads).toHaveLength(0);
  });
  it('waits for fresh consent before initialization and preloading', async () => {
    const f = fixture(), consent = deferred<boolean>();
    f.sdk.consent.mockReturnValue(consent.promise); await f.start();
    expect(f.sdk.initialize).not.toHaveBeenCalled();
    consent.resolve(true); await flush();
    expect(f.sdk.initialize).toHaveBeenCalledTimes(1);
    expect(f.ads).toHaveLength(1);
  });
  it.each(['busy', 'spin'] as const)('cancels a pending persisted opportunity on %s', async event => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    const pending = deferred<void>(); f.write.mockImplementationOnce(() => pending.promise);
    f.event('home'); await flush();
    expect(f.write).toHaveBeenCalledTimes(7);
    expect(f.ads[0].show).not.toHaveBeenCalled();
    f.event(event); pending.resolve(); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled();
  });
  it('cancels a pending persisted opportunity on background and never shows on resume', async () => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    const pending = deferred<void>(); f.write.mockImplementationOnce(() => pending.promise);
    f.event('home'); await flush(); f.controller.active(false); pending.resolve(); await flush();
    f.controller.active(true); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled();
  });
  it('drops preloads before privacy changes, ignores stale callbacks and can recover after denial', async () => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    f.sdk.privacy.mockResolvedValue(false); f.event('privacy'); await flush();
    expect(f.ads[0].dispose).toHaveBeenCalledTimes(1);
    f.ads[0].events.loaded(); f.event('home'); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled(); expect(f.ads).toHaveLength(1);
    f.advance(60_001); f.controller.active(false); f.controller.active(true); await flush();
    expect(f.sdk.consent).toHaveBeenCalledTimes(2);
    expect(f.sdk.initialize).toHaveBeenCalledTimes(1);
    expect(f.ads).toHaveLength(2);
    f.ads[1].events.loaded(); await flush(); expect(f.ads[1].show).not.toHaveBeenCalled();
    f.event('home'); await flush(); expect(f.ads[1].show).toHaveBeenCalledTimes(1);
  });
  it('queues explicit privacy choices while startup consent is pending', async () => {
    const f = fixture(), consent = deferred<boolean>(); f.sdk.consent.mockReturnValue(consent.promise);
    await f.start(); f.event('privacy'); await flush(); consent.resolve(true); await flush();
    expect(f.sdk.privacy).toHaveBeenCalledTimes(1);
    expect(f.ads).toHaveLength(1);
  });
  it('bounds load retry after no-fill and catches synchronous preload errors', async () => {
    const f = fixture(); await f.start(); f.ads[0].events.failed();
    for (let i = 0; i < 4; i++) f.event('spin'); await flush(); expect(f.ads).toHaveLength(1);
    f.advance(60_001); f.sdk.preload.mockImplementationOnce(() => { throw Error('offline'); });
    f.event('spin'); await flush(); expect(f.sdk.preload).toHaveBeenCalledTimes(2);
    f.event('spin'); await flush(); expect(f.sdk.preload).toHaveBeenCalledTimes(2);
    f.advance(60_001); f.event('spin'); await flush(); expect(f.ads).toHaveLength(2);
  });
  it('replaces an expired ad without showing it or showing its replacement late', async () => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    f.advance(55 * 60_000); f.event('home'); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled(); expect(f.ads[0].dispose).toHaveBeenCalled();
    expect(f.ads).toHaveLength(2); f.ads[1].events.loaded(); await flush();
    expect(f.ads[1].show).not.toHaveBeenCalled();
  });
  it('suppresses ads if durable reservation fails', async () => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    f.write.mockRejectedValueOnce(Error('full')); f.event('home'); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled(); expect(f.ads[0].dispose).toHaveBeenCalled();
  });
  it('keeps the app usable but suppresses ads when persisted limits cannot be read', async () => {
    const f = fixture(); const c = createAdController({sdk: f.sdk, read: async () => { throw Error('storage'); }, write: f.write, now: () => 0});
    c.active(true); c.receive({event: 'ready', seq: 1}); await flush();
    expect(f.sdk.consent).not.toHaveBeenCalled(); c.active(false); await flush();
    expect(f.write).not.toHaveBeenCalled(); c.dispose();
  });
  it('backs off failed consent and recovers on a later resume', async () => {
    const f = fixture(); f.sdk.consent.mockRejectedValueOnce(Error('offline')); await f.start();
    f.controller.active(false); f.controller.active(true); await flush(); expect(f.sdk.consent).toHaveBeenCalledTimes(1);
    f.advance(60_001); f.controller.active(false); f.controller.active(true); await flush();
    expect(f.sdk.consent).toHaveBeenCalledTimes(2); expect(f.ads).toHaveLength(1);
  });
  it('backs off initialization errors without blocking subsequent app events', async () => {
    const f = fixture(); f.sdk.initialize.mockRejectedValueOnce(Error('sdk unavailable')); await f.start();
    expect(f.ads).toHaveLength(0); await f.spins(); f.event('home'); await flush();
    expect(f.sdk.initialize).toHaveBeenCalledTimes(1);
    f.advance(60_001); f.controller.active(false); f.controller.active(true); await flush();
    expect(f.sdk.initialize).toHaveBeenCalledTimes(2); expect(f.ads).toHaveLength(1);
  });
  it('releases a failed show and never retries it from an SDK callback', async () => {
    const f = fixture(); await f.start(); await f.spins(); f.ads[0].events.loaded();
    f.ads[0].show.mockRejectedValueOnce(Error('not foreground')); f.event('home'); await flush();
    expect(f.ads[0].dispose).toHaveBeenCalledTimes(1); expect(f.ads[0].show).toHaveBeenCalledTimes(1);
    f.ads[0].events.loaded(); f.ads[0].events.closed(); await flush();
    expect(f.ads[0].show).toHaveBeenCalledTimes(1);
  });
  it('rejects duplicates and ignores callbacks after disposal', async () => {
    const f = fixture(); await f.start();
    for (let i = 0; i < 6; i++) f.controller.receive({event: 'spin', seq: 2});
    await flush(); f.ads[0].events.loaded(); f.event('home'); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled();
    f.controller.dispose(); f.ads[0].events.loaded(); f.ads[0].events.closed(); f.controller.active(true); f.event('home'); await flush();
    expect(f.ads[0].show).not.toHaveBeenCalled(); expect(f.ads[0].dispose).toHaveBeenCalledTimes(1);
  });
});
