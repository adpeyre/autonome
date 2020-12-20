import ModConfigInterface from '../ModConfigInterface';
import {IsArray, IsString, ValidateNested} from "class-validator";

export default class implements ModConfigInterface {
    @IsArray()
    @IsString({each: true})
    commands!: string[];
}
