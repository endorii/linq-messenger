import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "src/email/email.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, EmailService],
})
export class AuthModule {}
