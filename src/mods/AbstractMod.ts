import { validateSync } from 'class-validator';
import App from '../App';
import ModConfigInterface from './ModConfigInterface';

const EventBus = require('eventbusjs');

export default abstract class AbstractMod {
  protected app: App;

  protected running: Promise<boolean>;

  protected abstract config?: ModConfigInterface;

  protected name: string;

  public constructor(app: App) {
    this.app = app;
    this.load();
    this.init();
  }

  protected abstract load(): void;

  protected init(): void {
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
      this.endThrow(Object.values(validationErrors).join());
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
    this.exec();
  }

  public stop(): void {}

  public skip(): void {
    this.endOk('Skipped');
  }

  public endOk(msg?: string): void {
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

  protected abstract exec(): void;

  public log(log: string): void {
    if (this) {
      this.app.logger.info(`[${this.name}]: ${log}`);
    }
  }

  public addDataToSend(key: string, value: string): void {
    this.app.addDataToSend(key, value);
  }

  public getName(): string {
    return this.name;
  }

  protected dependencyChecker(): boolean {
    return true;
  }
}
