// eslint.config.mjs
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [// Base JS recommendations
js.configs.recommended, // Vue rules (flat)
...vue.configs["flat/essential"], // TypeScript rules (flat)
...tseslint.configs.recommended, {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node
        }
    }
}, // ✅ Important: parse .vue files correctly
{
    files: ["**/*.vue"],
    languageOptions: {
        parser: vueParser,
        parserOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
            extraFileExtensions: [".vue"]
        }
    }
}, // Your rules + naming convention
{
    files: ["**/*.{ts,tsx,vue}"],
    rules: {
        // keep your older behavior
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

        quotes: ["error", "single"],
        semi: ["error", "always"],

        // ✅ naming rules (Vue-friendly, no invalid format:null, no imported modifier)
        "@typescript-eslint/naming-convention": [
            "error",

            { selector: "function", format: ["camelCase"] },

            // allow PascalCase for Vue component imports + UPPER_CASE constants
            { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"] },

            // consts can be camelCase or UPPER_CASE
            { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },

            { selector: "class", format: ["PascalCase"] },
            { selector: "typeAlias", format: ["PascalCase"] },
            { selector: "enum", format: ["PascalCase"] },

            {
                selector: "interface",
                format: ["PascalCase"],
                custom: { regex: "^I[A-Z]", match: true }
            }

            // Note: no property rules => we don't fight DTO / API keys
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }
        ]
    }
}, // Cypress override (flat config style)
{
    files: ["cypress/integration/**.spec.{js,ts,jsx,tsx}"],
    // If you use Cypress plugin in flat config, we can add it here later.
    rules: {}
}];