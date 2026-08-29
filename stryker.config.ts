import type { PartialStrykerOptions } from "@stryker-mutator/api/core";

const config: PartialStrykerOptions = {
  plugins: ["@stryker-mutator/vitest-runner", "@stryker-mutator/typescript-checker"],
  testRunner: "vitest",
  reporters: ["clear-text", "html"],
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  vitest: {
    configFile: "vitest.config.ts",
  },
  coverageAnalysis: "perTest",
  mutate: [
    "src/lib/**/*.{ts,tsx,mts,cts,js,mjs}",
    "src/i18n/**/*.{ts,tsx,mts,cts,js,mjs}",
    "src/config.ts",
    "src/configFeatures.ts",
    "!src/**/*.test.*",
    "!src/**/*.spec.*",
    "!src/**/__tests__/**",
  ],
  ignorePatterns: ["src/**/*.d.ts", "src/types/**", "dist/**", ".astro/**", "node_modules/**"],
  ignoreStatic: true,
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
  htmlReporter: {
    fileName: "reports/mutation-report.html",
  },
};

export default config;
