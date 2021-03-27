import axios from 'axios';
import { URLSearchParams } from 'url';

import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class ModNotify extends AbstractMod {
  protected config: Config = new Config();

  protected name: string = 'MOD_NOTIFY';

  public async exec(): Promise<void|string> {
    const params = new URLSearchParams();
    params.append('log', `${this.app.getLogs().join('\n')}`);
    for (const [key, value] of Object.entries(this.app.getDataToSend())) {
      params.append(key, value);
    }

    const axiosConfig = Object.assign(this.config.axios, {
      data: params
    });

    await axios(axiosConfig);
  }
}
