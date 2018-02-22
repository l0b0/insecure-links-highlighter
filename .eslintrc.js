module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: 'eslint:recommended',
    globals: {
        browser: true,
        defaultOptions: true,
    },
    rules: {
        indent: [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ]
    }
};
