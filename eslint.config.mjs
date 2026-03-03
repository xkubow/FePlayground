// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default [
    js.configs.recommended,

    // Vue flat configs
    ...vue.configs["flat/recommended"],

    // TypeScript flat configs
    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",

                // 1) Functions + variables: camelCase by default
                {
                    selector: ["variableLike", "function"],
                    format: ["camelCase"]
                },

                // 2) Allow UPPER_CASE for constants (but don't force it for exported const)
                //    This fixes your `export const props = {}` problem.
                {
                    selector: "variable",
                    modifiers: ["const"],
                    format: ["camelCase", "UPPER_CASE"]
                },

                // 3) Classes / types / enums: PascalCase
                { selector: "class", format: ["PascalCase"] },
                { selector: "typeAlias", format: ["PascalCase"] },
                { selector: "enum", format: ["PascalCase"] },

                // 4) Interfaces: PascalCase + I-prefix (your preference)
                {
                    selector: "interface",
                    format: ["PascalCase"],
                    custom: { regex: "^I[A-Z]", match: true }
                },

                // 5) Vue SFC imports are often PascalCase (UserCard, BaseButton)
                //    If you import components as variables, they would violate camelCase unless we allow this.
                {
                    selector: "variable",
                    format: ["camelCase", "PascalCase"]
                },

                // 6) Optional: object properties usually match API fields; don't enforce here
                //    (prevents breaking DTOs like { consumer_id: ... } or backend-provided keys)
                {
                    selector: "property",
                    format: null
                },

                // 7) Optional: allow quoted properties ({"some-key": 1}) without complaints
                {
                    selector: "objectLiteralProperty",
                    modifiers: ["requiresQuotes"],
                    format: null
                }
            ]
        }
    }
];