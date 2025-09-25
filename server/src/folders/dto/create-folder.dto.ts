import { IsString, MinLength } from "class-validator";

export class CreateFolderDto {
    @IsString()
    @MinLength(2, { message: "Folder name must be at least 2 characters long" })
    name: string;
}
