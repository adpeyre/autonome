import App from '../App';

const EventBus = require('eventbusjs');

export abstract class AbstractMod {
  public static app: App;

  protected running: Promise<boolean>;

  protected abstract config?: ConfigInterface;

  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  protected init(): void {
    if (!this.config) {
      return;
    }

    if (!this.configChecker()) {
      throw new Error(`Incorrect config for module ${this.getName()}`);
    }

    if (!this.dependencyChecker()) {
      throw new Error(`Missing external dependency for module ${this.getName()}`);
    }

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
  }

  public start(): void {
    if (!this.config) {
      this.endOk();
      return;
    }

    this.log('Starting');
    this.exec();
  }

  public stop(): void {}

  public skip(): void {
    this.endOk('Skipping');
  }

  public endOk(msg?: string): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, true, msg);
  }

  public endErr(msg?: string): void {
    EventBus.dispatch(`MOD_FINISHED_${this.name}`, this, false, msg);
  }

  public end(): Promise<boolean> {
    return this.running;
  }

  protected abstract exec(): void;

  public log(log: string): void {
    if (this) {
      AbstractMod.app.logger.info(`[${this.name}]: ${log}`);
    }
  }

  public addDataToSend(key: string, value: string): void {
    AbstractMod.app.addDataToSend(key, value);
  }

  public getName(): string {
    return this.name;
  }

  protected configChecker(): boolean {
    return true;
  }

  protected dependencyChecker(): boolean {
    return true;
  }
}

export interface ConfigInterface {}
