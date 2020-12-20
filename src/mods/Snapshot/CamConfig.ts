import {IsObject, IsString, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

export default class CamConfig {
  @IsString()
  filename!: string;

  @IsObject()
  fswebcam!: object;
}
