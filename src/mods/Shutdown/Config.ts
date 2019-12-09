import { IsInt } from 'class-validator';
import ModConfigInterface from '../ModConfigInterface';

export default class implements ModConfigInterface {
  @IsInt()
  timeout: number;
}
