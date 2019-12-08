import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';

const FtpClient = require('ftp');

const fs = require('fs');

export default class ModUpload extends AbstractMod {
  protected static WAIT_BEFORE = 5000;

  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_UPLOAD';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    const promises: Promise<boolean>[] = [];
    const client = new FtpClient();

    fs.readdir(this.app.getAppConfig().directory, (err: NodeJS.ErrnoException, files: string[]): void => {
      files.forEach((file: string): void => {
        promises.push(this.uploadFile(client, file));
      });

      Promise.all(promises).then((): void => {
        this.endOk();
      });
    });

    client.on('end', (): void => {
      this.endOk();
    });

    client.on('error', (err: Error): void => {
      this.endErr(err.message);
    });

    setTimeout((): void => {
      client.connect(this.config.ftp);
    }, ModUpload.WAIT_BEFORE);
  }

  /* eslint @typescript-eslint/no-explicit-any: 'off' */
  protected uploadFile(client: any, file: string): Promise<boolean> {
    return new Promise((resolve): void => {
      client.on('ready', (): void => {
        client.put(`${this.app.getAppConfig().directory}/${file}`, `${this.config.remoteDir}/${file}`, (err: Error): void => {
          if (err) {
            this.log(`${file}: ${err.message}`);
            return resolve(false);
          }

          this.log(`${file}: Ok`);
          return resolve(true);
        });
      });
    });
  }
}
