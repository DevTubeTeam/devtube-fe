module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:tailwindcss/recommended',
        'prettier', // kết hợp với prettier
    ],
    plugins: ['react', 'tailwindcss', 'simple-import-sort'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'tailwindcss/classnames-order': 'warn',
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
