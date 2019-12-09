import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';
import CamConfig from './CamConfig';

import shell = require('shelljs');

const NodeWebcam = require('node-webcam');

export default class ModSnapshot extends AbstractMod {
  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_SNAPSHOT';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    const promises: Promise<Error>[] = [];

    this.config.cams.forEach((cam: CamConfig): void => {
      promises.push(this.capture(cam, promises));
    });

    Promise.all(promises).then((capturesResume: []): void => {
      capturesResume.forEach((resume: string, index: number): void => {
        this.log(`${this.config.cams[index].filename}: ${resume}`);
      });

      if (capturesResume.find(cr => cr !== null)) {
        this.endErr();
      } else {
        this.endOk();
      }
    });
  }

  private capture(opts: CamConfig, waitingPromises: Promise<Error>[]): Promise<Error | null> {
    return new Promise((resolve): void => {
      Promise.all(waitingPromises).finally((): void => {
        const filename = `${this.app.getAppConfig().directory}/${opts.filename}`;
        NodeWebcam.capture(filename, opts.fswebcam, (err: Error | null): void => {
          resolve(err);
        });
      });
    });
  }

  protected dependencyChecker(): boolean {
    return shell.which('fswebcam') !== '';
  }
}
