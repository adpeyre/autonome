import AbstractMod from '../AbstractMod';
import Config from './Config';

const FtpClient = require('@icetee/ftp');
const fs = require('fs');

export default class ModUpload extends AbstractMod {
  protected config: Config = new Config();

  protected name = 'MOD_UPLOAD';

  protected async exec(): Promise<void|string> {
    const promises: Promise<boolean>[] = [];
    const client = new FtpClient();

    client.on('ready', (): void => {
      fs.readdir(this.app.getAppConfig().directory, (err: NodeJS.ErrnoException, files: string[]): void => {
        files.forEach((file: string): void => {
          promises.push(this.uploadFile(client, file));
        });

        Promise.all(promises).then((): void => {
          client.end();
        });
      });
    });

    client.connect(this.config.ftp);

    return new Promise((resolve, reject) => {
      client.on('end', (): void => {
        resolve();
      });

      client.on('error', (err: Error): void => {
        reject(err.message);
      });
    });
  }

  /* eslint @typescript-eslint/no-explicit-any: 'off' */
  protected uploadFile(client: any, file: string): Promise<boolean> {
    return new Promise((resolve): void => {
      client.put(`${this.app.getAppConfig().directory}/${file}`, `${this.config.remoteDir}/${file}`, false, (err: Error): void => {
        if (err) {
          this.log(`${file}: ${err.message}`);
          return resolve(false);
        }

        this.log(`${file}: Ok`);
        return resolve(true);
      });
    });
  }
}
