import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  rules: {
    "no-console": "error",
    "unicorn/escape-case": "warn",
  },
  plugins: ["eslint", "typescript", "unicorn", "react", "oxc", "promise", "import", "vitest"],
});
