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
    const handler = vi.fn<(event: Event) => void>();

    on(div, "click", handler);

    div.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("passes the event to the handler", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const handler = vi.fn<(this: Element, event: Event) => void>();

    on(div, "click", handler);

    const event = new Event("click", { bubbles: true });
    div.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("calls the handler with the element as this", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const handler = vi.fn<(this: Element, event: Event) => void>();

    on(div, "click", handler);

    div.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler.mock.instances[0]).toBe(div);
  });

  it("returns the wrapped handler for removal", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const handler = vi.fn<(event: Event) => void>();

    const wrapped = on(div, "click", handler);
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    div.removeEventListener("click", wrapped as EventListener);

    div.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("with selector: fires only when target matches", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    document.body.appendChild(parent);

    const handler = vi.fn<(this: Element, event: Event) => void>();
    on(parent, "click", handler, "span");

    child.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.instances[0]).toBe(child);
  });

  it("with selector: matches deeply nested descendants", () => {
    const parent = document.createElement("div");
    const inner = document.createElement("p");
    const child = document.createElement("span");
    inner.appendChild(child);
    parent.appendChild(inner);
    document.body.appendChild(parent);

    const handler = vi.fn<(this: Element, event: Event) => void>();
    on(parent, "click", handler, "p span");

    child.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.instances[0]).toBe(child);
  });

  it("with selector: does not fire when target does not match", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    document.body.appendChild(parent);

    const handler = vi.fn<(event: Event) => void>();
    on(parent, "click", handler, "button");

    child.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("with selector: calls handler on the element when target is not an Element", () => {
    const div = document.createElement("div");
    const handler = vi.fn<(event: Event) => void>();

    const wrapped = on(div, "click", handler, "span");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    wrapped({ target: null } as unknown as Parameters<typeof wrapped>[0]);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.instances[0]).toBe(div);
  });
});
