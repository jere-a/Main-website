import { afterEach, describe, expect, it } from "vitest";

import { LIGHT_COUNT, createLightrope } from "./lightrope";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("createLightrope", () => {
  it("returns a ul with the lightrope class", () => {
    const rope = createLightrope();

    expect(rope.tagName).toBe("UL");
    expect(rope.className).toBe("lightrope");
  });

  it("contains exactly LIGHT_COUNT empty li bulbs", () => {
    const rope = createLightrope();
    const bulbs = rope.querySelectorAll("li");

    expect(bulbs.length).toBe(LIGHT_COUNT);
    expect([...bulbs].every((li) => li.childElementCount === 0 && li.textContent === "")).toBe(
      true,
    );
  });

  it("is detached from the document until inserted by the caller", () => {
    createLightrope();

    expect(document.querySelector("ul.lightrope")).toBeNull();
  });

  it("builds an independent element on every call", () => {
    const first = createLightrope();
    const second = createLightrope();

    expect(first).not.toBe(second);

    first.appendChild(document.createElement("li"));
    expect(second.querySelectorAll("li").length).toBe(LIGHT_COUNT);
  });
});
