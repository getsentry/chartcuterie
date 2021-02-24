module.exports = {
  env: {node: true},
  extends: ['sentry-app/strict'],
  globals: {
    require: false,
    expect: false,
    sinon: false,
    MockApiClient: true,
    TestStubs: true,
    tick: true,
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
