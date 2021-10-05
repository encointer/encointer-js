const config = require('./jest.config.js');

module.exports = {
  ... config,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(e2e).[jt]s?(x)'],
}
