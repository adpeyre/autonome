import * as path from 'path';

// eslint-disable-next-line no-undef
import RequireContext = __WebpackModuleApi.RequireContext;

export default class ModsLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static import(require: RequireContext): { [key: string]: any } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modules: { [key: string]: any } = {};
    require.keys().forEach((key) => {
      // eslint-disable-next-line import/no-dynamic-require
      const module = require(key);
      if (module.default) {
        const name = ModsLoader.getModuleName(key);
        modules[name] = module.default;
      }
    });

    return modules;
  }

  static getModuleName(modulePath: string): string {
    const modName = path
      .dirname(modulePath)
      .replace('./', '')
      .toUpperCase();

    return `MOD_${modName}`;
  }
}
