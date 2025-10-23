import { IsEnum, IsOptional } from "class-validator";
import { PrivacyLevel } from "generated/prisma";

export class UpdatePrivacyDto {
    @IsOptional() @IsEnum(PrivacyLevel) phoneVisibility?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) lastSeen?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) bio?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) dateOfBirth?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) calls?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) voiceMessages?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) messages?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) addMe?: PrivacyLevel;
}
