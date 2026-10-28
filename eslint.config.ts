import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginStart from "@tanstack/eslint-plugin-start";
import { defineConfig, globalIgnores, type Config } from "eslint/config";
import love from "eslint-config-love";
import prettier from "eslint-config-prettier/flat";
import jestDom from "eslint-plugin-jest-dom";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";

// eslint-config-love is typed against @typescript-eslint's config shape, which differs from ESLint's own.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const loveConfig = love as Config;

export default defineConfig([
  {
    ...loveConfig,
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...loveConfig.rules,
      complexity: "off",
      "@eslint-community/eslint-comments/no-unlimited-disable": "off",
      "@eslint-community/eslint-comments/require-description": "off",
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "interface", format: ["PascalCase"] },
        { selector: "typeAlias", format: ["PascalCase"] },
        { selector: "enum", format: ["PascalCase"] },
        { selector: "enumMember", format: ["UPPER_CASE"] },
      ],
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            "{}": {
              message: "Use Record<string, unknown> instead",
              fixWith: "Record<string, unknown>",
            },
            object: {
              message: "Use Record<string, unknown> instead",
              fixWith: "Record<string, unknown>",
            },
            Function: { message: "Use a specific function type like () => void" },
          },
        },
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "after-used", ignoreRestSiblings: false, argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true },
      ],
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            { from: "package", package: "@tanstack/router-core", name: "Redirect" },
            { from: "package", package: "@tanstack/router-core", name: "NotFoundError" },
          ],
        },
      ],
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [{ pattern: "~/**", group: "external", position: "after" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-negated-condition": "off",
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      // The `v` flag needs Safari 17+; older Safari fails at runtime with "Invalid flags supplied to RegExp constructor".
      "require-unicode-regexp": ["error", { requireFlag: "u" }],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "jsx-a11y/no-autofocus": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: { react: { version: "detect" } },
    ...reactPlugin.configs.flat["recommended"],
    rules: {
      ...reactPlugin.configs.flat["recommended"]?.rules,
      "react/jsx-sort-props": [
        "warn",
        { callbacksLast: true, reservedFirst: true, shorthandFirst: true },
      ],
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "error",
      "react/no-children-prop": ["error", { allowFunctions: true }],
    },
  },
  reactPlugin.configs.flat["jsx-runtime"] ?? {},
  reactHooks.configs.flat["recommended-latest"],
  pluginRouter.configs["flat/recommended"],
  pluginStart.configs["flat/recommended"],
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    ...testingLibrary.configs["flat/react"],
    ...jestDom.configs["flat/recommended"],
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    rules: {
      "max-lines": "off",
      "max-nested-callbacks": "off",
    },
  },
  prettier,
  globalIgnores([".output", ".tanstack", ".vercel", "coverage", "src/routeTree.gen.ts"]),
]);
