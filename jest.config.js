module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests//**/*(*.)@(spec|test).ts'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
  },
  globals: {
    'ts-jest': {tsconfig: 'tests/tsconfig.json'},
  },
};
