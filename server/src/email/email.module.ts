import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get<string>("MAIL_HOST"),
                    port: config.get<number>("MAIL_PORT"),
                    secure: config.get<boolean>("MAIL_SECURE"), // true for 465, false for 587
                    auth: {
                        user: config.get<string>("MAIL_USER"),
                        pass: config.get<string>("MAIL_PASS"),
                    },
                },
                defaults: {
                    from: `"No Reply" <${config.get<string>("MAIL_USER")}>`,
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
