import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';

import shell = require('shelljs');

export default class extends AbstractMod {
  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_INFO';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    if (shell.which('vcgencmd')) {
      this.log(shell.exec('vcgencmd measure_temp'));
    }
    this.endOk();
  }
}
