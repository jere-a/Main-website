import { describe, expect, it, vi } from "vitest";

describe("prependToBody server guard", () => {
  it("is a no-op without a document", async () => {
    vi.stubGlobal("document", undefined);

    try {
      const { prependToBody: fresh } = await import("./dom");

      const element = { tagName: "DIV" } as unknown as HTMLElement;

      expect(() => fresh(element)).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
