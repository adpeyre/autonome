module.exports = {
    parser:  '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'airbnb-base',
        "plugin:@typescript-eslint/eslint-recommended",
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'import/extensions': ['error', {
            'ts': 'never',
            'json': 'always'
        }],
        'class-methods-use-this': 'off',
        'no-restricted-syntax': 'off',
        'quotes': 'error',
        'semi': 'error',
        'comma-dangle': ['error', {
            'arrays': 'only-multiline',
        }],
        'max-len': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-inferrable-types': ['error', {
            "ignoreParameters": true,
            "ignoreProperties": true,
        }],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'import/order': [
            'error',
            {
                "newlines-between": 'always',
                'groups': [['builtin', 'external',], ['internal', 'parent', 'sibling', 'index']]
            },
        ],
        'yoda': ['error', 'always', { "onlyEquality": true }],
    },
    env: {
        browser: true,
    },
    settings: {
        'import/resolver': 'webpack',
    },
    parserOptions:  {
        ecmaVersion:  2020,
        sourceType:  'module',
    },
};