import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ModConfigInterface from '../ModConfigInterface';

export default class implements ModConfigInterface {
  @IsString()
  ipTest: string = '8.8.8.8';
}
