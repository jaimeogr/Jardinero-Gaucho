import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js"; // Ensure this is correctly imported or defined

export default [
  js.configs.recommended,
  react.configs.recommended,
  typescriptPlugin.configs.recommended,
  prettier, // Ensure Prettier is last to prevent rule conflicts
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      tseslint: typescriptPlugin,
      react: react,
      import: importPlugin,
      jsxa11y: jsxA11y,
      reacthooks: reactHooks,
    },
    rules: {
      "tseslint/no-unused-vars": ["warn"],
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external", "internal"]],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          'newlines-between': "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "reacthooks/rules-of-hooks": "error",
      "reacthooks/exhaustive-deps": "warn",
      "jsxa11y/anchor-is-valid": [
        "warn",
        {
          aspects: ["invalidHref", "preferButton"],
        },
      ],
    },
  },
];