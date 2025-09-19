import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @Post("signin")
    // loginUser(loginUserData) {
    //     return null;
    // }

    @Post("signup")
    registerUser(@Body() userData: CreateUserDto) {
        return this.authService.registerUser(userData);
    }

    @Get("verify")
    verifyEmail(@Query("token") token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post("resend-verification")
    async resendVerification(@Body("email") email: string) {
        return this.authService.resendVerificationEmail(email);
    }
}
