/* eslint-disable @typescript-eslint/no-var-requires */
require('reflect-metadata');

const dotenv = require('dotenv');
const { existsSync } = require('fs');

if (existsSync('./.env')) dotenv.config();

module.exports = {
  "moduleFileExtensions": [ "js", "json", "ts" ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};
