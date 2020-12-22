import { IsObject, IsString } from 'class-validator';

export default class CamConfig {
  @IsString()
  filename!: string;

  @IsObject()
  fswebcam!: object;
}
