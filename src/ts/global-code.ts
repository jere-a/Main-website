import { createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";

import { on, isHoliday } from "./global/index";
import init from "./posthog.ts";

const main = async () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        void init();
      },
      { timeout: 2000 },
    );
  } else {
    setTimeout(() => {
      void init();
    }, 1000);
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
    if (event.key !== "ArrowUp") return;
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
