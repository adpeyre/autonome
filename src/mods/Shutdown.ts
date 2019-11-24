import { AbstractMod, ConfigInterface } from './AbstractMod';

export class ModShutdown extends AbstractMod {
  protected config?: ModShutdownConfig;

  public constructor(config?: ModShutdownConfig) {
    super('MOD_SHUTDOWN');
    this.config = config;
    this.init();
  }

  protected exec(): void {
    this.log(`Countdown inited. Shutdown in  ${this.config.timeout} seconds if process is not finished.`);
    setTimeout((): void => {
      this.log('Shutdown by timeout');
      AbstractMod.app.halt(true);
    }, this.config.timeout * 1000);
    this.endOk();
  }

  protected configChecker(): boolean {
    return typeof this.config.timeout === 'number';
  }
}

export interface ModShutdownConfig extends ConfigInterface {
  timeout: number;
}
