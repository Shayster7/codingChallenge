const tseslint = require("typescript-eslint");
const jest = require("eslint-plugin-jest");
const eslintConfigPrettier = require("eslint-config-prettier");
const globals = require("globals");

module.exports = [
  // Global ignores
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },

  // Base TypeScript configuration
  ...tseslint.configs.recommended,

  // Jest configuration for test files
  {
    files: ["**/tests/**/*.ts", "**/*.test.ts"],
    ...jest.configs["flat/recommended"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Node.js globals
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Prettier configuration to disable conflicting rules (must be last)
  eslintConfigPrettier,
];
