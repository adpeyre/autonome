import { AbstractMod, ConfigInterface } from './AbstractMod';

import shell = require('shelljs');

const NodeWebcam = require('node-webcam');

export class ModSnapshot extends AbstractMod {
  protected config?: ModSnapshotConfig;

  public constructor(config?: ModSnapshotConfig) {
    super('MOD_SNAPSHOT');
    this.config = config;
    this.init();
  }

  protected exec(): void {
    const promises: Promise<Error>[] = [];

    this.config.cams.forEach((cam: CamType): void => {
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

  private capture(opts: CamType, waitingPromises: Promise<Error>[]): Promise<Error | null> {
    return new Promise((resolve): void => {
      Promise.all(waitingPromises).finally((): void => {
        const filename = `${AbstractMod.app.getConfig('directory')}/${opts.filename}`;
        NodeWebcam.capture(filename, opts.fswebcam, (err: Error | null): void => {
          resolve(err);
        });
      });
    });
  }

  protected configChecker(): boolean {
    if (!this.config.cams || !Array.isArray(this.config.cams)) {
      return false;
    }

    for (const cam of this.config.cams) {
      if (!cam.filename || !cam.fswebcam || typeof cam.filename !== 'string') {
        return false;
      }
    }

    return true;
  }

  protected dependencyChecker(): boolean {
    return shell.which('fswebcam') !== '';
  }
}

export interface ModSnapshotConfig extends ConfigInterface {
  cams: CamType[];
}

interface CamType {
  filename: string;
  fswebcam: FswebcamType;
}

interface FswebcamType {
  quality?: number;
  delay?: number;
  rotate?: number;
  device?: string;
  verbose?: boolean;
  skip?: number;
}
