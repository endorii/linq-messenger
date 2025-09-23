import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request, Response } from "express";
import { RefreshTokenRequest } from "./interfaces/refresh-token-request.interface";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthenticatedRequest } from "./interfaces/authenticated-request.interface";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Post("signup")
    registerUser(@Body() registerUserData: RegisterUserDto) {
        return this.authService.registerUser(registerUserData);
    }

    @Get("verify")
    verifyEmail(@Query("token") token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post("resend-verification")
    async resendVerification(@Body("email") email: string) {
        return this.authService.resendVerificationEmail(email);
    }

    @Post("signin")
    async loginUser(
        @Body() loginUserData: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.loginUser(loginUserData);

        // Set refreshToken into httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return { message: "Login succesfully!", data: { accessToken } };
    }

    @Post("refresh")
    async refreshTokens(
        @Req() req: RefreshTokenRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const { accessToken, refreshToken: newRefreshToken } =
            await this.authService.refreshTokens(refreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }

    @Post("logout")
    async logout(@Req() req: RefreshTokenRequest, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) await this.authService.logout(refreshToken);

        res.clearCookie("refreshToken");
        return { message: "Logged out successfully" };
    }

    @Post("logout-all")
    async logoutAll(@Body("userId") userId: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logoutAll(userId);
        res.clearCookie("refreshToken");
        return { message: "Logged out from all devices" };
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthenticatedRequest) {
        return this.authService.getProfile(req.user.id);
    }
}
