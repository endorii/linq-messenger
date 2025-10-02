import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { EmailService } from "src/email/email.service";
import { UserService } from "src/user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as dayjs from "dayjs";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async registerUser(userData: RegisterUserDto) {
        try {
            const newUser = await this.userService.createUser(userData);

            const verificationToken = crypto.randomBytes(32).toString("hex");
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await this.userService.updateVerificationData(
                newUser.id,
                verificationToken,
                tokenExpiry
            );

            await this.emailService.sendVerificationEmail(newUser.email, verificationToken);

            return {
                message:
                    "User has been successfully created. A confirmation message has been sent to your email address.",
            };
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }

    async verifyEmail(token: string) {
        const user = await this.userService.findByVerificationToken(token);

        if (
            !user ||
            !user.verificationTokenExpires ||
            user.verificationTokenExpires.getTime() < Date.now()
        ) {
            throw new BadRequestException("Invalid/outdated token or user not found");
        }

        await this.userService.verifyUser(user.id);

        return { message: "Mail successfully verified!" };
    }

    async resendVerificationEmail(email: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (user.isVerified) {
            return { message: "Account already verified" };
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

        await this.userService.updateVerificationData(
            user.id,
            verificationToken,
            verificationTokenExpires
        );

        await this.emailService.sendVerificationEmail(user.email, verificationToken);

        return { message: "Confirmation email resent" };
    }

    async loginUser(userData: LoginUserDto) {
        const existingUser = await this.userService.findByUsername(userData.username);
        if (!existingUser) throw new ConflictException("Wrong login or password");

        const isPasswordMatch = await bcrypt.compare(userData.password, existingUser.password);
        if (!isPasswordMatch) throw new ConflictException("Wrong login or password");

        const accessToken = this.jwtService.sign({
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
        });

        const { refreshToken } = await this.getRefreshToken(existingUser.id);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken: string) {
        const tokenInDb = await this.prisma.token.findFirst({
            where: { refreshToken },
            include: { user: true },
        });

        if (!tokenInDb) {
            throw new BadRequestException("Invalid refresh token");
        }

        if (tokenInDb.expiresIn.getTime() < Date.now()) {
            await this.prisma.token.deleteMany({ where: { id: tokenInDb.id } });
            throw new BadRequestException("Refresh token expired");
        }

        const newToken = await this.getRefreshToken(tokenInDb.userId);

        await this.prisma.token.deleteMany({ where: { id: tokenInDb.id } });

        const accessToken = this.jwtService.sign({
            id: tokenInDb.user.id,
            username: tokenInDb.user.username,
            email: tokenInDb.user.email,
        });

        return {
            accessToken,
            refreshToken: newToken.refreshToken,
        };
    }

    async logout(refreshToken: string) {
        await this.prisma.token.delete({
            where: { refreshToken },
        });
        return { message: "Logged out successfully" };
    }

    async logoutAll(userId: string) {
        await this.prisma.token.deleteMany({
            where: { userId },
        });
        return { message: "Logged out from all devices" };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new NotFoundException("User not found");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    private async getRefreshToken(userId: string) {
        const currentDate = dayjs();
        const expiresDate = currentDate.add(1, "month").toDate();

        return await this.prisma.token.create({
            data: {
                refreshToken: crypto.randomBytes(64).toString("hex"),
                expiresIn: expiresDate,
                userId,
            },
        });
    }
}
