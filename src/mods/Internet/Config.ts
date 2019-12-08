import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ModConfigInterface from '../ModConfigInterface';
import WvdialConfig from './WvdialConfig';

export default class implements ModConfigInterface {
  @IsString()
  ipTest: string;

  @ValidateNested()
  @Type(() => WvdialConfig)
  @IsOptional()
  mobile?: WvdialConfig;
}
