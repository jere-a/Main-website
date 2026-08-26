import { afterEach, describe, expect, it } from "vitest";

import { prependToBody } from "./dom";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("prependToBody", () => {
  it("inserts the element as the first child of body", () => {
    const existing = document.createElement("main");
    document.body.appendChild(existing);

    const element = document.createElement("ul");
    prependToBody(element);

    expect(document.body.firstChild).toBe(element);
    expect(document.body.children.length).toBe(2);
  });

  it("works on an empty body", () => {
    const element = document.createElement("div");
    prependToBody(element);

    expect(document.body.firstChild).toBe(element);
    expect(document.body.childElementCount).toBe(1);
  });
});
