/**
 * Client-side entry point. Runs on every page load: initializes analytics, sets up global event
 * handlers (context menu suppression, Konami code easter egg), and triggers holiday effects when
 * applicable.
 */

import { createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";

import { init } from "./analytics.ts";
import { on, $holiday } from "./utils/index";

const runInit = () => {
  // oxlint-disable-next-line promise/prefer-await-to-then
  void init().catch((e) => {
    // oxlint-disable-next-line no-console
    console.error("init failed", e);
  });
};

const schedulePosthogInit = () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(runInit, { timeout: 2000 });
  } else {
    setTimeout(runInit, 1000);
  }
};

const suppressImageContextMenu = () => {
  on(
    document.body,
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    "img, picture",
  );
};

const setupKonamiCode = () => {
  const konamiCode = createSequenceMatcher(
    [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "B",
      "A",
    ] satisfies HotkeySequence,
    { timeout: 2000 },
  );

  on(document.body, "keydown", (event) => {
    if (!konamiCode.match(event)) return;

    // oxlint-disable-next-line no-console
    console.log(atob("S29uYW1pIGNvZGUgYWN0aXZhdGVkLg=="));
  });
};

const handleVitePreloadError = () => {
  addEventListener("vite:preloadError", () => {
    window.location.reload();
  });
};

const loadHolidayEffect = () => {
  let currentKey: string | null = null;

  return $holiday.subscribe((holiday) => {
    if (!holiday || holiday.key === currentKey) {
      return;
    }

    currentKey = holiday.key;
    void holiday.runScript();
  });
};

const main = () => {
  schedulePosthogInit();
  suppressImageContextMenu();
  setupKonamiCode();
  handleVitePreloadError();
  loadHolidayEffect();
};

export default main;
