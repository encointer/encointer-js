const config = require('./jest.config.cjs');

module.exports = {
  ... config,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(e2e).[jt]s?(x)'],
}
