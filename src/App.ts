import * as Logger from 'js-logger';
import { ILogger, IContext } from 'js-logger/src/types';
import { AbstractMod, ConfigInterface } from './mods/AbstractMod';
import RunnerDependency from './tools/RunnerDependency';

const fs = require('fs');

export default class App {
  private config: GlobalConfigInterface;

  public logger: ILogger;

  private modsLaunched: AbstractMod[] = [];

  private timer: number = 0;

  private logs: string[] = [];

  private dataToSend: { [key: string]: string } = {};

  public constructor() {
    this.launchTimer();
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

  public loadConfig(path?: string): Promise<Error> {
    return new Promise((resolve, reject): void => {
      if (path === null) {
        reject(new Error('Config file have to be provided'));
      }
      fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer): void => {
        if (err) {
          reject(new Error(`Config is missing: ${err}`));
        }

        try {
          this.config = JSON.parse(data.toString());
          resolve();
        } catch {
          reject(new Error('Impossible to parse configuration file.'));
        }
      });
    });
  }

  public getConfig(key: string): ConfigInterface | null {
    if (!(key in this.config)) {
      return null;
    }

    return this.config[key];
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

  protected launchTimer(): void {
    setInterval((): void => {
      this.timer += 1;
    }, 1000);
  }
}

interface GlobalConfigInterface {
  [key: string]: ConfigInterface;
}
