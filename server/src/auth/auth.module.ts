import { jwtModuleAsyncOptions } from "@config/jwt-module.config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EmailService } from "src/email/email.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [PrismaModule, JwtModule.registerAsync(jwtModuleAsyncOptions()), PassportModule],
    controllers: [AuthController],
    providers: [AuthService, EmailService, UserService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
