import { execSync as shellExec } from 'child_process';

import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class ModInternet extends AbstractMod {
  protected config: Config = new Config();

  protected name: string = 'MOD_INTERNET';

  protected async exec(): Promise<void|string> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        attempts += 1;

        const isSuccessConnection = ModInternet.testConnection(this.config.ipTest);
        if (isSuccessConnection || attempts >= this.config.maxRetries) {
          clearInterval(interval);
          if (isSuccessConnection) {
            resolve('Connection established');
          } else {
            reject(new Error('Connection cannot be established'));
          }
        }
      }, this.config.delayBetweenAttempts);
    });
  }

  public static testConnection(ip: string): boolean {
    try {
      shellExec(`ping ${ip} -c1 -W3`, {
        stdio: [null, null]
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  protected requiredCommands(): string[] {
    return ['ping'];
  }
}
