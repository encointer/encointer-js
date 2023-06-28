//const config = require('@polkadot/dev/config/jest.cjs');


// Copyright 2017-2022 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    'ts',
    'tsx'
  ],
  modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/build-tsc-cjs', '<rootDir>/build-tsc-ems', '<rootDir>/build-tsc-js'].concat(
    fs
      .readdirSync('packages')
      .filter((p) => fs.statSync(`packages/${p}`).isDirectory())
      .map((p) => `<rootDir>/packages/${p}/build`)
  ),
  // See https://jestjs.io/docs/configuration#extraglobals-arraystring
  sandboxInjectedGlobals: ['Math'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest')
  // },



  "preset": "ts-jest",
  "testEnvironment": "node",
  "transform": {
    "node_modules/variables/.+\\.(j|t)sx?$": ['ts-jest', { tsconfig: './tsconfig.jest.json', useESM: true }],
    '\\.[jt]sx?$': ['ts-jest', { tsconfig: './tsconfig.jest.json', useESM: true }],
    '.ts': ['ts-jest', { tsconfig: './tsconfig.jest.json', useESM: true }],
  },
  "transformIgnorePatterns": [
    "node_modules/(?!variables/.*)"
  ],
extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    // 'bn.js': 'bn.js',
    // '(.+)\\.js': '$1',
    '@encointer/node-api(.*)$': '<rootDir>/packages/node-api/src/$1',
    '@encointer/worker-api(.*)$': '<rootDir>/packages/worker-api/src/$1',
    '@encointer/util(.*)$': '<rootDir>/packages/util/src/$1',
    '@encointer/types(.*)$': '<rootDir>/packages/types/src/$1'
  },
  "resolver": "jest-ts-webcompat-resolver"
};