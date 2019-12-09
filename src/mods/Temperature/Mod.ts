import { plainToClass } from 'class-transformer';
import AbstractMod from '../AbstractMod';
import Config from './Config';
import SensorConfig from './SensorConfig';

import shell = require('shelljs');

export default class ModTemperature extends AbstractMod {
  public static readonly BASE_PATH_1WIRE = '/sys/bus/w1/devices';

  public static readonly TYPE_1_WIRE = '1_WIRE';

  protected config?: Config;

  protected load(): void {
    this.name = 'MOD_TEMPERATURE';
    this.config = plainToClass(Config, this.app.getConfigSection(this.name));
  }

  protected exec(): void {
    const hasError = false;

    this.config.sensors.forEach((sensor: SensorConfig): void => {
      let value: string = null;
      if (sensor.type === ModTemperature.TYPE_1_WIRE) {
        value = this.oneWire(sensor.id);
      }

      this.addDataToSend(sensor.name, value);
    });

    hasError ? this.endErr() : this.endOk();
  }

  protected oneWire(id: string): string | null {
    const path = `${ModTemperature.BASE_PATH_1WIRE}/${id}/w1_slave`;
    if (shell.test('-f', path)) {
      const value = shell.cat(path);
      this.log(`1wire - ${id} - ${value}`);
      const values = value.match(/t=([0-9]+)/);
      return values[1];
    }

    this.log(`1wire - ${id} not detected`);

    return null;
  }
}
