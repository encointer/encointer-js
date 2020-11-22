const config = require('@polkadot/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@encointer/worker-api(.*)$': '<rootDir>/packages/worker-api/src/$1',
    '@encointer/util(.*)$': '<rootDir>/packages/util/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/packages/worker-api/build',
    '<rootDir>/packages/util/build'
  ],
  resolver: '@polkadot/dev/config/jest-resolver.cjs'
});
