import * as Logger from 'js-logger';
import { ILogger, IContext } from 'js-logger/src/types';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import AbstractMod from './mods/AbstractMod';
import RunnerDependency from './tools/RunnerDependency';
import AppConfig from './AppConfig';

const fs = require('fs');

export default class App {
  private config: { [key: string]: any };

  private appConfig: AppConfig;

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
      },
    );
  }

  public async loadConfig(path?: string): Promise<void> {
    if (path === null) {
      throw new Error('Config file have to be provided');
    }

    const data = fs.readFileSync(path);
    this.config = JSON.parse(data.toString());
    this.appConfig = plainToClass(AppConfig, this.config.APP);

    if (!this.appConfig) {
      throw new Error('App section is missing in your configuration file.');
    }

    const validationErrors = validateSync(this.appConfig, { skipMissingProperties: false });
    if (validationErrors.length > 0) {
      throw new Error(Object.values(validationErrors).join());
    }
  }

  public getAppConfig(): AppConfig {
    return this.appConfig;
  }

  public getConfigSection(section: string): { [key: string]: any | null } {
    if (!(section in this.config)) {
      return null;
    }

    return this.config[section];
  }

  public getConfigKey(section: string, key: string): any | null {
    const configSection = this.getConfigSection(section);
    if (!configSection) {
      return null;
    }

    return configSection[key];
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
      /* eslint @typescript-eslint/no-explicit-any: 'off' */
      formatter: (messages: any[]): void => {
        messages.unshift(`{t${this.timer}} => `);
      },
    });
    Logger.setLevel(Logger.TRACE);
    /* eslint @typescript-eslint/no-explicit-any: 'off' */
    Logger.setHandler((messages: any[], context: IContext): void => {
      const messagesFiltered = Object.values(messages).map((msg: any): string => {
        if (typeof msg === 'object') {
          if (msg.stderr) {
            return msg.stderr;
          }

          return msg.stdout;
        }

        return msg;
      });
      this.logs.push(...messagesFiltered);
      consoleHandler(messagesFiltered, context);
    });

    return Logger.get('Application');
  }

  protected startTimer(): void {
    setInterval((): void => {
      this.timer += 1;
    }, 1000);
  }
}
