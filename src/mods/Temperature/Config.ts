import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ModConfigInterface from '../ModConfigInterface';
import SensorConfig from './SensorConfig';

export default class implements ModConfigInterface {
  @IsArray()
  @ValidateNested()
  @Type(() => SensorConfig)
  sensors: SensorConfig[];
}
