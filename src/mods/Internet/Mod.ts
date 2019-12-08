import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';

const shell = require('shelljs');

export default class ModInternet extends AbstractMod {
  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_INTERNET';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    if (!this.config.mobile) {
      ModInternet.testConnection(this.config.ipTest, true)
        .then(() => {
          this.endOk('Connected');
        })
        .catch(() => {
          this.endErr('No connection');
        });

      return;
    }

    ModInternet.testConnection(this.config.ipTest, true).catch((): void => {
      shell.exec(`find /dev -name ${this.config.mobile.interface}`, { silent: true }, (code: number): void => {
        if (code === 0) {
          this.mobileConnection().catch((): void => {
            this.stop();
            this.mobileConnection();
          });
        } else {
          this.endErr();
        }
      });
    });

    ModInternet.testConnection(this.config.ipTest).then((): void => {
      this.endOk('Connection established');
    });
  }

  protected mobileConnection(): Promise<void> {
    return new Promise((resolve, reject): void => {
      shell.exec(`echo "AT+CPIN=${this.config.mobile.pin}" > ${this.config.mobile.interface}`, (): void => {
        shell.exec(`wvdial --config=${this.config.mobile.wvdial}`, {}, (code: number): void => {
          if (code !== 0) {
            reject();
          }
          resolve();
        });
      });
    });
  }

  public stop(): void {
    shell.exec('killall -2 wvdial', { silent: true });
  }

  public static testConnection(ip: string, once?: boolean): Promise<void> {
    return new Promise((resolve, reject): void => {
      const interval = setInterval((): void => {
        shell.exec(`ping ${ip} -c1 -W3`, { silent: true }, (code: number): void => {
          if (once) {
            code === 0 ? resolve() : reject();
            clearTimeout(interval);
          } else if (code === 0) {
            resolve();
            clearTimeout(interval);
          }
        });
      }, 5000);
    });
  }

  protected dependencyChecker(): boolean {
    return shell.which('ping') && (!('mobile' in this.config) || shell.which('wvdial'));
  }
}
