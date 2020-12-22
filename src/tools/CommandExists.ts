import { execSync as shellExec } from 'child_process';

export default new (class CommandExists {
  public check(command: string): boolean {
    try {
      shellExec(`which ${command}`);
      return true;
    } catch (e) {
      return false;
    }
  }
})();
