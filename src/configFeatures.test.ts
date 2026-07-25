import { describe, expect, it } from "vitest";
import { siteFeatures } from "./configFeatures";
import { siteConfig } from "./config";

describe("siteFeatures", () => {
  it("contains the siteConfig", () => {
    expect(siteFeatures.config).toBe(siteConfig);
  });

  it("has params.functions with boolean flags", () => {
    expect(typeof siteFeatures.params.functions.holidayEffects).toBe("boolean");
    expect(typeof siteFeatures.params.functions.howOldSite).toBe("boolean");
    expect(typeof siteFeatures.params.functions.fetchIPP).toBe("boolean");
    expect(typeof siteFeatures.params.functions.splashcursor).toBe("boolean");
  });

  it("all feature flags default to true", () => {
    expect(siteFeatures.params.functions.holidayEffects).toBe(true);
    expect(siteFeatures.params.functions.howOldSite).toBe(true);
    expect(siteFeatures.params.functions.fetchIPP).toBe(true);
    expect(siteFeatures.params.functions.splashcursor).toBe(true);
  });

  it("config.host matches siteConfig.host", () => {
    expect(siteFeatures.config.host).toBe(siteConfig.host);
  });
});
