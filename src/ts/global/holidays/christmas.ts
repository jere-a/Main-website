import { tsParticles } from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";

import cssSheet from "@/styles/holidays/christmas.css?inline" with { type: "css" };

const sheet = new CSSStyleSheet();
sheet.replaceSync(cssSheet);

export const christmas = async () => {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

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
