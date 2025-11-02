import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthenticatedRequest } from "./interfaces/authenticated-request.interface";
import { GoogleAuthRequest } from "./interfaces/google-auth-request.interface";
import { RefreshTokenRequest } from "./interfaces/refresh-token-request.interface";

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

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { message: "Login succesfully!", data: { accessToken } };
    }

    @Post("refresh")
    async refreshTokens(
        @Req() req: RefreshTokenRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies.refreshToken?.trim();
        if (!refreshToken) throw new UnauthorizedException("No refresh token, please login");

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
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        } else {
            throw new BadRequestException("No refresh token to logout");
        }

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

    @Get("google")
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Ініціює Google OAuth flow
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(
        @Req() req: GoogleAuthRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const { accessToken, refreshToken } = await this.authService.googleLogin(req.user);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: this.configService.get("NODE_ENV") === "production",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            // Редірект на фронтенд з токеном
            const frontendUrl: string =
                this.configService.get("FRONTEND_URL") || "http://localhost:3000";
            return res.redirect(`${frontendUrl}/callback?token=${accessToken}`);
        } catch (error) {
            console.log(error);

            const frontendUrl: string =
                this.configService.get("FRONTEND_URL") || "http://localhost:3000";
            return res.redirect(`${frontendUrl}/signin?error=google_auth_failed`);
        }
    }
}
