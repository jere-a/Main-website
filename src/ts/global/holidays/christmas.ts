import LetItGo from "let-it-go/src";
import christmasstyle from "@/styles/holidays/christmas.css?url";
import { l } from "@/ts/global";

export const christmas = async () => {
  new LetItGo();

  const lightrope = document.createElement("ul");
  lightrope.className = "lightrope";
  for (let i = 0; i < 42; i++) {
    const listItem = document.createElement("li");
    lightrope.appendChild(listItem);
  }
  document.body?.insertBefore(lightrope, document.body.firstChild) ||
    console.error("Document body is not ready.");

  import(christmasstyle);
  l("Christmas");
};
