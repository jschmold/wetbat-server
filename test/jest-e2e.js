/* eslint-disable @typescript-eslint/no-var-requires */
require('reflect-metadata');

const dotenv = require('dotenv');
const { existsSync } = require('fs');

if (existsSync('./.env')) dotenv.config();

console.log(process.env.DATABASE_URL);

module.exports = {
  "moduleFileExtensions": [ "js", "json", "ts" ],
  "moduleNameMapper": {
    "@app(.*)": "<rootDir>/../src$1.ts",
    "@e2e(.*)": "<rootDir>/../test$1",
  },
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};
