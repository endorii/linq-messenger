import { IsNotEmpty, IsString } from "class-validator";

export class CreatePinnedMessageDto {
    @IsString()
    @IsNotEmpty()
    messageId: string;
}
