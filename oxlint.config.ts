import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },

  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },

  rules: {
    // General
    eqeqeq: ["error", "smart"],
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-underscore-dangle": [
      "warn",
      {
        allow: ["__posthog_initialized", "__WB_MANIFEST", "_altfunc"],
      },
    ],

    // TypeScript
    "typescript/await-thenable": "error",
    "typescript/ban-ts-comment": [
      "warn",
      {
        "ts-expect-error": "allow-with-description",
      },
    ],
    "typescript/consistent-type-imports": "error",
    "typescript/no-explicit-any": "warn",
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
    "typescript/no-unnecessary-condition": "warn",
    "typescript/only-throw-error": "error",
    "typescript/prefer-as-const": "error",
    "typescript/prefer-nullish-coalescing": "warn",
    "typescript/prefer-optional-chain": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/restrict-template-expressions": "warn",
    "typescript/switch-exhaustiveness-check": "error",

    // Unicorn
    "unicorn/consistent-existence-index-check": "warn",
    "unicorn/prefer-at": "warn",
    "unicorn/prefer-optional-catch-binding": "error",
    "unicorn/prefer-spread": "error",
    "unicorn/throw-new-error": "error",

    // OXC
    "oxc/branches-sharing-code": "warn",
    "oxc/const-comparisons": "error",
    "oxc/double-comparisons": "warn",

    // Import
    "import/no-duplicates": "error",

    // Promise
    "promise/no-return-wrap": "warn",
    "promise/prefer-await-to-then": "warn",

    // React
    "react/jsx-key": "error",
    "react/no-unknown-property": "error",
    "react/react-in-jsx-scope": "off",

    // Accessibility
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "warn",

    // Vitest
    "vitest/expect-expect": "warn",
    "vitest/no-identical-title": "error",
  },

  plugins: [
    "eslint",
    "typescript",
    "unicorn",
    "react",
    "oxc",
    "promise",
    "import",
    "vitest",
    "jsx-a11y",
  ],
});
