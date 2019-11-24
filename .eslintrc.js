module.exports = {
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx", ".d.ts"]
            }
        }
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'airbnb-base',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    rules: {
        "indent": "off",
        "@typescript-eslint/indent": ["error", 2],
        "class-methods-use-this": "off",
        "object-shorthand": ["error", "properties"],
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "ignore"
        }],
        "prefer-destructuring": "off",
        "no-unused-expressions": "off",
        "no-restricted-syntax": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-empty-function": "off",
        '@typescript-eslint/no-inferrable-types': "off"
    },
};
