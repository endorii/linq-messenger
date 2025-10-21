import { IsArray, IsString } from "class-validator";

export class CreateForwardMessagesDto {
    @IsArray()
    @IsString({ each: true })
    chatIds: string[];

    @IsArray()
    @IsString({ each: true })
    messageIds: string[];
}
