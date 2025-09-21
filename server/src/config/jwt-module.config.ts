import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get<string>("JWT_SECRET"),
    signOptions: {
        expiresIn: config.get<string>("JWT_EXPIRES") || "5m",
    },
});

export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
