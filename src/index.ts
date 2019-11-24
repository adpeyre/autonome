import App from './App';
import { AbstractMod } from './mods/AbstractMod';

import { ModInfo, ModInfoConfig } from './mods/Info';
import { ModShutdown, ModShutdownConfig } from './mods/Shutdown';
import { ModSnapshot, ModSnapshotConfig } from './mods/Snapshot';
import { ModUpload, ModUploadConfig } from './mods/Upload';
import { ModNotify, ModNotifyConfig } from './mods/Notify';
import { ModInternet, ModInternetConfig } from './mods/Internet';
import { ModTemperature, ModTemperatureConfig } from './mods/Temperature';
import RunnerDependency from './tools/RunnerDependency';

const mkdirp = require('mkdirp');

const app = new App();

process.on('unhandledRejection', (e: Error): void => {
  app.logger.error(`${e}`);
  app.halt();
});

app
  .loadConfig(process.argv.length >= 3 ? process.argv[2] : null)
  .catch((e: string): void => {
    throw new Error(e);
  })
  .then((): void => {
    AbstractMod.app = app;

    mkdirp(app.getConfig('directory'), (err: string): void => {
      if (err) {
        throw new Error(`Impossible to create base directory: ${err}`);
      }
    });

    const modInfo = new ModInfo(app.getConfig('MOD_INFO') as ModInfoConfig);
    const modShutdown = new ModShutdown(app.getConfig('MOD_SHUTDOWN') as ModShutdownConfig);
    const modSnapshot = new ModSnapshot(app.getConfig('MOD_SNAPSHOT') as ModSnapshotConfig);
    const modUpload = new ModUpload(app.getConfig('MOD_UPLOAD') as ModUploadConfig);
    const modNotify = new ModNotify(app.getConfig('MOD_NOTIFY') as ModNotifyConfig);
    const modInternet = new ModInternet(app.getConfig('MOD_INTERNET') as ModInternetConfig);
    const modTemperature = new ModTemperature(app.getConfig('MOD_TEMPERATURE') as ModTemperatureConfig);

    app.launchMod(modInfo);
    app.launchMod(modShutdown);
    app.launchMod(modInternet);
    app.launchMod(modSnapshot);
    app.launchMod(modTemperature);
    app.launchMod(modUpload, [
      new RunnerDependency(modTemperature),
      new RunnerDependency(modInternet, RunnerDependency.FAILURE),
      new RunnerDependency(modSnapshot),
    ]);
    app.launchMod(modNotify, [new RunnerDependency(modUpload), new RunnerDependency(modInternet, RunnerDependency.FAILURE)]);

    app.allModsAreFinished().then((): void => {
      app.getAllMods().forEach((mod: AbstractMod): void => mod.stop());
      app.logger.info('All process finished');
      app.halt();
    });
  });
