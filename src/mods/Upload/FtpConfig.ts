import { IsString } from 'class-validator';

export default class FtpType {
  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  host: string;
}
