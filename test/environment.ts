import os from 'os';
import { Environment } from '@app/constants';
import { getEnvVar } from './utilities/environment';

export class AppEnvironment {

  public pgUrl: string;
  public useFork: boolean;
  public forkCount: number;
  public port: number;

  constructor() {
    const envForkCount = getEnvVar(Environment.forkCount);
    const processLimit = !!envForkCount
      ? parseInt(envForkCount, 10)
      : os.cpus().length;

    const forkMatch = /(y|yes|t|true)/i;
    const fork = (getEnvVar(Environment.fork) || 'TRUE').toLowerCase();

    this.useFork = forkMatch.test(fork);
    this.forkCount = this.useFork ? processLimit : 0; 
    this.pgUrl = getEnvVar(Environment.pgUrl);
  }
}
