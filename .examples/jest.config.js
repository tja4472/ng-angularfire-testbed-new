/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {
    // '^@app1/services/(.*)$': '<rootDir>/src/app/services/$1',
    '^#libs/(.*)$': '<rootDir>/../libs/$1/src/public-api.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
};
