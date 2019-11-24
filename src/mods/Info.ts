import { AbstractMod, ConfigInterface } from './AbstractMod';

import shell = require('shelljs');

export class ModInfo extends AbstractMod {
  protected config?: ModInfoConfig;

  public constructor(config?: ModInfoConfig) {
    super('MOD_INFO');
    this.config = config;
    this.init();
  }

  protected exec(): void {
    if (shell.which('vcgencmd')) {
      this.log(shell.exec('vcgencmd measure_temp'));
    }
    this.endOk();
  }
}

export interface ModInfoConfig extends ConfigInterface {}
