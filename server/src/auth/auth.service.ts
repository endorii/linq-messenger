import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as crypto from "crypto";
import { EmailService } from "src/email/email.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) {}

    async registerUser(userData: RegisterUserDto) {
        try {
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

            const newUser = await this.userService.createUser(userData);

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
}
