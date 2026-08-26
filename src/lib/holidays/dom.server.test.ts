import { describe, expect, it, vi } from "vitest";

describe("prependToBody server guard", () => {
  it("is a no-op without a document", async () => {
    vi.stubGlobal("document", undefined);

    try {
      const { prependToBody: fresh } = await import("./dom");

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- stub element, guard returns before use
      expect(() => fresh({ tagName: "DIV" } as HTMLElement)).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
