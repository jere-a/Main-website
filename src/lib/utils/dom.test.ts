import { describe, expect, it, vi, afterEach } from "vitest";

import { injectCSS, addCSSFromURL, on } from "./dom";

describe("injectCSS", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("creates a style element with the given CSS text", () => {
    const style = injectCSS("body { color: red; }");
    expect(style.tagName).toBe("STYLE");
    expect(style.textContent).toBe("body { color: red; }");
  });

  it("appends the style element to document.head", () => {
    const before = document.head.children.length;
    injectCSS("h1 { font-size: 2rem; }");
    expect(document.head.children.length).toBe(before + 1);
  });

  it("returns the created style element", () => {
    const el = injectCSS(".a { }");
    expect(el).toBeInstanceOf(HTMLStyleElement);
    expect(document.head.contains(el)).toBe(true);
  });

  it("handles empty CSS string", () => {
    const el = injectCSS("");
    expect(el.textContent).toBe("");
  });

  it("handles complex CSS with selectors and media queries", () => {
    const css = `@media (min-width: 768px) { .container { max-width: 1200px; } }`;
    const el = injectCSS(css);
    expect(el.textContent).toBe(css);
  });
});

describe("addCSSFromURL", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("creates a link element with correct attributes", () => {
    addCSSFromURL("https://example.com/style.css");
    const link = document.head.querySelector("link");
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href).toBe("https://example.com/style.css");
  });

  it("appends the link to document.head", () => {
    const before = document.head.children.length;
    addCSSFromURL("https://example.com/a.css");
    expect(document.head.children.length).toBe(before + 1);
  });

  it("handles relative URLs", () => {
    addCSSFromURL("/styles/main.css");
    const link = document.head.querySelector("link");
    expect(link!.getAttribute("href")).toBe("/styles/main.css");
  });
});

describe("on", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("attaches an event listener and fires handler", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const handler = vi.fn();

    on(div, "click", handler);

    div.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("returns the wrapped handler for removal", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const handler = vi.fn();

    const wrapped = on(div, "click", handler);
    div.removeEventListener("click", wrapped as EventListener);

    div.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("with selector: fires only when target matches", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    document.body.appendChild(parent);

    const handler = vi.fn();
    on(parent, "click", handler, "span");

    child.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("with selector: does not fire when target does not match", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    document.body.appendChild(parent);

    const handler = vi.fn();
    on(parent, "click", handler, "button");

    child.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });
});
