import cssSheet from "@/styles/holidays/halloween.css?inline" with { type: "css" };

const sheet = new CSSStyleSheet();
sheet.replaceSync(cssSheet);

export const main_halloween = async () => {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

  document.querySelectorAll("p").forEach((e) => {
    if (typeof e !== "string") {
      e.classList.add("halloween");
      if (e.classList.contains("holidays")) {
        e.classList.add("butcherman");
      }
    } else {
      document.querySelectorAll<HTMLElement>(e).forEach((elem) => {
        elem.classList.add("halloween");
      });
    }
  });
};
