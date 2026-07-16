import { createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";

import { on, isHoliday } from "./global/index";
import init from "./posthog.ts";

const main = async () => {
  // oxlint-disable-next-line unicorn/consistent-function-scoping
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

  on(
    document.body,
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    "img, picture",
  );

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

  addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  const holiday = await isHoliday();
  await holiday?.runScript();
};

export default main;
