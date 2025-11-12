import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        ignores: ["node_modules", "dist", "build", "src/dev", "test"],
    },
    js.configs.recommended,
    {
        plugins: {
            import: importPlugin,
            promise: promisePlugin,
            security: securityPlugin,
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "writeable",
            },
        },
        rules: {
            "no-var": "error",
            "prefer-const": "error",
            eqeqeq: ["error", "always"],
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-undef-init": "error",

            "import/order": [
                "error",
                {
                    groups: [
                        ["builtin", "external", "internal"],
                        ["parent", "sibling", "index"],
                    ],
                    "newlines-between": "always",
                },
            ],
            "import/newline-after-import": "error",

            "promise/no-nesting": "warn",
            "promise/prefer-await-to-then": "warn",

            "security/detect-eval-with-expression": "error",

            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    trailingComma: "es5",
                    semi: true,
                    printWidth: 100,
                    tabWidth: 4,
                    endOfLine: "auto",
                },
            ],

            "no-restricted-syntax": [
                "error",
                {
                    selector: "LineComment",
                    message: "Comments are not allowed",
                },
                {
                    selector: "BlockComment",
                    message: "Comments are not allowed",
                },
            ],
        },
    },
];
