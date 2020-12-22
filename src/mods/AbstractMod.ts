import { plainToClassFromExist } from 'class-transformer';

import CommandExists from '../tools/CommandExists';
import App from '../App';
import ModConfigInterface from './ModConfigInterface';
import ConfigValidator from '../tools/ConfigValidator';

const EventBus = require('eventbusjs');

export default abstract class AbstractMod {
  protected app: App;

  protected running!: Promise<boolean>;

  protected abstract config: ModConfigInterface;

  protected abstract name: string;

  public constructor(app: App) {
    this.app = app;
  }

  /**
   * @internal
   * Initialize and check module's requirements
   */
  public init(): void {
    this.config = plainToClassFromExist(this.config, this.app.getConfigSection(this.name));

    this.running = new Promise((resolve): void => {
      EventBus.addEventListener(
        `MOD_FINISHED_${this.name}`,
        (event: string, status: boolean, msg?: string): void => {
          this.log(`Finished ${status ? '[OK]' : '[KO]'} ${msg ? `- ${msg}` : ''}`);
          EventBus.removeEventListener(`MOD_FINISHED_${this.name}`);
          resolve(status);
        },
        this
      );
    });

    if (!this.config) {
      return;
    }

    const modConfigErrors = ConfigValidator.validates(this.config);
    if (0 < modConfigErrors.length) {
      this.endThrow(modConfigErrors.join());
    }

    this.requiredCommands().forEach((cmd) => {
      if (!CommandExists.check(cmd)) {
        this.endThrow(`Command "${cmd}" is required`);
      }
    });
  }

  /**
   * @internal
   * Starts this module if config is provided. Skip otherwise
   */
  public start(): void {
    if (!this.config) {
      this.skip();
      return;
    }

    this.log('Starting');
    this.exec().then((msg) => {
      this.endOk(msg);
    }).catch((err) => {
      this.endErr(err);
    });
  }

  /**
   * @internal
   * Waiting ending of this module
   * Promise resolved when the module finished
   */
  public end(): Promise<boolean> {
    return this.running;
  }

  /**
   * @internal
   * Skip execution of this module
   */
  public skip(): void {
    this.endOk('Skipped');
  }

  /**
   * Cleanly stop the execution of this module
   */
  public stop(): void {
    // Override this method if treatment is needed when stop forced
  }

  /**
   * Module terminates successfully
   */
  public endOk(msg: string|void): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, true, msg);
  }

  /**
   * Module terminates unsuccessfully
   */
  public endErr(msg?: string): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, false, msg);
  }

  /**
   * Module terminates unsuccessfully and programme has to be stopped
   */
  public endThrow(msg: string): void {
    throw new Error(`${this.name}: \n ${msg}`);
  }

  /**
   * Module body
   */
  protected abstract async exec(): Promise<void|string>;

  /**
   * Log information about execution of this module
   */
  public log(log: string): void {
    if (this) {
      const modName = `[${this.name}]`.padEnd(20, '.');
      this.app.logger.info(`${modName} ${log}`);
    }
  }

  /**
   * Data to send
   */
  public addDataToSend(key: string, value: string): void {
    this.app.addDataToSend(key, value);
  }

  /**
   * List of required commands needed for this module
   */
  protected requiredCommands(): string[] {
    return [];
  }
}
