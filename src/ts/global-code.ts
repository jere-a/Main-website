import { checkHotkey, createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";

import { addEventListener, isHoliday } from "./global/index";

const main = async () => {
  addEventListener(
    document.body,
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    "img, picture",
  );

  const konamiCode: HotkeySequence = [
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
  ];

  konamiCode.forEach((hotkey) => {
    checkHotkey(hotkey);
  });

  const konami = createSequenceMatcher(konamiCode, { timeout: 2000 });

  window.addEventListener("keydown", (event) => {
    if (konami.match(event)) {
      // oxlint-disable-next-line no-console
      console.log("Konami code activated.");
    }
  });

  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  const runHolidayEffects = async () => {
    const holiday = await isHoliday();
    if (holiday.bool) {
      await holiday.script();
    }
  };
  await runHolidayEffects();
};

export default main;
