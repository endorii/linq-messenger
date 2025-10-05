import { IsEmail, IsString, MinLength, Matches, ValidateIf } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @IsString()
    @MinLength(3, { message: "Username must be at least 3 characters long" })
    username: string;

    @ValidateIf((o: CreateUserDto) => o.phone != null && o.phone !== "")
    @Matches(/^\+?[0-9]{7,15}$/, {
        message: "Phone number must be valid",
    })
    phone?: string | null;

    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    password: string;

    @IsString()
    @MinLength(2, { message: "First name must be at least 2 characters long" })
    firstName: string;

    @ValidateIf((o: CreateUserDto) => o.lastName != null && o.lastName !== "")
    @MinLength(2, { message: "Last name must be at least 2 characters long" })
    lastName?: string | null;
}
