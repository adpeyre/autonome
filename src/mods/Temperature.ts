import { AbstractMod, ConfigInterface } from './AbstractMod';

import shell = require('shelljs');

export class ModTemperature extends AbstractMod {
  public static readonly BASE_PATH_1WIRE = '/sys/bus/w1/devices';

  public static readonly TYPE_1_WIRE = '1_WIRE';

  protected config?: ModTemperatureConfig;

  public constructor(config?: ModTemperatureConfig) {
    super('MOD_TEMPERATURE');
    this.config = config;
    this.init();
  }

  protected exec(): void {
    const hasError = false;

    this.config.sensors.forEach((sensor: SensorType): void => {
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

  protected configChecker(): boolean {
    if (!this.config.sensors || !Array.isArray(this.config.sensors)) {
      return false;
    }

    for (const sensor of this.config.sensors) {
      if (!sensor.type || !sensor.name || !sensor.id) {
        return false;
      }
    }

    return true;
  }
}

export interface ModTemperatureConfig extends ConfigInterface {
  sensors: SensorType[];
}

interface SensorType {
  type: string;
  id: string;
  name: string;
}
