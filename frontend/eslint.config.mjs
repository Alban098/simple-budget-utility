import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { pluginReact },
  },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
  },
  { ignores: ["node_modules/*", "dist/*"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];
