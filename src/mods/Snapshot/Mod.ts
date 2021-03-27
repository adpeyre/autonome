import AbstractMod from '../AbstractMod';
import Config from './Config';
import CamConfig from './CamConfig';

const NodeWebcam = require('node-webcam');

export default class ModSnapshot extends AbstractMod {
  protected config: Config = new Config();

  protected name: string = 'MOD_SNAPSHOT';

  /* eslint no-await-in-loop: "off" */
  protected async exec(): Promise<void|string> {
    let hasErrors = false;

    for (const cam of this.config.cams) {
      const resume = await this.capture(cam);
      this.log(`${cam.filename}: ${null !== resume ? resume.message : 'Ok'}`);
      if (null !== resume) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      throw new Error();
    }
  }

  private capture(opts: CamConfig): Promise<Error | null> {
    return new Promise((resolve): void => {
      const filename = `${this.app.getAppConfig().directory}/${opts.filename}`;
      NodeWebcam.capture(filename, opts.fswebcam, (err: Error | null): void => {
        resolve(err);
      });
    });
  }

  protected requiredCommands(): string[] {
    return ['fswebcam'];
  }
}
