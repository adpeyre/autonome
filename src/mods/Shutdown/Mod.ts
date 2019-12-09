import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class ModShutdown extends AbstractMod {
  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_SHUTDOWN';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    this.log(`Countdown inited. Shutdown in  ${this.config.timeout} seconds if process is not finished.`);
    setTimeout((): void => {
      this.log('Shutdown by timeout');
      this.app.halt(true);
    }, this.config.timeout * 1000);
    this.endOk();
  }
}
