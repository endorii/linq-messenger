import { IsEnum, IsOptional } from "class-validator";
import { PrivacyLevel } from "generated/prisma";

export class UpdatePrivacyDto {
    @IsOptional() @IsEnum(PrivacyLevel) phoneVisibility?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) lastSeenVisibility?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) bioVisibility?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) voiceMessages?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) messages?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) addMe?: PrivacyLevel;
    @IsOptional() @IsEnum(PrivacyLevel) usernameVisibility?: PrivacyLevel;
}
