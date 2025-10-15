import { IsArray, ArrayNotEmpty, IsString } from "class-validator";

export class AddNewMembersDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    memberIds: string[];
}
