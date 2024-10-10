module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        // Customize your rules here
        'quotes': ['error', 'single'],
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
