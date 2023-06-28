//const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  //...config,
  moduleNameMapper: {
    '@encointer/node-api(.*)$': '<rootDir>/packages/node-api/src/$1',
    '@encointer/worker-api(.*)$': '<rootDir>/packages/worker-api/src/$1',
    '@encointer/util(.*)$': '<rootDir>/packages/util/src/$1',
    '@encointer/types(.*)$': '<rootDir>/packages/types/src/$1'
  },
};
