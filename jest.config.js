/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // globalSetup: 'jest-preset-angular/global-setup',
  projects: [
    '<rootDir>/angularfire-app',
    '<rootDir>/angularfire-compat-app',
    '<rootDir>/firebase-app',
    '<rootDir>/firebase-compat-app',
    '<rootDir>/.examples'
  ],
};
