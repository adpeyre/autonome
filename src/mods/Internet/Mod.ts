import AbstractMod from '../AbstractMod';
import Config from './Config';
import { execSync as shellExec } from 'child_process';

export default class ModInternet extends AbstractMod {

  protected config: Config = new Config();
  protected name: string = 'MOD_INTERNET';

  protected async exec(): Promise<void|string> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (ModInternet.testConnection(this.config.ipTest)) {
          clearTimeout(interval);
          resolve('Connection established');
        }
      }, 4000);
    });
  }

  public static testConnection(ip: string): boolean {
    try {
      shellExec(`ping ${ip} -c1 -W3`);
      return true;
    } catch(e) {
      return false;
    }
  }

  protected dependencyChecker(): boolean {
    return this.commandExists('ping');
  }
}
