const config = require('@polkadot/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@encointer/node-api(.*)$': '<rootDir>/packages/node-api/src/$1',
    '@encointer/worker-api(.*)$': '<rootDir>/packages/worker-api/src/$1',
    '@encointer/util(.*)$': '<rootDir>/packages/util/src/$1',
    '@encointer/types(.*)$': '<rootDir>/packages/types/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/packages/node-api/build',
    '<rootDir>/packages/worker-api/build',
    '<rootDir>/packages/util/build',
    '<rootDir>/packages/types/build'
  ],
});
