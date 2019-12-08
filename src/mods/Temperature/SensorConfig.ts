import { IsString } from 'class-validator';

export default class SensorType {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}
