import { ValidateNested } from 'class-validator';
import { AxiosRequestConfig } from 'axios';

import ModConfigInterface from '../ModConfigInterface';

export default class implements ModConfigInterface {
  @ValidateNested()
  axios!: AxiosRequestConfig;
}
