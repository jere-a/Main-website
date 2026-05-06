import "@/styles/holidays/christmas.css";

import { tsParticles } from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";

export const christmas = async () => {
  await loadSnowPreset(tsParticles);

  await tsParticles.load({
    id: "tsparticles",
    options: {
      preset: "snow",
    },
  });

  const lightrope = document.createElement("ul");
  lightrope.className = "lightrope";
  for (let i = 0; i < 42; i++) {
    const listItem = document.createElement("li");
    lightrope.appendChild(listItem);
  }
  document.body?.insertBefore(lightrope, document.body.firstChild);
};
