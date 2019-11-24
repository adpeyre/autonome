import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { URLSearchParams } from 'url';
import { AbstractMod, ConfigInterface } from './AbstractMod';

export class ModNotify extends AbstractMod {
  protected config?: ModNotifyConfig;

  public constructor(config?: ModNotifyConfig) {
    super('MOD_NOTIFY');
    this.config = config;
    this.init();
  }

  public exec(): void {
    const params = new URLSearchParams();
    params.append('log', `${ModNotify.app.getLogs().join('\n')}`);
    for (const [key, value] of Object.entries(AbstractMod.app.getDataToSend())) {
      params.append(key, value);
    }

    const axiosConfig = Object.assign(this.config.axios, {
      data: params,
    });

    axios(axiosConfig)
      .then((): void => {
        this.endOk();
      })
      .catch((e: AxiosError): void => {
        this.endErr(e.response?.statusText);
      });
  }

  protected configChecker(): boolean {
    return 'axios' in this.config;
  }
}

export interface ModNotifyConfig extends ConfigInterface {
  axios: AxiosRequestConfig;
}
