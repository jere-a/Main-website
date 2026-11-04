export function setupWakeLockOnDev() {
  navigator.wakeLock.request("screen").catch((err: Error) => {
    // oxlint-disable-next-line no-console
    console.log(`${err.name}, ${err.message}`);
  });
}
