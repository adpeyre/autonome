import { AbstractMod, ConfigInterface } from './AbstractMod';

const FtpClient = require('ftp');

const fs = require('fs');

export class ModUpload extends AbstractMod {
  protected static WAIT_BEFORE = 5000;

  protected config?: ModUploadConfig;

  public constructor(config?: ModUploadConfig) {
    super('MOD_UPLOAD');
    this.config = config;
    this.init();
  }

  protected exec(): void {
    const promises: Promise<boolean>[] = [];
    const client = new FtpClient();

    fs.readdir(this.config.localDir, (err: NodeJS.ErrnoException, files: string[]): void => {
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
        client.put(`${this.config.localDir}/${file}`, `${this.config.remoteDir}/${file}`, (err: Error): void => {
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

  protected configChecker(): boolean {
    return (
      typeof this.config.ftp.user === 'string' &&
      typeof this.config.ftp.password === 'string' &&
      typeof this.config.ftp.host === 'string' &&
      typeof this.config.localDir === 'string' &&
      typeof this.config.remoteDir === 'string'
    );
  }
}

export interface ModUploadConfig extends ConfigInterface {
  ftp: FtpType;

  localDir: string;

  remoteDir: string;
}

interface FtpType {
  user: string;

  password: string;

  host: string;
}
