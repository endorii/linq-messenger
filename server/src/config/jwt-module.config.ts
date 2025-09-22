import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get<string>("ACCESS_TOKEN_SECRET"),
    signOptions: {
        expiresIn: config.get<string>("ACCESS_TOKEN_EXPIRES") || "10m",
    },
});

export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
