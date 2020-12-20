import AbstractMod from '../AbstractMod';
import Config from './Config';
import SensorConfig from './SensorConfig';
const fs = require('fs');

export default class Mod1Wire extends AbstractMod {

  public static readonly BASE_PATH_1WIRE = '/sys/bus/w1/devices';

  protected config: Config = new Config();
  protected name: string = 'MOD_1WIRE';

  protected async exec(): Promise<void|string> {
    let hasError = false;

    this.config.sensors.forEach((sensor: SensorConfig): void => {
      const path = `${Mod1Wire.BASE_PATH_1WIRE}/${sensor.id}/w1_slave`;
      try {
        const value =  fs.readFileSync(path);
        this.log(`1wire - ${sensor.id} - ${value}`);
        this.addDataToSend(sensor.name, value);
      } catch(e) {
        this.log(`1wire - ${sensor.id} not detected`);
        hasError = true;
      }
    });

    if (hasError) {
      throw new Error();
    }
  }
}
