const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

export default {
  collectCoverageFrom: ['out/**/*.js'],
  coverageReporters: ['html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 85.75,
      functions: nodeVersion >= 26 ? 95.75 : 96.25,
      lines: 90,
      statements: -249,
    },
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/*(*.)@(spec|test).js?(x)'],
  transform: {},
};
