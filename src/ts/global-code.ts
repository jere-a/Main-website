import {
  checkHotkey,
  createSequenceMatcher,
  type HotkeySequence,
} from "@tanstack/hotkeys";
import { addEventListener, isHoliday } from "./global/index";

const main = () => {
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

  for (const hotkey in konamiCode) {
    checkHotkey(hotkey);
  }

  const konami = createSequenceMatcher(konamiCode, { timeout: 2000 });

  window.addEventListener("keydown", (event) => {
    if (konami.match(event)) {
      // biome-ignore lint/suspicious/noConsole: Konami code message for now for info if it's going to be enabled
      console.log("Konami code activated.");
    }
  });

  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  const runHolidayEffects = async () => {
    const holiday = await isHoliday();
    if (holiday.bool) {
      holiday.script();
    }
  };
  runHolidayEffects();
};

export default main;
