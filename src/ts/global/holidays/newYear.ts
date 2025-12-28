import { Fireworks } from "fireworks-js";
import exp0 from "@/data/sounds/explosion0.mp3";
import exp1 from "@/data/sounds/explosion1.mp3";
import exp2 from "@/data/sounds/explosion2.mp3";

let fireworks: Fireworks | null = null;
let container: HTMLDivElement | null = null;

// Enable sound only after user interaction
const enableSound = () => {
  fireworks?.updateOptions({ sound: { enabled: true } });
};

// Cleanup function
const cleanup = () => {
  fireworks?.stop();
  fireworks = null;

  if (container) {
    container.remove();
    container = null;
  }
};

// Initialize fireworks
const init = () => {
  cleanup(); // ensure no leftover instance

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

// Fire-and-forget exported function (optional manual trigger)
export const newYear = () => {
  if (typeof window === "undefined") return;
  init();
};

// ------------------------
// Automatic page load + SPA handling
// ------------------------
if (typeof window !== "undefined") {
  // Initialize on first page load
  document.addEventListener("astro:page-load", init);

  // Cleanup before Astro swaps pages
  document.addEventListener("astro:before-swap", cleanup);
}
