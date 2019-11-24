import { AbstractMod, ConfigInterface } from './AbstractMod';

const shell = require('shelljs');

export class ModInternet extends AbstractMod {
  protected config?: ModInternetConfig;

  public constructor(config?: ModInternetConfig) {
    super('MOD_INTERNET');
    this.config = config;
    this.init();
  }

  protected exec(): void {
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
      this.endOk();
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

  protected configChecker(): boolean {
    if (!this.config.ipTest) {
      return false;
    }

    if ('mobile' in this.config) {
      if (!('wvdial' in this.config.mobile) || !('interface' in this.config.mobile) || !('pin' in this.config.mobile)) {
        return false;
      }
    }

    return true;
  }

  protected dependencyChecker(): boolean {
    return shell.which('ping') && (!('mobile' in this.config) || shell.which('wvdial'));
  }
}

export interface ModInternetConfig extends ConfigInterface {
  ipTest: string;

  mobile?: MobileType;
}

interface MobileType {
  wvdial: string;
  interface: string;
  pin: string;
}
