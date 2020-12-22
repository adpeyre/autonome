import { IsArray, IsString } from 'class-validator';

import ModConfigInterface from '../ModConfigInterface';

export default class implements ModConfigInterface {
    @IsArray()
    @IsString({ each: true })
    commands!: string[];
}
