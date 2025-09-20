import { IsString } from "class-validator";

export class LoginUserDto {
    @IsString({ message: "Username should be a string" })
    username: string;

    @IsString({ message: "Password should be a string" })
    password: string;
}
