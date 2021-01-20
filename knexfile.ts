require('ts-node/register');

import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('./.env')) dotenv.config();

function envVar(name: string): string {
  return process.env[name] ?? '';
}

module.exports = {
  connection: envVar('DATABASE_URL'),
  pool: { min: 1, max: 10 },
  client: 'pg',
  migrations: {
    extension: 'ts',
    directory: __dirname + '/migrations',
  },
};
