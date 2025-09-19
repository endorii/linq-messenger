import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ) {}

    async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${this.configService.get<string>("FRONTEND_URL")}/verify?token=${token}`;

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: "Confirm Your Registration in LINQ",
                html: `
            <div style="background-color: #121212; padding: 30px; font-family: Arial, sans-serif; color: #f5f5f5;">
                <h2 style="color: #ffffff; text-align: center;">Welcome to LINQ 🎉</h2>
                <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                    Please click the button below to verify your email address and complete your registration.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                        style="padding: 12px 24px; border: 1px solid #fff; background-color: #000; color: #ffffff; 
                               text-decoration: none; border-radius: 6px; font-weight: bold; 
                               display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p style="font-size: 14px; color: #bbbbbb; text-align: center;">
                    If you didn’t create an account, you can safely ignore this email.
                </p>
            </div>
        `,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error while sending email: ${error.message}`);
            } else {
                console.error("Unknown error while sending email.");
            }
            throw new InternalServerErrorException("Failed to send verification email.");
        }
    }
}
