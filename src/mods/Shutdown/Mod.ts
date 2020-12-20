import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class ModShutdown extends AbstractMod {

  protected config: Config = new Config();
  protected name: string = 'MOD_SHUTDOWN';

  protected async exec(): Promise<void|string> {
    this.log(`Countdown inited. Shutdown in  ${this.config.timeout} seconds if process is not finished.`);
    setTimeout((): void => {
      this.log('Shutdown by timeout');
      this.app.halt(true);
    }, this.config.timeout * 1000);
  }
}
