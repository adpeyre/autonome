import { execSync as shellExec } from 'child_process';

import AbstractMod from '../AbstractMod';
import Config from './Config';

export default class extends AbstractMod {
  protected config: Config = new Config();

  protected name: string = 'MOD_COMMAND';

  protected async exec(): Promise<void|string> {
    for (const command of this.config.commands) {
      const beforeTxt = `Running "${command}"`;
      try {
        const result = shellExec(command, {
          stdio: [null, null]
        });
        this.log(`${beforeTxt}\n\n${result.toString()}`);
      } catch (e) {
        this.log(`${beforeTxt}\n\n${e.stderr}`);
      }
    }
  }
}
