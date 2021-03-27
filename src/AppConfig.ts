import { IsString } from 'class-validator';

export default class AppConfig {
  @IsString()
  directory!: string;
}
