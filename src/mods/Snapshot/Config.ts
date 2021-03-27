import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import ModConfigInterface from '../ModConfigInterface';
import CamConfig from './CamConfig';

export default class implements ModConfigInterface {
  @IsArray()
  @ValidateNested()
  @Type(() => CamConfig)
  cams!: CamConfig[];
}
