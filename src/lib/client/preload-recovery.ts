/**
 * Recover from stale-chunk load failures after a deployment.
 *
 * `vite:preloadError` fires when a lazily imported chunk can no longer be fetched (usually because
 * a new build changed the asset hash while the old document is still open). Reloading picks up the
 * fresh build. The reload is rate-limited so a _persistent_ failure (offline, blocked CDN edge)
 * cannot trap the visitor in an infinite reload loop, while a genuine later failure can still
 * recover.
 */

const RELOAD_FLAG = "vite:preloadError:reloadedAt";
const RELOAD_WINDOW_MS = 10_000;

const shouldReload = (now: number): boolean => {
  try {
    const storage = window.sessionStorage;
    const lastReload = Number(storage.getItem(RELOAD_FLAG));

    if (Number.isFinite(lastReload) && now - lastReload < RELOAD_WINDOW_MS) {
      return false;
    }

    storage.setItem(RELOAD_FLAG, String(now));
    return true;
  } catch {
    // Storage is unavailable (private mode, blocked cookies): fall back to reloading.
    return true;
  }
};

export const setupPreloadRecovery = (): void => {
  addEventListener("vite:preloadError", () => {
    if (shouldReload(Date.now())) {
      window.location.reload();
    }
  });
};
