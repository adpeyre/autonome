import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ModConfigInterface from '../ModConfigInterface';
import FtpConfig from './FtpConfig';

export default class implements ModConfigInterface {
  @ValidateNested()
  @Type(() => FtpConfig)
  ftp!: FtpConfig;

  @IsString()
  remoteDir!: string;
}
