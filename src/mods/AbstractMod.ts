import { validateSync } from 'class-validator';
import App from '../App';
import ModConfigInterface from './ModConfigInterface';
import {plainToClassFromExist} from "class-transformer";
import { execSync as shellExec } from 'child_process';
const EventBus = require('eventbusjs');


export default abstract class AbstractMod {
  protected app: App;

  protected running!: Promise<boolean>;

  protected abstract config: ModConfigInterface;
  protected abstract name: string;

  public constructor(app: App) {
    this.app = app;
  }

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
        this,
      );
    });

    if (!this.config) {
      return;
    }

    const validationErrors = validateSync(this.config, { skipMissingProperties: false });
    if (validationErrors.length > 0) {
      this.endThrow(validationErrors[0].toString(true, false));
    }

    if (!this.dependencyChecker()) {
      throw new Error(`Missing external dependency for module ${this.getName()}`);
    }
  }

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

  public stop(): void {}

  public skip(): void {
    this.endOk('Skipped');
  }

  public endOk(msg: string|void): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, true, msg);
  }

  public endErr(msg?: string): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, false, msg);
  }

  public endThrow(msg: string): void {
    throw new Error(`${this.name}: \n ${msg}`);
  }

  public end(): Promise<boolean> {
    return this.running;
  }

  protected abstract async exec(): Promise<void|string>;

  public log(log: string): void {
    if (this) {
      const modName = `[${this.name}]`.padEnd(20, '.');
      this.app.logger.info(`${modName} ${log}`);
    }
  }

  public addDataToSend(key: string, value: string): void {
    this.app.addDataToSend(key, value);
  }

  public getName(): string {
    return this.name;
  }

  protected commandExists(cmd: string): boolean {
    try {
      shellExec(`which ${cmd}`);
      return true;
    } catch(e) {
      return false;
    }
  }

  protected dependencyChecker(): boolean {
    return true;
  }
}
