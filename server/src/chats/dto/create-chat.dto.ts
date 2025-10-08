import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ChatType } from "generated/prisma";

export class CreatePrivateChatDto {
    @IsString()
    otherUserId: string;
}

export class CreateChatDto {
    @IsString()
    @MinLength(1, { message: "Name must be at least 1 character long" })
    name: string;

    @IsEnum(ChatType)
    @IsNotEmpty()
    type: ChatType;

    @IsOptional()
    description?: string;

    @IsOptional()
    avatar?: string;

    @IsString({ each: true })
    memberIds?: string[];
}
