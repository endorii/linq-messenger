import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "src/email/email.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "src/user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtModuleAsyncOptions } from "@config/jwt-module.config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [PrismaModule, JwtModule.registerAsync(jwtModuleAsyncOptions()), PassportModule],
    controllers: [AuthController],
    providers: [AuthService, EmailService, UserService, JwtStrategy],
})
export class AuthModule {}
