import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export default class FswebcamConfig {
  @IsInt()
  @IsOptional()
  quality?: number;

  @IsInt()
  @IsOptional()
  delay?: number;

  @IsInt()
  @IsOptional()
  rotate?: number;

  @IsString()
  @IsOptional()
  device?: string;

  @IsBoolean()
  @IsOptional()
  verbose?: boolean;

  @IsInt()
  @IsOptional()
  skip?: number;
}
