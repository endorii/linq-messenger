import { IsOptional, IsString } from "class-validator";

export class CreatePrivateChatDto {
    @IsString()
    userId: string;
}

export class CreateGroupChatDto {
    @IsString()
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    avatar?: string;

    @IsString()
    adminId: string;

    @IsString({ each: true })
    memberIds: string[];
}

export class CreateChannelDto {
    @IsString()
    name: string;

    @IsOptional()
    description?: string;

    @IsString()
    adminId: string;
}
