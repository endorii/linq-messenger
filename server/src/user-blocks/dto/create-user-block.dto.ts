import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserBlockDto {
    @IsString()
    @IsNotEmpty()
    userIdBlock: string;
}
