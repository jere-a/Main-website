/** Konami-code easter egg. */

import { createSequenceMatcher, type HotkeySequence } from "@tanstack/hotkeys";
import { on } from "@utils/index";

const KONAMI_SEQUENCE = [
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
] satisfies HotkeySequence;

export const setupKonamiCode = (): void => {
  const konamiCode = createSequenceMatcher(KONAMI_SEQUENCE, { timeout: 2000 });

  on(document.body, "keydown", (event) => {
    if (!konamiCode.match(event)) return;

    // oxlint-disable-next-line no-console
    console.log(atob("S29uYW1pIGNvZGUgYWN0aXZhdGVkLg=="));
  });
};
