import { describe, expect, it, afterEach, vi } from "vitest";

import { detectLanguage } from "./language";

describe("detectLanguage", () => {
  afterEach(() => {
    document.documentElement.lang = "";
    vi.unstubAllGlobals();
  });

  it("returns a supported language when argument matches", () => {
    expect(detectLanguage("en")).toBe("en");
    expect(detectLanguage("fi")).toBe("fi");
  });

  it("extracts first two characters from language code", () => {
    expect(detectLanguage("en-US")).toBe("en");
    expect(detectLanguage("fi-FI")).toBe("fi");
  });

  it("falls back to document.lang when no argument", () => {
    document.documentElement.lang = "en";
    expect(detectLanguage()).toBe("en");
  });

  it("falls back to navigator.languages", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: ["fi-FI", "en-US"], language: "" });
    expect(detectLanguage()).toBe("fi");
  });

  it("falls back to navigator.language", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: [], language: "en-GB" });
    expect(detectLanguage()).toBe("en");
  });

  it("returns defaultLang for unsupported languages", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: ["zh-CN"], language: "zh-CN" });
    expect(detectLanguage()).toBe("fi");
  });

  it("returns defaultLang when everything is empty", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: [], language: "" });
    expect(detectLanguage()).toBe("fi");
  });

  it("prioritizes argument over document and navigator", () => {
    document.documentElement.lang = "en";
    vi.stubGlobal("navigator", { languages: ["fi-FI"], language: "fi" });
    expect(detectLanguage("en")).toBe("en");
  });

  it("case-insensitive matching", () => {
    expect(detectLanguage("EN")).toBe("en");
    expect(detectLanguage("FI")).toBe("fi");
    expect(detectLanguage("En")).toBe("en");
    expect(detectLanguage("fI")).toBe("fi");
  });

  it("accepts three-letter codes by slicing the first two characters", () => {
    expect(detectLanguage("eng")).toBe("en");
    expect(detectLanguage("fi-fi")).toBe("fi");
  });

  it("matches case-insensitively on document.lang", () => {
    document.documentElement.lang = "EN-US";
    expect(detectLanguage()).toBe("en");
  });

  it("falls back to document/navigator when the argument is an empty string", () => {
    document.documentElement.lang = "fi";
    vi.stubGlobal("navigator", { languages: [], language: "en" });
    expect(detectLanguage("")).toBe("fi");
  });

  it("skips an undefined navigator.language", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: [], language: undefined });
    expect(detectLanguage()).toBe("fi");
  });

  it("continues past unsupported languages to the next supported one", () => {
    document.documentElement.lang = "";
    vi.stubGlobal("navigator", { languages: ["zh-CN", "de", "EN-GB"], language: "" });
    expect(detectLanguage()).toBe("en");
  });
});
