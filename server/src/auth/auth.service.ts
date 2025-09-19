import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { EmailService } from "src/email/email.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService
    ) {}
    async registerUser(userData: CreateUserDto) {
        try {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: userData.username },
            });

            if (existingUsername) {
                throw new ConflictException(
                    `Username "${existingUsername.username}" already taken`
                );
            }

            const existingEmail = await this.prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingEmail) {
                throw new ConflictException("This email already exist");
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const verificationToken = crypto.randomBytes(32).toString("hex");
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

            const newUser = await this.prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    phone: userData.phone,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    hashedPassword,

                    isVerified: false,
                    verificationToken,
                    verificationTokenExpires: tokenExpiry,
                },
            });

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
        const user = await this.prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (
            !user ||
            !user.verificationTokenExpires ||
            user.verificationTokenExpires.getTime() < Date.now()
        ) {
            throw new BadRequestException("Invalid/outdated token or user not found");
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });

        return { message: "Mail successfully verified!" };
    }

    async resendVerificationEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (user.isVerified) {
            return { message: "Account already verified" };
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { verificationToken, verificationTokenExpires },
        });

        await this.emailService.sendVerificationEmail(user.email, verificationToken);

        return { message: "Confirmation email resent" };
    }
}
