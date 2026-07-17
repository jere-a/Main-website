/**
 * Halloween holiday effect. Applies a dark CSS stylesheet and adds "halloween" class to all <p>
 * elements. Elements with class "holidays" also get the "butcherman" font class.
 */

import cssSheet from "@/styles/holidays/halloween.css?inline" with { type: "css" };

const sheet = new CSSStyleSheet();
sheet.replaceSync(cssSheet);

export const halloween = async () => {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

  document.querySelectorAll("p").forEach((p) => {
    p.classList.add("halloween");
    if (p.classList.contains("holidays")) {
      p.classList.add("butcherman");
    }
  });
};
