/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  reporters: ["default", "github-actions"], // <- この行を足す
};

module.exports = config;
