module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['react-app', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'react'],
    rules: {
        // ...
        'react-hooks/rules-of-hooks': 'off' / 0, // tried each
        'react-hooks/exhaustive-deps': 'off' / 0, // tried each
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            rules: {
                'react-hooks/rules-of-hooks': 'off' / 0, // tried each
                'react-hooks/exhaustive-deps': 'off' / 0, // tried each
            },
        },
    ],
}
