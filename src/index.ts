import 'reflect-metadata';
import App from './App';
import AbstractMod from './mods/AbstractMod';

import RunnerDependency from './tools/RunnerDependency';
import ModsLoader from './tools/ModsLoader';

const mkdirp = require('mkdirp');

const app = new App();

process.on('unhandledRejection', (e: Error): void => {
  app.logger.error(`${e}`);
  app.halt();
});

app.loadConfig(process.argv.length >= 3 ? process.argv[2] : null).then((): void => {
  mkdirp(app.getAppConfig().directory, (err: string): void => {
    if (err) {
      throw new Error(`Impossible to create base directory: ${err}`);
    }
  });

  const importedMods = ModsLoader.import(require.context('./mods/', true, /\/Mod\.ts$/));
  const mods: { [key: string]: AbstractMod } = {};
  for (const [name, ImportedMod] of Object.entries(importedMods)) {
    mods[name] = new ImportedMod(app);
  }

  app.launchMod(mods.MOD_INFO);
  app.launchMod(mods.MOD_TEMPERATURE);
  app.launchMod(mods.MOD_NOTIFY, [
    new RunnerDependency(mods.MOD_UPLOAD),
    new RunnerDependency(mods.MOD_INTERNET, RunnerDependency.FAILURE),
  ]);
  app.launchMod(mods.MOD_SNAPSHOT);
  app.launchMod(mods.MOD_SHUTDOWN);
  app.launchMod(mods.MOD_INTERNET);
  app.launchMod(mods.MOD_UPLOAD, [
    new RunnerDependency(mods.MOD_TEMPERATURE),
    new RunnerDependency(mods.MOD_INTERNET, RunnerDependency.FAILURE),
    new RunnerDependency(mods.MOD_SNAPSHOT),
  ]);

  app.allModsAreFinished().then((): void => {
    app.getAllMods().forEach((mod: AbstractMod): void => mod.stop());
    app.logger.info('All process finished');
    app.halt();
  });
});
