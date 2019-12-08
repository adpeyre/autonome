import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import FswebcamConfig from './FswebcamConfig';

export default class CamConfig {
  @IsString()
  filename: string;

  @ValidateNested()
  @Type(() => FswebcamConfig)
  fswebcam: FswebcamConfig;
}
