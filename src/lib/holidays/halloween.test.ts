import { afterEach, describe, expect, it } from "vitest";

import { halloween } from "./halloween";

describe("halloween", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.adoptedStyleSheets = [];
  });

  it("appends a stylesheet to the adopted style sheets", async () => {
    await halloween();

    expect(document.adoptedStyleSheets).toHaveLength(1);
  });

  it("adds the halloween class to every paragraph", async () => {
    document.body.innerHTML = "<p>one</p><p>two</p><p>three</p>";

    await halloween();

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
    for (const paragraph of paragraphs) {
      expect(paragraph.classList.contains("halloween")).toBe(true);
    }
  });

  it("adds the butcherman class to paragraphs flagged as holidays", async () => {
    document.body.innerHTML = '<p class="holidays">festive</p><p>plain</p>';

    await halloween();

    expect(document.querySelector("p.holidays")?.classList.contains("butcherman")).toBe(true);
    expect(document.querySelector("p:not(.holidays)")?.classList.contains("butcherman")).toBe(
      false,
    );
  });

  it("leaves non-paragraph elements untouched", async () => {
    document.body.innerHTML = "<p>para</p><div>div</div><span>span</span>";

    await halloween();

    expect(document.querySelector("div")?.classList.contains("halloween")).toBe(false);
    expect(document.querySelector("span")?.classList.contains("halloween")).toBe(false);
  });
});
