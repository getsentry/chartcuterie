module.exports = {
  env: {node: true},
  extends: ['sentry-app/strict'],
  globals: {
    jest: true,
  },

  rules: {
    'import/no-nodejs-modules': 'off',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
  ],
};
