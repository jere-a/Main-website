import LetItGo from "let-it-go/src";
import "@/styles/holidays/christmas.css";

export const christmas = async () => {
  new LetItGo();

  const lightrope = document.createElement("ul");
  lightrope.className = "lightrope";
  for (let i = 0; i < 42; i++) {
    const listItem = document.createElement("li");
    lightrope.appendChild(listItem);
  }
  document.body?.insertBefore(lightrope, document.body.firstChild);
};
