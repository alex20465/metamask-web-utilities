const { TS_CONFIG } = process.env;

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',

        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: [],
    rules: {},
    settings: {
        react: {
            version: 'detect',
        },
        "import/resolver": {
            "typescript": {}
        }
    },
    parserOptions: {
        project: TS_CONFIG,
        ecmaVersion: 2018,
        sourceType: 'module',
    },
};
