/**
 * Client-side entry point. Runs on every page load: initializes analytics, sets up global event
 * handlers (context menu suppression, Konami code easter egg), and triggers holiday effects when
 * applicable.
 */

import { createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";

import init from "./analytics.ts";
import { on, isHoliday } from "./utils/index";

/** Defer PostHog init to idle time or fallback after 1s. */
const schedulePosthogInit = () => {
  const runInit = () => {
    // oxlint-disable-next-line promise/prefer-await-to-then
    void init().catch((e) => {
      // oxlint-disable-next-line no-console
      console.error("init failed", e);
    });
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(runInit, { timeout: 2000 });
  } else {
    setTimeout(runInit, 1000);
  }
};

/** Disable right-click context menu on images. */
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

/** Log a message when the Konami code sequence is entered. */
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

/** Reload the page if Vite fails to load a chunk (hot module reload edge case). */
const handleVitePreloadError = () => {
  addEventListener("vite:preloadError", () => {
    window.location.reload();
  });
};

/** Run holiday effects if today falls within a holiday season. */
const loadHolidayEffect = async () => {
  const holiday = await isHoliday();
  await holiday?.runScript();
};

const main = async () => {
  schedulePosthogInit();
  suppressImageContextMenu();
  setupKonamiCode();
  handleVitePreloadError();
  await loadHolidayEffect();
};

export default main;
