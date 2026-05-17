/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Tell Jest the tests moved inside the src folder
  roots: ['<rootDir>/src/tests'],
  // Point to the correct setup file location
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};