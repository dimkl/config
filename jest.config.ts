/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  testRegex: ["/.*/__tests__/.*.test.ts"],
  coverageReporters: ["json-summary", "text", "lcov"],
};
