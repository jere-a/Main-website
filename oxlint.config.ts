import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  plugins: ["import", "vitest"],
});
