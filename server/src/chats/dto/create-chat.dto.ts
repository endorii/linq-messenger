import { IsOptional, IsString, MinLength } from "class-validator";

export class CreatePrivateChatDto {
    @IsString()
    otherUserId: string;
}

export class CreateGroupChatDto {
    @MinLength(1, { message: "Name must be at least 1 character long" })
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    avatar?: string;

    @IsString({ each: true })
    memberIds: string[];
}

export class CreateChannelDto {
    @IsString()
    @MinLength(1, { message: "Name must be at least 1 character long" })
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    avatar?: string;

    @IsString({ each: true })
    memberIds: string[];
}
