import {AdPolicy, type AdMessage} from './ads-policy';

export interface AdsAdapter {
  consent(): Promise<boolean>;
  privacy(): Promise<boolean>;
  initialize(): Promise<void>;
  preload(events: {loaded(): void; closed(): void; failed(): void}): {
    show(): Promise<void>;
    dispose(): void;
  };
}

const RETRY_MS = 60_000;
const MAX_LOADED_MS = 55 * 60_000;

export function createAdController(deps: {
  sdk: AdsAdapter;
  read(): Promise<string | null>;
  write(raw: string): Promise<void>;
  now(): number;
}) {
  let policy: AdPolicy;
  let dead = false, active = false, ready = false, allowed = false;
  let initialized = false, booting = false, showing = false, loaded = false;
  let lastSeq = 0, generation = 0, adGeneration = 0, loadedAt = 0;
  let nextLoadAt = 0, nextConsentAt = 0, storageHealthy = true;
  let privacyPending = false;
  let ad: ReturnType<AdsAdapter['preload']> | null = null;
  let writes: Promise<void> = Promise.resolve();
  const hydrated = Promise.resolve().then(deps.read).then(raw => {
    policy = new AdPolicy(raw, deps.now());
    policy.setActive(active, deps.now());
  }).catch(() => {
    // Unreadable counters must not let a restart bypass an existing cap.
    storageHealthy = false;
    policy = new AdPolicy(null, deps.now());
  });

  function persist() {
    if (!storageHealthy) return Promise.reject(new Error('Ad limits unavailable'));
    const raw = policy.serialize(deps.now());
    writes = writes.catch(() => {}).then(() => deps.write(raw));
    return writes;
  }
  function drop() {
    ++adGeneration;
    const previous = ad;
    ad = null;
    loaded = false;
    try { previous?.dispose(); } catch { /* Ads must never block the app. */ }
  }
  function finishShowing() {
    showing = false;
    policy.setActive(active && ready, deps.now());
  }
  function failed() {
    finishShowing();
    drop();
    nextLoadAt = deps.now() + RETRY_MS;
  }
  function preload() {
    if (ad && !showing && loaded && deps.now() - loadedAt >= MAX_LOADED_MS) drop();
    if (dead || !active || !ready || !allowed || !initialized || !storageHealthy || ad || showing || deps.now() < nextLoadAt) return;
    const epoch = ++adGeneration;
    try {
      const candidate = deps.sdk.preload({
        // A load/consent/network callback can prepare, but never display, an ad.
        loaded: () => {
          if (!dead && epoch === adGeneration) { loaded = true; loadedAt = deps.now(); }
        },
        closed: () => {
          if (dead || epoch !== adGeneration) return;
          finishShowing();
          drop();
        },
        failed: () => {
          if (!dead && epoch === adGeneration) failed();
        },
      });
      if (dead || epoch !== adGeneration) candidate.dispose();
      else ad = candidate;
    } catch { failed(); }
  }
  async function boot(privacy = false) {
    if (dead || booting || showing || !active || !ready || !storageHealthy) return;
    booting = true;
    allowed = false;
    drop();
    try {
      const consent = await (privacy ? deps.sdk.privacy() : deps.sdk.consent());
      if (dead) return;
      allowed = consent;
      nextConsentAt = deps.now() + RETRY_MS;
      if (allowed) {
        if (!initialized) { await deps.sdk.initialize(); initialized = true; }
        if (!dead && !privacyPending) preload();
      }
    } catch {
      allowed = false;
      nextConsentAt = deps.now() + RETRY_MS;
    } finally {
      booting = false;
      if (!dead && privacyPending && active && ready) {
        privacyPending = false;
        void boot(true);
      }
    }
  }
  function prepare() {
    if (dead || !active || !ready || !storageHealthy) return;
    if (privacyPending && !booting && !showing) {
      privacyPending = false;
      void boot(true);
    } else if (!booting && !allowed && deps.now() >= nextConsentAt) void boot();
    else preload();
  }
  async function opportunity(token: number) {
    if (dead || !active || !ready || !allowed || !storageHealthy || !loaded || !ad || showing || deps.now() - loadedAt >= MAX_LOADED_MS || !policy.eligible(deps.now())) return;
    showing = true;
    const candidate = ad;
    policy.reserve(deps.now());
    policy.setActive(false, deps.now());
    try {
      await persist();
      if (dead || token !== generation || !active || !ready || !allowed || candidate !== ad) {
        if (!dead) { finishShowing(); prepare(); }
        return;
      }
      loaded = false;
      await candidate.show();
    } catch { if (!dead) failed(); }
  }
  return {
    receive(m: AdMessage) {
      if (dead || m.seq <= lastSeq) return;
      lastSeq = m.seq;
      const token = ++generation;
      void hydrated.then(() => {
        if (dead) return;
        if (m.event === 'ready') {
          ready = true;
          policy.ready(deps.now());
          policy.setActive(active && !showing, deps.now());
          prepare();
        } else if (m.event === 'spin') {
          policy.spin(deps.now());
          void persist().catch(() => {});
          preload();
        } else if (m.event === 'home') {
          if (token === generation) void opportunity(token);
          preload();
        } else if (m.event === 'privacy') {
          // Invalidate old consent/preloads immediately, including during a pending write.
          allowed = false;
          drop();
          privacyPending = true;
          prepare();
        }
      }).catch(() => {});
    },
    active(value: boolean) {
      active = value;
      ++generation;
      void hydrated.then(() => {
        if (dead) return;
        policy.setActive(value && ready && !showing, deps.now());
        if (!value) void persist().catch(() => {});
        else if (ready) prepare();
      });
    },
    resetDocument() {
      lastSeq = 0;
      ++generation;
      ready = false;
      void hydrated.then(() => { if (!dead && !ready) policy.setActive(false, deps.now()); });
    },
    dispose() { dead = true; ++generation; drop(); },
  };
}
