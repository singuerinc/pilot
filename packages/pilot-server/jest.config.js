module.exports = {
  rootDir: './',
  moduleFileExtensions: ['js'],
  testMatch: ['**/__tests__/*.(test|spec).js'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**'],
  coverageDirectory: './coverage'
};
