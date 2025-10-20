import { IsArray, IsString } from "class-validator";

export class CreateForwardMessageDto {
    @IsArray()
    @IsString({ each: true })
    chatIds: string[];

    @IsString()
    messageId: string;
}
