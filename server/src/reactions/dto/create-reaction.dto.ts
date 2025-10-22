import { IsString } from "class-validator";

export class CreateReactionDto {
    @IsString()
    messageId: string;

    @IsString()
    emoji: string;
}
