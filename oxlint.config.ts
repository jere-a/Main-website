import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "vitest"],
});
