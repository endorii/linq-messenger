import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsBoolean,
    IsInt,
    IsDateString,
} from "class-validator";
import { MemberRole } from "generated/prisma";

export class CreateChatMemberDto {
    @IsString()
    @IsNotEmpty()
    chatId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(MemberRole)
    @IsOptional()
    role?: MemberRole = MemberRole.MEMBER;

    @IsBoolean()
    @IsOptional()
    isMarked?: boolean;

    @IsBoolean()
    @IsOptional()
    isMuted?: boolean;

    @IsDateString()
    @IsOptional()
    muteUntil?: string;

    @IsInt()
    @IsOptional()
    pinnedOrder?: number;

    @IsBoolean()
    @IsOptional()
    isArchived?: boolean;
}
