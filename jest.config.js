const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'server/**/*.ts'],
  verbose: true,
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['/node_modules/', '/.c9/metadata/'],
  testPathIgnorePatterns: ['/.c9/metadata/']
};
