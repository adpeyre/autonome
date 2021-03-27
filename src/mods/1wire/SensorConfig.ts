import { IsString } from 'class-validator';

export default class SensorType {
  @IsString()
  id!: string;

  @IsString()
  name!: string;
}
