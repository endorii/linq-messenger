import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateContactDto {
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    @MaxLength(30)
    nickname?: string;
}
