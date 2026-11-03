/**
 * Client-side entry point. Composes the small, single-purpose behaviours that run on every page
 * load. Each behaviour lives in its own module under `./client` so it can be reasoned about (and
 * tested) in isolation.
 */

import { runAnalyticsInit } from "./client/analytics-init.ts";
import { suppressImageContextMenu } from "./client/context-menu.ts";
import { loadHolidayEffect } from "./client/holiday-effects.ts";
import { setupKonamiCode } from "./client/konami-code.ts";
import { setupPreloadRecovery } from "./client/preload-recovery.ts";

const main = (): void => {
  runAnalyticsInit();
  suppressImageContextMenu();
  setupKonamiCode();
  setupPreloadRecovery();
  loadHolidayEffect();
};

export default main;
