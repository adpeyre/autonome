import * as Logger from 'js-logger';
import { ILogger } from 'js-logger';
import { plainToClass } from 'class-transformer';

import AbstractMod from './mods/AbstractMod';
import RunnerDependency from './tools/RunnerDependency';
import AppConfig from './AppConfig';
import ModConfigInterface from './mods/ModConfigInterface';
import ConfigValidator from './tools/ConfigValidator';

const fs = require('fs');

export default class App {
  private config!: { [key: string]: any };

  private appConfig!: AppConfig;

  public logger: ILogger;

  private modsLaunched: AbstractMod[] = [];

  private timer: number = 0;

  private logs: string[] = [];

  private dataToSend: { [key: string]: string } = {};

  public constructor() {
    this.startTimer();
    this.logger = this.createLogger();
  }

  public launchMod(mod: AbstractMod, deps: RunnerDependency[] = []): void {
    this.modsLaunched.push(mod);

    Promise.all(deps.map((rd: RunnerDependency): Promise<boolean> => rd.getPromise())).then(
      (dependencyStatus: boolean[]): void => {
        for (let i = 0; i < dependencyStatus.length; i += 1) {
          const ok = dependencyStatus[i];

          if (!ok && deps[i].method === RunnerDependency.FAILURE) {
            return mod.skip();
          }
        }

        return mod.start();
      }
    );
  }

  public async loadConfig(path: string|null): Promise<void> {
    if (null === path) {
      throw new Error('Config file has to be provided');
    }

    const data = fs.readFileSync(path);
    this.config = JSON.parse(data.toString());
    this.appConfig = plainToClass(AppConfig, this.config.APP);

    if (!this.appConfig) {
      throw new Error('APP section is missing in your configuration file.');
    }

    const appConfigErrors = ConfigValidator.validates(this.appConfig);
    if (0 < appConfigErrors.length) {
      throw new Error(Object.values(appConfigErrors).join());
    }
  }

  public getAppConfig(): AppConfig {
    return this.appConfig;
  }

  public getConfigSection(section: string): ModConfigInterface | null {
    if (!(section in this.config)) {
      return null;
    }

    return this.config[section];
  }

  public halt(force?: boolean): void {
    process.exit(force ? 1 : 0);
  }

  public getAllMods(): AbstractMod[] {
    return this.modsLaunched;
  }

  public allModsAreFinished(): Promise<boolean[]> {
    return Promise.all(this.modsLaunched.map((mod: AbstractMod): Promise<boolean> => mod.end()));
  }

  public getLogs(): string[] {
    return this.logs;
  }

  public addDataToSend(key: string, value: string): void {
    this.dataToSend[key] = value;
  }

  public getDataToSend(): object {
    return this.dataToSend;
  }

  protected createLogger(): ILogger {
    const consoleHandler = Logger.createDefaultHandler({
      formatter: (): void => {}
    });

    /* eslint @typescript-eslint/no-explicit-any: 'off' */
    Logger.setHandler((messages: any[], context): void => {
      const messagesFiltered = Object.values(messages).map((msg: any): string => {
        if ('object' === typeof msg) {
          if (msg.stderr) {
            return msg.stderr;
          }

          return msg.stdout;
        }

        return msg;
      });

      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer - minutes * 60;
      messagesFiltered.unshift(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `);
      this.logs.push(...messagesFiltered);
      consoleHandler(messagesFiltered, context);
    });
    const myLogger = Logger.get('Application');
    myLogger.setLevel({ value: 1, name: 'trace' });

    return myLogger;
  }

  protected startTimer(): void {
    setInterval((): void => {
      this.timer += 1;
    }, 1000);
  }
}
