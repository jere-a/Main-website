/**
 * New Year's Eve holiday effect. Displays fireworks animation with optional sound effects. Sound is
 * enabled only after the first user interaction (pointer or key).
 */

import { Fireworks } from "fireworks-js";

import exp0 from "@/data/sounds/explosion0.mp3";
import exp1 from "@/data/sounds/explosion1.mp3";
import exp2 from "@/data/sounds/explosion2.mp3";

let fireworks: Fireworks | null = null;
let container: HTMLDivElement | null = null;

/** Enable sound after user interaction. */
const enableSound = () => {
  fireworks?.updateOptions({ sound: { enabled: true } });
};

/** Stop fireworks and remove the container from the DOM. */
const cleanup = () => {
  fireworks?.stop();
  fireworks = null;

  if (container) {
    container.remove();
    container = null;
  }
};

/** Create the fireworks container, start the animation, and listen for user interaction. */
const init = () => {
  cleanup();

  container = document.createElement("div");
  container.className = "fireworks-container";
  Object.assign(container.style, {
    position: "absolute",
    inset: "0",
    zIndex: "-2",
    pointerEvents: "none",
    overflow: "hidden",
  });

  document.body.appendChild(container);

  fireworks = new Fireworks(container, {
    boundaries: {
      x: 50,
      y: 50,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    sound: { enabled: false, files: [exp0, exp1, exp2] },
  });

  fireworks.start();

  window.addEventListener("pointerdown", enableSound, { once: true });
  window.addEventListener("keydown", enableSound, { once: true });
};

/** Start the New Year's fireworks effect. No-op on the server. */
export const newYear = async () => {
  if (typeof window === "undefined") return;
  init();
};
