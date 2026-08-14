import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";

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
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.append(root);
  });

  afterEach(() => {
    root.remove();
  });

  describe("direct events", () => {
    it("calls the handler for an event", () => {
      const handler = vi.fn();

      on(root, "click", handler);

      root.click();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.contexts[0]).toBe(root);
    });

    it("supports multiple events", () => {
      const handler = vi.fn();

      on(root, ["click", "dblclick"], handler);

      root.click();
      root.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("does not call the handler for other events", () => {
      const handler = vi.fn();

      on(root, "click", handler);

      root.dispatchEvent(new Event("input"));

      expect(handler).not.toHaveBeenCalled();
    });

    it("can unsubscribe", () => {
      const handler = vi.fn();

      const off = on(root, "click", handler);

      off();

      root.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it("can unsubscribe from multiple events at once", () => {
      const handler = vi.fn();

      const off = on(root, ["click", "dblclick"], handler);

      off();

      root.click();
      root.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("delegation", () => {
    it("calls the handler when the target matches the selector", () => {
      const button = document.createElement("button");
      root.append(button);

      const handler = vi.fn();

      on(root, "click", handler, "button");

      button.click();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.contexts[0]).toBe(button);
    });

    it("uses the closest matching ancestor", () => {
      const button = document.createElement("button");
      const span = document.createElement("span");

      button.append(span);
      root.append(button);

      const handler = vi.fn();

      on(root, "click", handler, "button");

      span.click();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.contexts[0]).toBe(button);
    });

    it("does not call the handler when nothing matches", () => {
      const div = document.createElement("div");
      root.append(div);

      const handler = vi.fn();

      on(root, "click", handler, "button");

      div.click();

      expect(handler).not.toHaveBeenCalled();
    });

    it("supports multiple delegated handlers for the same event", () => {
      const button = document.createElement("button");
      const link = document.createElement("a");

      root.append(button, link);

      const buttonHandler = vi.fn();
      const linkHandler = vi.fn();

      on(root, "click", buttonHandler, "button");
      on(root, "click", linkHandler, "a");

      button.click();
      link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(buttonHandler).toHaveBeenCalledOnce();
      expect(linkHandler).toHaveBeenCalledOnce();
    });

    it("only invokes handlers whose selectors match", () => {
      const button = document.createElement("button");
      root.append(button);

      const buttonHandler = vi.fn();
      const linkHandler = vi.fn();

      on(root, "click", buttonHandler, "button");
      on(root, "click", linkHandler, "a");

      button.click();

      expect(buttonHandler).toHaveBeenCalledOnce();
      expect(linkHandler).not.toHaveBeenCalled();
    });

    it("does not handle events originating outside the bound element", () => {
      const outsideButton = document.createElement("button");
      document.body.append(outsideButton);

      const handler = vi.fn();

      on(root, "click", handler, "button");

      outsideButton.click();

      expect(handler).not.toHaveBeenCalled();

      outsideButton.remove();
    });
  });

  describe("multiple registrations", () => {
    it("allows the same handler to be registered multiple times", () => {
      const handler = vi.fn();

      on(root, "click", handler);
      on(root, "click", handler);

      root.click();

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("unsubscribing one registration keeps the other", () => {
      const handler = vi.fn();

      const off1 = on(root, "click", handler);
      on(root, "click", handler);

      off1();

      root.click();

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  describe("document-level delegation", () => {
    it("uses only one document listener for the same event", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");

      const first = vi.fn();
      const second = vi.fn();

      on(document, "click", first, "button");
      on(document, "click", second, ".link");

      const clickListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "click",
      );

      expect(clickListeners).toHaveLength(1);
    });

    it("shares one document listener between different selectors", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");

      on(document, "click", vi.fn(), "button");
      on(document, "click", vi.fn(), "a");
      on(document, "click", vi.fn(), ".item");

      const clickListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "click",
      );

      expect(clickListeners).toHaveLength(1);
    });

    it("shares one listener when different functions register the same event", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");

      const first = (): void => {};
      const second = (): void => {};

      on(document, "click", first);
      on(document, "click", second);

      const clickListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "click",
      );

      expect(clickListeners).toHaveLength(1);
    });

    it("uses separate listeners for different event types", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");

      on(document, "click", vi.fn());
      on(document, "input", vi.fn());

      const clickListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "click",
      );

      const inputListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "input",
      );

      expect(clickListeners).toHaveLength(1);
      expect(inputListeners).toHaveLength(1);
    });

    it("dispatches an event to all matching handlers", () => {
      const button = document.createElement("button");
      root.append(button);

      const first = vi.fn();
      const second = vi.fn();

      on(document, "click", first, "button");
      on(document, "click", second, "button");

      button.click();

      expect(first).toHaveBeenCalledOnce();
      expect(second).toHaveBeenCalledOnce();
    });

    it("removes the document listener when the last registration is removed", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");
      const removeEventListener = vi.spyOn(document, "removeEventListener");

      const off = on(document, "click", vi.fn(), "button");

      expect(
        addEventListener.mock.calls.filter(([eventName]) => eventName === "click"),
      ).toHaveLength(1);

      off();

      expect(
        removeEventListener.mock.calls.filter(([eventName]) => eventName === "click"),
      ).toHaveLength(1);
    });

    it("does not remove the shared listener while registrations remain", () => {
      const removeEventListener = vi.spyOn(document, "removeEventListener");

      const off1 = on(document, "click", vi.fn(), "button");
      on(document, "click", vi.fn(), "a");

      off1();

      expect(
        removeEventListener.mock.calls.filter(([eventName]) => eventName === "click"),
      ).toHaveLength(0);
    });
  });

  describe("event arrays", () => {
    it("registers every event in the array", () => {
      const handler = vi.fn();

      on(root, ["click", "mousedown", "mouseup"], handler);

      root.click();
      root.dispatchEvent(new MouseEvent("mousedown"));
      root.dispatchEvent(new MouseEvent("mouseup"));

      expect(handler).toHaveBeenCalledTimes(3);
    });

    it("supports arrays with delegation", () => {
      const button = document.createElement("button");
      root.append(button);

      const handler = vi.fn();

      on(root, ["click", "mousedown"], handler, "button");

      button.click();
      button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.contexts[0]).toBe(button);
      expect(handler.mock.contexts[1]).toBe(button);
    });

    it("does not register duplicate event names twice", () => {
      const addEventListener = vi.spyOn(document, "addEventListener");

      on(document, ["click", "click", "click"], vi.fn());

      const clickListeners = addEventListener.mock.calls.filter(
        ([eventName]) => eventName === "click",
      );

      expect(clickListeners).toHaveLength(1);
    });
  });

  describe("handler arguments", () => {
    it("passes the original event", () => {
      const handler = vi.fn();

      on(root, "click", handler);

      const event = new MouseEvent("click");

      root.dispatchEvent(event);

      expect(handler).toHaveBeenCalledWith(event);
    });

    it("preserves the original event target", () => {
      const button = document.createElement("button");
      root.append(button);

      const handler = vi.fn();

      on(root, "click", handler, "button");

      const event = new MouseEvent("click", {
        bubbles: true,
      });

      button.dispatchEvent(event);

      expect(handler.mock.calls[0]?.[0]).toBe(event);
      expect(event.target).toBe(button);
    });
  });
});
