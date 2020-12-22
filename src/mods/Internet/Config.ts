import { IsPositive, IsString } from 'class-validator';

import ModConfigInterface from '../ModConfigInterface';

export default class implements ModConfigInterface {
  @IsString()
  ipTest: string = '8.8.8.8';

  @IsPositive()
  delayBetweenAttempts: number = 5000;

  @IsPositive()
  maxRetries: number = 10;
}
