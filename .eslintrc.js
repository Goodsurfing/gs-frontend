const PRIVATE_IMPORT_MESSAGE = "Private imports are prohibited, use public imports instead";
const ABSOLUTE_IMPORT_MESSAGE = "Prefer absolute imports instead of relatives (for root modules)";

module.exports = {
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:i18next/recommended",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:boundaries/recommended",
  ],
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
    },
    "boundaries/elements": [
      { type: "app", pattern: "app/*" },
      { type: "pages", pattern: "pages/*" },
      { type: "widgets", pattern: "widgets/*" },
      { type: "features", pattern: "features/*" },
      { type: "entities", pattern: "entities/*" },
      { type: "shared", pattern: "shared/*" },
    ],
    "boundaries/ignore": ["**/*.test.*"],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "i18next", "react-hooks"],
  rules: {
    quotes: ["error", "double"],
    "max-len": ["error", {
      ignoreTrailingComments: true,
      ignoreUrls: true,
      comments: 150,
      tabWidth: 2,
      code: 110,
    }],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
        pathGroups: [
          { group: "internal", position: "after", pattern: "pages/**" },
          { group: "internal", position: "after", pattern: "widgets/**" },
          { group: "internal", position: "after", pattern: "features/**" },
          { group: "internal", position: "after", pattern: "entities/**" },
          { group: "internal", position: "after", pattern: "shared/**" },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      },
    ],
    "import/no-cycle": [2, { maxDepth: 2 }],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["app/*/**"],
          },
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["pages/*/**"],
          },
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["widgets/*/**"],
          },
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["features/*/**"],
          },
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["entities/*/**"],
          },
          {
            message: PRIVATE_IMPORT_MESSAGE,
            group: ["shared/*/*/**"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/app"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/pages"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/widgets"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/features"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/entities"],
          },
          {
            message: ABSOLUTE_IMPORT_MESSAGE,
            group: ["../**/shared"],
          },
        ],
      },
    ],
    "boundaries/element-types": [
      "warn",
      {
        default: "disallow",
        rules: [
          {
            from: "app",
            allow: ["pages", "widgets", "features", "entities", "shared"],
          },
          {
            from: "pages",
            allow: ["widgets", "features", "entities", "shared"],
          },
          {
            from: "widgets",
            allow: ["features", "entities", "shared"],
          },
          {
            from: "features",
            allow: ["entities", "shared"],
          },
          {
            from: "entities",
            allow: ["shared"],
          },
          {
            from: "shared",
            allow: ["shared"],
          },
        ],
      },
    ],
    "react/jsx-indent": [2, 4],
    "react/jsx-indent-props": [2, 4],
    "react/jsx-filename-extension": [2, {
      extensions: [".js", ".jsx", ".tsx"],
    }],
    "import/no-unresolved": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "import/prefer-default-export": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react/require-default-props": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "warn",
    "react/function-component-definition": "off",
    "no-shadow": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "linebreak-style": ["error", "windows"],
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "i18next/no-literal-string": ["error", {
      markupOnly: true,
      ignoreAttribute: ["data-testid", "to"],
    }],
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "no-param-reassign": "off",
  },
  globals: {
    __IS_DEV__: true,
  },
  overrides: [{
    files: ["**/src/**/*.test.{ts,tsx}"],
    rules: {
      "i18next/no-literal-string": "off",
    },
  }],
};
