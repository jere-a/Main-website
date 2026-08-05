import { describe, expect, it } from "vitest";

import { siteConfig } from "./config";
import { siteFeatures } from "./configFeatures";

describe("siteFeatures", () => {
  it("contains the siteConfig", () => {
    expect(siteFeatures.config).toBe(siteConfig);
  });

  it.each([
    ["holidayEffects", true],
    ["howOldSite", true],
    ["fetchIPP", true],
  ] as const)("%s is a boolean flag enabled by default", (flag, expected) => {
    expect(siteFeatures.params.functions[flag]).toBe(expected);
  });

  it("config.host matches siteConfig.host", () => {
    expect(siteFeatures.config.host).toBe(siteConfig.host);
  });
});
