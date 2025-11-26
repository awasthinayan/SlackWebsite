import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": "off", // 👈 TURN OFF UNUSED VAR ERRORS
      "no-undef": "off", // (Optional) turn off process undefined errors
    },
  },
]);
