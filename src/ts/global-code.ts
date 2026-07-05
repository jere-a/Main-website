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

  on(document.body, "keydown", (event) => {
    const Arrow = "Arrow";
    const KeyMap = { U: "Up", D: "Down", L: "Left", R: "Right" } as const;

    if (event.key === `${Arrow}${KeyMap.U}`) {
      if (
        createSequenceMatcher(
          [..."UUDDLRLRBA"].map((key) =>
            key in KeyMap ? `${Arrow}${KeyMap[key]}` : key,
          ) as HotkeySequence,
          { timeout: 2000 },
        ).match(event)
      ) {
        // oxlint-disable-next-line no-console
        console.log(atob("S29uYW1pIGNvZGUgYWN0aXZhdGVkLg=="));
      }
    }
  });

  addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  const holiday = await isHoliday();
  await holiday?.runScript();
};

export default main;
