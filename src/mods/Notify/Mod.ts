import axios, { AxiosError } from 'axios';
import { URLSearchParams } from 'url';
import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class ModNotify extends AbstractMod {
  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_NOTIFY';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  public exec(): void {
    const params = new URLSearchParams();
    params.append('log', `${this.app.getLogs().join('\n')}`);
    for (const [key, value] of Object.entries(this.app.getDataToSend())) {
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
        this.endErr(e.message);
      });
  }
}
