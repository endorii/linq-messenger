import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateContactDto {
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    nickname?: string;
}
