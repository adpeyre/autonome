import { AbstractMod } from '../mods/AbstractMod';

export default class RunnerDependency {
  public static readonly FAILURE = 'FAILURE';

  public static readonly CONTINUE = 'CONTINUE';

  private dependency: AbstractMod;

  public method: string;

  public constructor(dependency: AbstractMod, method: string = RunnerDependency.CONTINUE) {
    this.dependency = dependency;
    this.method = method;
  }

  public getPromise(): Promise<boolean> {
    return this.dependency.end();
  }
}
