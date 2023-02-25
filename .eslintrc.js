module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'max-len': 'off',
    'no-use-before-define': 'error',
    'comma-dangle': 'off',
    'import/no-dynamic-require': 'off',
    'no-await-in-loop': 'off',
    'arrow-parens': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-new-func': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'no-unneeded-ternary': 'off',
    'arrow-body-style': 'off',
    'import/newline-after-import': 'off',
    'newline-per-chained-call': 'off',
    indent: 'off',
    radix: 'off',
    camelcase: 'warn'
  }
};
