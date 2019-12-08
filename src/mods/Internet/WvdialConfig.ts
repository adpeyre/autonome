import { IsString } from 'class-validator';

export default class WvdialConfig {
  @IsString()
  wvdial: string;

  @IsString()
  interface: string;

  @IsString()
  pin: string;
}
